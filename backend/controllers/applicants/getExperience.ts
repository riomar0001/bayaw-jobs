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
 * @description Get all experiences for the authenticated applicant
 * @route GET /api/applicants/experiences
 * @access Private
 */
export const getAllExperiences = async (req: Request, res: Response) => {
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

    const experiences = await prisma.applicants_experience.findMany({
      where: { applicants_account_id: applicant_id },
    });

    return res.status(200).json({
      success: true,
      user_type: "applicant",
      message: "Experiences found",
      data: experiences,
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
 * @description Get a specific experience for the authenticated applicant by experience ID
 * @route GET /api/applicants/experiences/:experience_id
 * @access Private
 */
export const getExperienceById = async (req: Request, res: Response) => {
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
    const { experience_id } = req.params;

    const experience = await prisma.applicants_experience.findUnique({
      where: {
        id: experience_id,
        applicants_account_id: applicant_id,
      },
    });

    if (!experience) {
      return res.status(404).json({
        success: false,
        user_type: "applicant",
        message: "Experience not found",
      });
    }

    return res.status(200).json({
      success: true,
      user_type: "applicant",
      message: "Experience found",
      data: experience,
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

export default { getAllExperiences, getExperienceById };