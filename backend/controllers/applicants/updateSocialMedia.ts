import { Request, Response } from "express";
import prisma from "@/configs/prismaConfig";
import jwt from "jsonwebtoken";

interface DecodedApplicantToken {
  applicant: {
    id: string;
    username: string;
    email: string;
    done_onboarding: boolean;
  };
}

/**
 * @description Update social media for the authenticated applicant
 * @route PUT /api/applicants/social-media
 * @access Private (authentication middleware required)
 */
export const updateSocialMedia = async (req: Request, res: Response) => {
  try {
    const applicant_token = req.cookies.applicant_access_token;

    if (!applicant_token) {
      return res.status(401).json({
        success: false,
        user_type: "applicant",
        message: "Unauthorized - No token provided",
      });
    }

    const applicant_token_info = jwt.verify(
      applicant_token,
      process.env.JWT_SECRET_APPLICANT!
    ) as DecodedApplicantToken;

    const applicant_id = applicant_token_info.applicant.id;
    const { facebook, twitter, linkedin, github } = req.body;

    if (!facebook && !twitter && !linkedin && !github) {
      return res.status(400).json({
        success: false,
        user_type: "applicant",
        message: "At least one social media field is required",
      });
    }

    const existingSocialMedia = await prisma.applicants_social_media.findUnique({
      where: {
        applicants_account_id: applicant_id,
      },
    });

    if (!existingSocialMedia) {
      return res.status(404).json({
        success: false,
        user_type: "applicant",
        message: "Social Media not found",
      });
    }

    const updateQuery = await prisma.applicants_social_media.update({
      where: {
        applicants_account_id: applicant_id,
      },
      data: {
        facebook,
        twitter,
        linkedin,
        github,
        updated_at: new Date(),
      },
    });

    if (!updateQuery) {
      return res.status(400).json({
        success: false,
        user_type: "applicant",
        message: "Failed to update social media",
      });
    }

    res.status(200).json({
      success: true,
      user_type: "applicant",
      message: "Social Media Successfully Updated",
      data: updateQuery,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      success: false,
      user_type: "applicant",
      message: "Internal Server error",
      error: error.message,
    });
  }
};

export default updateSocialMedia;