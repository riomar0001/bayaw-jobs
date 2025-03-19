import { Request, Response } from "express";
import prisma from "@/configs/prismaConfig";

/**
 * @desc    Get recent 6 jobs with company name
 * @route   GET /jobs/recent
 * @access  Public
 */

export const getRecentJobs = async (req: Request, res: Response) => {
  try {
    const recentJobs = await prisma.job_offers.findMany({
      where: {
        is_closed: false, // Optional: Retrieve only open job offers
      },
      orderBy: {
        created_at: "desc", // Sort by the most recent jobs first
      },
      take: 3, // Limit to the three most recent jobs
    });

    return res.status(200).json({
      success: true,
      message: "Recent jobs successfully retrieved",
      recentJobs
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch recent jobs",
      error: error.message,
    });
  }
};
