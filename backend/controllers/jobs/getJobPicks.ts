import { Request, Response } from "express";
import prisma from "@/configs/prismaConfig";

/**
 * @desc    Get recent 6 jobs with company name
 * @route   GET /jobs/recent
 * @access  Public
 */

export const getJobPicks = async (req: Request, res: Response) => {
  try {
    const allJobs = await prisma.job_offers.findMany({
      where: {
        is_closed: false,
      },
    });

    const shuffledJobs = allJobs.sort(() => Math.random() - 0.5).slice(0, 4);

    return res.status(200).json({
      success: true,
      message: "Recent jobs successfully retrieved",
      data: { shuffledJobs },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch recent jobs",
      error: error.message,
    });
  }
};
