import { Response, Request } from "express";
import jwt from "jsonwebtoken";
import { DecodedCompanyToken } from "@/types/types";
import prisma from "@/configs/prismaConfig";
/**
 * @desc    Insert job posting
 * @route   POST /jobs
 * @access  Private
 */

/**
 * @desc    Get all jobs for a specific company
 * @route   GET /jobs/company
 * @access  Private
 */

export const getJobByCompany = async (req: Request, res: Response) => {
  try {
    const company_token = req.cookies.company_access_token;
    if (!company_token) {
      return res.status(401).json({
        success: false,
        user_type: "company",
        message: "Unauthorized - No token provided",
      });
    }
    const company_token_info = jwt.verify(
      company_token,
      process.env.JWT_SECRET_COMPANY!
    ) as DecodedCompanyToken;

    const company_id = company_token_info.company.id;

    const jobs = await prisma.job_offers.findMany({
      where: {
        company_account_id: company_id,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Jobs found for this company",
      jobs,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "No jobs found for this company",
      error: error.message,
    });
  }
};
