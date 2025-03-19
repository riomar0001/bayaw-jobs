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
 * @description Delete social media for the authenticated applicant
 * @route DELETE /api/applicants/social-media
 * @access Private (authentication middleware required)
 */
export const deleteSocialMedia = async (req: Request, res: Response) => {
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

    // Check if social media exists for the applicant
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

    // Delete the social media entry from the database
    await prisma.applicants_social_media.delete({
      where: {
        applicants_account_id: applicant_id,
      },
    });

    return res.status(200).json({
      success: true,
      user_type: "applicant",
      message: "Social Media deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting social media:", error);

    return res.status(500).json({
      success: false,
      user_type: "applicant",
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export default deleteSocialMedia;