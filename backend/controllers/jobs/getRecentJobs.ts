import { Request, Response } from "express";

/**
 * @desc    Get recent 6 jobs with company name
 * @route   GET /jobs/recent
 * @access  Public
 */

export const getRecentJobs = async (req: Request, res: Response) => {
    try {
        return res.status(200).json({
            success: true,
            data: {},
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch recent jobs",
            error: error.message,
        });
    }
};