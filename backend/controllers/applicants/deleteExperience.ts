import { Request, Response } from "express";
import prisma from "@/configs/prismaConfig";
import jwt from "jsonwebtoken";

interface DecodedToken {
  applicant: {
    id: string;
    username: string;
    email: string;
    done_onboarding: boolean;
  };
}

/**
 * @description Delete an applicant's experience
 * @route DELETE /api/applicants/:experience_id
 * @access Private (authentication middleware required)
 */
export const deleteExperience = async (req: Request, res: Response) => {
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
    ) as DecodedToken;

    const applicant_id = applicant_token_info.applicant.id;
    const { experience_id } = req.params;

    // Check if exp exists and belongs to the applicant
    const existingExperience = await prisma.applicants_experience.findFirst({
      where: {
        id: experience_id,
        applicant_id: applicant_id,
      },
    });

    if (!existingExperience) {
      return res.status(404).json({
        success: false,
        user_type: "applicant",
        message: "Experience not found",
      });
    }

    // Delete the exp from db
    await prisma.applicants_experience.delete({
      where: { id: experience_id },
    });

    return res.status(200).json({
      success: true,
      user_type: "applicant",
      message: "Applicant experience deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting experience:", error);

    return res.status(500).json({
      success: false,
      user_type: "applicant",
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export default deleteExperience;
