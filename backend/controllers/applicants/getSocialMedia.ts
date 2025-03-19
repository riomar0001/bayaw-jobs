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
 * @description Get social media for the authenticated applicant
 * @route GET /api/applicants/social-media
 * @access Private
 */
export const getAllSocialMedia = async (req: Request, res: Response) => {
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

    // Fetch the social media entry for the authenticated applicant
    const social_media = await prisma.applicants_social_media.findUnique({
      where: { applicants_account_id: applicant_id },
    });

    if (!social_media) {
      return res.status(404).json({
        success: false,
        user_type: "applicant",
        message: "Social Media not found",
      });
    }

    return res.status(200).json({
      success: true,
      user_type: "applicant",
      message: "Social Media found",
      data: social_media,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

/**
 * @description Get a specific social media entry by its ID
 * @route GET /api/applicants/social-media/:social_media_id
 * @access Private
 */
export const getSocialMediaById = async (req: Request, res: Response) => {
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
    const { social_media_id } = req.params;

    // Fetch the specific social media entry by its unique ID
    const social_media = await prisma.applicants_social_media.findUnique({
        where: {
            id: social_media_id,
            applicants_account_id: applicant_id,
          },
    });

    if (!social_media) {
      return res.status(404).json({
        success: false,
        user_type: "applicant",
        message: "Social Media not found",
      });
    }

    return res.status(200).json({
      success: true,
      user_type: "applicant",
      message: "Social Media found",
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

export default { getAllSocialMedia, getSocialMediaById };