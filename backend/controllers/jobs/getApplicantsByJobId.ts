import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { DecodedCompanyToken } from "@/types/types";
import prisma from "@/configs/prismaConfig";

/**
 * @desc    Get all applicants for a job posting with additional details
 * @route   GET /jobs/:job_posting_id/applicants
 * @access  Private
 */

export const getApplicantByJobId = async (req: Request, res: Response) => {
  try {
    // const company_token = req.cookies.company_access_token;

    // if (!company_token) {
    //   return res.status(401).json({
    //     success: false,
    //     user_type: "company",
    //     message: "Unauthorized - No token provided",
    //   });
    // }

    // const { job_posting_id } = req.params;

    // const jobExist = await prisma.job_offers.findFirst({
    //   where: {
    //     id: job_posting_id,
    //   },
    // });

    // if (!jobExist) {
    //   return res.status(404).json({
    //     success: false,
    //     user_type: "company",
    //     message: "Job not found",
    //   });
    // }

    // const applicants = await prisma.job_applicants.findMany({
    //   where: {
    //     job_id: job_posting_id,
    //   },
    // });

    return res.status(200).json({
      success: true,
      message: "All applicats by job ID are successfully retrieved",
    //   applicants,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch applicants",
      error: error.message,
    });
  }
};
