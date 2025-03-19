import { Response, Request } from "express";
import jwt from "jsonwebtoken";
import { DecodedCompanyToken } from "@/types/types";
import prisma from "@/configs/prismaConfig";
/**
 * @desc    Insert job posting
 * @route   POST /jobs
 * @access  Private
 */

export const postJob = async (req: Request, res: Response) => {
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

    // model job_offers {
    //     id                 String            @id @default(uuid())
    //     company_account_id String
    //     title              String
    //     description        String
    //     location           String
    //     category           String?
    //     salary_from        Int?
    //     salary_to          Int?
    //     work_schedule      String?
    //     years_exp          Int?
    //     is_closed          Boolean
    //     created_at         DateTime          @default(now())
    //     updated_at         DateTime          @default(now())
    //     job_applications   job_applicants[]
    //     companies          companies_account @relation(fields: [company_account_id], references: [id], onDelete: Cascade)
    //   }

    const {
      title,
      description,
      location,
      category,
      salary_from,
      salary_to,
      work_schedule,
      years_exp,
    } = req.body;

    if (
      !title ||
      !description ||
      !location ||
      !category ||
      !salary_from ||
      !salary_to ||
      !work_schedule ||
      !years_exp
    ) {
      return res.status(400).json({
        success: false,
        user_type: "company",
        message: "All fields are required",
        missing_fields: {
          title: !title,
          description: !description,
          location: !location,
          category: !category,
          salary_from: !salary_from,
          salary_to: !salary_to,
          work_schedule: !work_schedule,
          years_exp: !years_exp,
        },
      });
    }

    const job = await prisma.job_offers.create({
      data: {
        company_account_id: company_id,
        title,
        description,
        location,
        category,
        salary_from: Number(salary_from), 
        salary_to: Number(salary_to),
        work_schedule,
        years_exp: Number(years_exp),
        is_closed: false,
      },
    });

    if (!job) {
      return res.status(400).json({
        success: false,
        user_type: "company",
        message: "Failed to post job",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Job posted successfully",
      job,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to post job",
      error: error.message,
    });
  }
};
