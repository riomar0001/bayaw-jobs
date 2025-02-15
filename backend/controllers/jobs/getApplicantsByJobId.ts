import { Request, Response } from "express";

/**
 * @desc    Get all applicants for a job posting with additional details
 * @route   GET /jobs/:job_posting_id/applicants
 * @access  Private
 */

export const getApplicantByJobId = async (req: Request, res: Response) => {
    try {
        return res.status(200).json({
            success: true,
            data: {},
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch applicants",
            error: error.message,
        });
    }
};