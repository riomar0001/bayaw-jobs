import e, { Request, Response } from "express";

/**
 * @description Update applicant CV
 * @route PUT /api/applicants/:applicantId/cv
 * @access Private (authentication middleware required)
 */
export const updateAccountCV = async (req: Request, res: Response) => {
    try {
        return res.status(200).json({
            success: true,
            message: "CV Successfully Updated",
    });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
    });
    }
};

export default updateAccountCV;