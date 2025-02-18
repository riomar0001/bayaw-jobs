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
 * @description Update applicant experience
 * @route PUT /api/applicants/:experience_id
 * @access Private (authentication middleware required)
 */
export const updateExperience = async (req: Request, res: Response) => {
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
    const { company, location, position, worked_years } = req.body;

    if (!company || !location || !position || !worked_years) {
      return res.status(400).json({
        success: false,
        user_type: "applicant",
        message: "Please provide all required fields",
      });
    }

    // if applicant exists
    const applicantExists = await prisma.applicants_experience.count({
      where: { id: applicant_id },
    });

    if (applicantExists === 0) {
      return res.status(404).json({
        success: false,
        user_type: "applicant",
        error: "Applicant not found",
      });
    }

    // if exp exists
    const existingExperience = await prisma.applicants_experience.findUnique({
      where: {
        id: experience_id,
        applicants_account_id: applicant_id, // Ensuring the applicant owns this experience
      },
    });

    if (!existingExperience) {
      return res.status(404).json({
        success: false,
        user_type: "applicant",
        message: "Experience not found",
      });
    }

    // Upd exp
    const updatedExperience = await prisma.applicants_experience.update({
      where: { id: experience_id },
      data: {
        company,
        location,
        position,
        worked_years,
        updated_at: new Date(),
      },
    });

    if (!updatedExperience) {
      return res.status(400).json({
        success: false,
        user_type: "applicant",
        message: "Failed to update experience",
      });
    }

    return res.status(200).json({
      success: true,
      user_type: "applicant",
      message: "Applicant Experience Successfully Updated",
      data: updatedExperience,
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

export default updateExperience;
