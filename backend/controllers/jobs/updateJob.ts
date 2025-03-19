import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { DecodedCompanyToken } from "@/types/types";
import prisma from "@/configs/prismaConfig";

/**
 * @desc    Update job posting
 * @route   PUT /jobs/:job_posting_id
 * @access  Private
 */

export const updateJob = async (req: Request, res: Response) => {
  try {
    const company_token = req.cookies.company_access_token;

    const company_token_info = jwt.verify(
      company_token,
      process.env.JWT_SECRET_COMPANY!
    ) as DecodedCompanyToken;

    const company_id = company_token_info.company.id;
    const { job_posting_id } = req.params;
    const {
      new_title,
      new_description,
      new_location,
      new_category,
      new_salary_from,
      new_salary_to,
      new_work_schedule,
      new_years_exp,
    } = req.body;

    if (
      !new_title ||
      !new_description ||
      !new_location ||
      !new_category ||
      !new_salary_from ||
      !new_salary_to ||
      !new_work_schedule ||
      !new_years_exp
    ) {
      return res.status(400).json({
        success: false,
        user_type: "company",
        message: "All fields are required",
        missing_fields: {
          title: !new_title,
          description: !new_description,
          location: !new_location,
          salary_from: !new_salary_from,
          salary_to: !new_salary_to,
          work_schedule: !new_work_schedule,
          worked_years: !new_years_exp,
          category: !new_category,
        },
      });
    }

    const jobExist = await prisma.job_offers.findFirst({
      where: {
        id: job_posting_id,
        company_account_id: company_id,
      },
    });

    if (!jobExist) {
      return res.status(404).json({
        success: false,
        user_type: "job",
        error: "Job does not exist!",
      });
    }

    const updateQuery = await prisma.job_offers.update({
      where: {
        id: job_posting_id,
        company_account_id: company_id,
      },
      data: {
        title: new_title,
        description: new_description,
        location: new_location,
        salary_from: Number(new_salary_from),
        salary_to: Number(new_salary_to),
        work_schedule: new_work_schedule,
        years_exp: Number(new_years_exp),
        category: new_category,
        updated_at: new Date(),
      },
    });
    // console.log("UPDATE QUERY", updateQuery);

    if (!updateQuery) {
      return res.status(400).json({
        success: false,
        user_type: "company",
        message: "Failed to update Job Offer",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Job posting updated successfully",
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to update job posting",
      error: error.message,
    });
  }
};
