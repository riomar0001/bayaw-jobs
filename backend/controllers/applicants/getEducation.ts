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
 * @description Get all education for the authenticated applicant
 * @route GET /api/applicants/education
 * @access Private
 */
export const getAllEducation = async (req: Request, res: Response) => {
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

    const education = await prisma.applicants_education.findMany({
      where: { applicants_account_id: applicant_id },
    });

    if (!education) {
      return res.status(404).json({
        success: false,
        user_type: "applicant",
        message: "Education not found",
      });
    }

    return res.status(200).json({
      success: true,
      user_type: "applicant",
      message: "Education found",
      data: education,
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
 * @description Get a specific education for the authenticated applicant by education ID
 * @route GET /api/applicants/education/:education_id
 * @access Private
 */
export const getEducationById = async (req: Request, res: Response) => {
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
    const { education_id } = req.params;

    // Fetch the specific education entry by its unique ID
    const education = await prisma.applicants_education.findUnique({
      where: {
        id: education_id,
      },
    });

    // Check if the education entry belongs to the authenticated applicant
    if (!education || education.applicants_account_id !== applicant_id) {
      return res.status(404).json({
        success: false,
        user_type: "applicant",
        message: "Education not found",
      });
    }

    return res.status(200).json({
      success: true,
      user_type: "applicant",
      message: "Education found",
      data: education,
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

export default { getAllEducation, getEducationById };