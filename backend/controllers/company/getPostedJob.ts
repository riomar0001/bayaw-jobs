import { Response, Request } from "express";

/**
 * @desc    Get jobs based on company ID
 * @route   GET /jobs/company
 * @access  Private
 */
export const getPostedJob = async (req: Request, res: Response) => {
    try {
        return res.status(200).json({
            success: true,
            data: {},
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

export default getPostedJob;