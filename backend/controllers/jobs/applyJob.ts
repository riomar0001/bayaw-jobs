import { Request, Response } from "express";
import prisma from "@/configs/prismaConfig";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
/**
 * @desc    Apply for job posting
 * @route   POST /job/:job_posting_id/apply
 * @access  Private
 */
interface DecodedApplicantToken {
  applicant: {
    id: string;
    username: string;
    email: string;
    done_onboarding: boolean;
  };
}

export const applyJob = async (req: Request, res: Response) => {
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

    const { job_posting_id } = req.params;

    const jobExists = await prisma.job_offers.findFirst({
      where: {
        id: job_posting_id,
      },
    });

    if (!jobExists) {
      return res.status(404).json({
        success: false,
        user_type: "applicant",
        message: "Job Not Found",
      });
    }

    if (jobExists.is_closed) {
      return res.status(400).json({
        success: false,
        user_type: "applicant",
        message: "Job is already close.",
      });
    }

    const existingApplication = await prisma.job_applicants.findFirst({
      where: {
        job_id: job_posting_id,
        applicants_account_id: applicant_id,
      },
    });

    if (existingApplication) {
      return res.status(404).json({
        success: false,
        user_type: "applicant",
        message: "You already applied to this job.",
      });
    }

    const job_applicant_id = uuidv4();

    const apply = await prisma.job_applicants.create({
      data: {
        id: job_applicant_id,
        job_id: job_posting_id,
        applicants_account_id: applicant_id,
        status: "pending",
      },
    });
    
    if (!apply) {
        return res.status(404).json({
          success: false,
          user_type: "applicant",
          message: "Job Application Unsuccessful.",
        });
      }

    return res.status(200).json({
      success: true,
      message: "Successfully applied for the job",
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to apply for the job",
      error: error.message,
    });
  }
};
