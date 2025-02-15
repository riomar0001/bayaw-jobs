import { Request, Response } from "express";

/**
 * @desc    Check if the applicant has already applied for a job posting
 * @route   GET /jobs/:job_posting_id/is-applied
 * @access  Private
 */

export const checkIfApplied = async (req: Request, res: Response) => {
    try {
        return res.status(200).json({
            success: true,
            data: {},
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: "Failed to check job application status",
            error: error.message,
        });
    }
};
