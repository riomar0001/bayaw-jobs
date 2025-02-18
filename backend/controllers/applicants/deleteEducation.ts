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
 * @description Delete an applicant's education
 * @route DELETE /api/applicants/:education_id
 * @access Private (authentication middleware required)
 */
export const deleteEducation = async (req: Request, res: Response) => {
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

    // Check if education exists and belongs to the applicant
    const existingEducation = await prisma.applicants_education.findFirst({
      where: {
        id: education_id,
        applicants_account_id: applicant_id,
      },
    });

    if (!existingEducation) {
      return res.status(404).json({
        success: false,
        user_type: "applicant",
        message: "Education not found",
      });
    }

    // Delete the education from db
    await prisma.applicants_education.delete({
      where: { id: education_id },
    });

    return res.status(200).json({
      success: true,
      user_type: "applicant",
      message: "Education deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting education:", error);

    return res.status(500).json({
      success: false,
      user_type: "applicant",
      message: "Internal server error",
      error: error.message,
    });
  }
};

export default deleteEducation;