import { Request, Response } from "express";

/**
 * @desc    Close a job posting
 * @route   PATCH /jobs/:id/close
 * @access  Private
 */

export const closeJob = async (req: Request, res: Response) => {
    try {
        return res.status(200).json({
            success: true,
            message: "Job closed successfully",
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: "Failed to close job",
            error: error.message,
        });
    }
};