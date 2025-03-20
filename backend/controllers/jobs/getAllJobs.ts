import prisma from "@/configs/prismaConfig";
import { Request, Response } from "express";

/**
 * @desc    Get all jobs with company name where is_closed is false
 * @route   GET /jobs
 * @access  Public
 */

export const getAllJobs = async (req: Request, res: Response) => {
  try {
    const allJobs = await prisma.job_offers.findMany({
      orderBy: {
        created_at: "desc", // Sort by the most recent jobs first
      },
      include: {
        companies: {
          select: {
            companies_information: true,
          },
        },
      },
    });
    return res.status(200).json({
      success: true,
      message: "All jobs are retrieved",
      allJobs,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch jobs",
      error: error.message,
    });
  }
};
