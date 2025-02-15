import { Request, Response } from "express";

/**
 * @desc    Get all jobs with company name where is_closed is false
 * @route   GET /jobs
 * @access  Public
 */

export const getAllJobs = async (req: Request, res: Response) => {
    try {
        return res.status(200).json({
            success: true,
            data: {},
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch jobs",
            error: error.message,
        });
    }
};