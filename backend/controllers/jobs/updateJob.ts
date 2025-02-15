import { Request, Response } from "express";

/**
 * @desc    Update job posting
 * @route   PUT /jobs/:job_posting_id
 * @access  Private
 */

export const updateJob = async (req: Request, res: Response) => {
    try {
        return res.status(200).json({
            success: true,
            message: "Job posting updated successfully",
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: "Failed to update job posting",
            error: error.message,
        });
    }
};