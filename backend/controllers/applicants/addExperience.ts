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
 * @description Adds a new experience entry for an applicant
 * @route POST /api/applicants/onboarding
 * @access Private (authentication middleware required)
 */
export const addExperience = async (req: Request, res: Response) => {
  try {
    // Retrieve the applicant's authentication token from cookies
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

    const { company, location, position, worked_years } = req.body;

    if (!company || !location || !position || !worked_years) {
      return res.status(400).json({
        success: false,
        user_type: "applicant",
        message: "All fields are required",
      });
    }

    // Create a new experience entry in db
    const createQuery = await prisma.applicants_experience.create({
      data: {
        company,
        location,
        position,
        worked_years,
        applicant: {
          connect: {
            id: applicant_id, // Connects the experience to the loggedin applicant
          },
        },
      },
    });

    // fail, error response
    if (!createQuery) {
      return res.status(400).json({
        success: false,
        user_type: "applicant",
        message: "Applicant experience creation failed",
      });
    }

    // success response
    return res.status(200).json({
      success: true,
      user_type: "applicant",
      message: "Applicant experience successfully added",
      data: createQuery, // Optionally return the created experience data
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

export default addExperience;
