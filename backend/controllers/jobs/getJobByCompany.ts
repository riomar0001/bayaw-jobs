import { Request, Response } from "express";

/**
 * @desc    Get all jobs for a specific company
 * @route   GET /jobs/company
 * @access  Private
 */

export const getJobByCompany = async (req: Request, res: Response) => {
    try {
        return res.status(200).json({
            success: true,
            data: {},
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: "No jobs found for this company",
            error: error.message,
        });
    }
};