import { Response, Request } from "express";
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
 * @description Add or update social media for the authenticated applicant
 * @route POST /api/applicants/social-media
 * @access Private
 */
export const addSocialMedia = async (req: Request, res: Response) => {
  try {
    const { facebook, twitter, linkedin, github } = req.body;

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

    // Use upsert to either update or create the social media entry
    const social_media = await prisma.applicants_social_media.upsert({
      where: { applicants_account_id: applicant_id },
      update: {
        facebook,
        twitter,
        linkedin,
        github,
        updated_at: new Date(),
      },
      create: {
        applicants_account_id: applicant_id,
        facebook,
        twitter,
        linkedin,
        github,
      },
    });

    return res.status(200).json({
      success: true,
      user_type: "applicant",
      message: "Social media added or updated successfully",
      data: social_media,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      user_type: "applicant",
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export default addSocialMedia;