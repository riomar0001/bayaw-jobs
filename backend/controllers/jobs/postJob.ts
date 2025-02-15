import { Request, Response } from "express";

/**
 * @desc    Insert job posting
 * @route   POST /jobs
 * @access  Private
 */

export const postJob = async (req: Request, res: Response) => {
    try {
        return res.status(200).json({
            success: true,
            message: "Job posted successfully",
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: "Failed to post job",
            error: error.message,
        });
    }
};