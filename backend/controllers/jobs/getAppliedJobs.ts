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
 * @desc    Get all jobs an applicant has applied to
 * @route   GET /applicant/jobs
 * @access  Private
 */

export const getAppliedJobs = async (req: Request, res: Response) => {
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

    const appliedJobs = await prisma.job_applicants.findMany({
      where: { applicants_account_id: applicant_id },
      include: {
        job_offers: {
            
            select: {
                id: true,
                title: true,
                companies: {
                    select: {
                        companies_information: {
                            select: {
                                name: true,
                            },
                        },
                    }
                }
            }
        },
        // companies: {
        //   select: { companies_information: true },
        // },
      },
    });

    if (!appliedJobs) {
      return res.status(404).json({
        success: false,
        user_type: "applicant",
        message: "No jobs found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Applied jobs found",
      appliedJobs,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch applied jobs",
      error: error.message,
    });
  }
};