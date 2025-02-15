import { Request, Response } from "express";

/**
 * @desc    Get all jobs an applicant has applied to
 * @route   GET /applicant/jobs
 * @access  Private
 */

export const getAppliedJobs = async (req: Request, res: Response) => {
    try {
        return res.status(200).json({
            success: true,
            data: {},
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch applied jobs",
            error: error.message,
        });
    }
};