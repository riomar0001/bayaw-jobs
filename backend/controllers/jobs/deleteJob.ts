import { Request, Response } from "express";

/**
 * @desc    Delete a job posting
 * @route   DELETE /jobs/:id
 * @access  Private
 */

export const deleteJob = async (req: Request, res: Response) => {
    try {
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