import { Response, Request } from "express";
import jwt from "jsonwebtoken";
import { DecodedCompanyToken } from "@/types/types";
import prisma from "@/configs/prismaConfig";

/**
 * @desc    Hire an applicant
 * @route   GET /jobs/applicant/hire/:job_id/applicant/:applicant_id
 * @access  Private
 */

export const hireApplicant = async (req: Request, res: Response) => {
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

    const { applicants_account_id, job_id } = req.params;

    // Find and update the job application to hired status
    const updatedApplication = await prisma.job_applicants.updateMany({
      where: {
        job_id: job_id,
        applicants_account_id: applicants_account_id,
      },
      data: {
        status: "hired",
        updated_at: new Date(),
      },
    });

    if (updatedApplication.count === 0) {
      return res.status(404).json({
        success: false,
        message: "Job application not found",
      });
    }

    return res.status(201).json({
      success: true,
      message: "Applicant Hired",
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "No jobs found for this company",
      error: error.message,
    });
  }
};
