import { Request, Response } from "express";

/**
 * @description Update applicant details
 * @route PUT /api/applicants/:applicantId
 * @access Private (authentication middleware required)
 */
export const updateAccount = async (req: Request, res: Response) => {
    try {
        return res.status(200).json({
            success: true,
            message: "Account Successfully Updated",
    });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
    });
    }
};

export default updateAccount;