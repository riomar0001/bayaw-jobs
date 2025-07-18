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
 * @route POST /api/applicants/onboarding
 * @access Private (authentication middleware required)
 */

export const addEducation = async (req: Request, res: Response) => {
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

    const { school_name, degree, field_of_study, start_date, end_date } = req.body;
    
    if (!school_name || !degree || !field_of_study || !start_date || !end_date) {
      return res.status(400).json({
        success: false,
        user_type: "applicant",
        message: "All fields are required",
      });
    }

    const createQuery = await prisma.applicants_education.create({
      data: {
        school_name,
        degree,
        field_of_study,
        start_date,
        end_date,
        applicants: {
          connect: {
            id: applicant_id,
          },
        },
      },
    });

    //fail
    if (!createQuery) {
      return res.status(400).json({
        success: false,
        user_type: "applicant",
        message: "Failed to add education",
      });
    }
    //success
    return res.status(200).json({
      success: true,
      user_type: "applicant",
      message: "Education added successfully",
      data: createQuery,
    });

  } catch (error: any) {
    console.error("Error adding experience:", error);

    return res.status(500).json({
      success: false,
      user_type: "applicant",
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export default addEducation;