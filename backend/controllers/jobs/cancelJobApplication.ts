import { Request, Response } from "express";

/**
 * @desc    Cancel job application
 * @route   DELETE /jobs/:job_posting_id/cancel
 * @access  Private
 */

export const cancelJobApplication = async (req: Request, res: Response) => {
    try {
        return res.status(200).json({
            success: true,
            message: "Successfully applied for the job",
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: "Failed to cancel the job application",
            error: error.message,
        });
    }
};
