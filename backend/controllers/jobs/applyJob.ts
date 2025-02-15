import { Request, Response } from "express";

/**
 * @desc    Apply for job posting
 * @route   POST /job/:job_posting_id/apply
 * @access  Private
 */

export const applyJob = async (req: Request, res: Response) => {
    try {
        return res.status(200).json({
            success: true,
            message: "Successfully applied for the job",
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: "Failed to apply for the job",
            error: error.message,
        });
    }
};
