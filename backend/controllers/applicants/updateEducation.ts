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
 * @description Adds a new education entry for an applicant
 * @route PUT /api/applicants/onboarding
 * @access Private (authentication middleware required)
 */

export const updateEducation = async (req: Request, res: Response) => {
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
    const { school_name, degree, field_of_study, start_date, end_date } = req.body;
    
    if (!school_name || !degree || !field_of_study || !start_date || !end_date) {
      return res.status(400).json({
        success: false,
        user_type: "applicant",
        message: "All fields are required",
        applicants_account_id: applicant_id,
      });
    }

    const existingEducation = await prisma.applicants_education.findUnique({
        where: {
            id: education_id,
        },
        });

    if (!existingEducation) {  
        return res.status(404).json({
            success: false,
            user_type: "applicant",
            error: "Education not found",
        });
    }

    const updateQuery = await prisma.applicants_education.update({
      where: {
        id: education_id,
      },
      data: {
        school_name,
        degree,
        field_of_study,
        start_date,
        end_date,
        updated_at: new Date(),
      },
    });

    if (!updateQuery) {
      return res.status(400).json({
        success: false,
        user_type: "applicant",
        message: "Failed to update education",
      });
    }

    res.status(200).json({
      success: true,
      user_type: "applicant",
      message: "Education Successfully Updated",
      data: updateQuery,
    });

  } catch (error: any) {
    console.error("Error updatating education:", error);
    res.status(500).json({
      success: false,
      user_type: "applicant",
      message: "Internal Server error",
      error: error.message,
    });
  }
};

export default updateEducation;