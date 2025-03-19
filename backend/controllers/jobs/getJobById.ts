import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { DecodedCompanyToken } from "@/types/types";
import prisma from "@/configs/prismaConfig";

/**
 * @desc    Get job information by ID with company name
 * @route   GET /jobs/:id
 * @access  Public
 */

export const getJobById = async (req: Request, res: Response) => {
  try {

    const { job_id } = req.params;

    if (!job_id) {
      return res.status(400).json({
        success: false,
        message: "Job ID is required",
      });
    }

    // Fetch job information
    const job = await prisma.job_offers.findUnique({
      where: {
        id: job_id,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Job information found",
      job,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch job information",
      error: error.message,
    });
  }
};
