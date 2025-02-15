import { Request, Response } from "express";

/**
 * @desc    Get job information by ID with company name
 * @route   GET /jobs/:id
 * @access  Public
 */

export const getJobById = async (req: Request, res: Response) => {
    try {
        return res.status(200).json({
            success: true,
            data: {},
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch job information",
            error: error.message,
        });
    }
};