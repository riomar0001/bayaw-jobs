import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { DecodedCompanyToken } from "@/types/types";
import prisma from "@/configs/prismaConfig";

/**
 * @desc    Delete a job posting
 * @route   DELETE /jobs/:id
 * @access  Private
 */

export const deleteJob = async (req: Request, res: Response) => {
  try {
    const { job_id } = req.params;

    const jobExist = await prisma.job_offers.findUnique({
      where: {
        id: job_id,
      },
    });

    if (!jobExist) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    await prisma.job_offers.delete({
      where: {
        id: job_id,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Job deleted successfully",
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete job",
      error: error.message,
    });
  }
};
