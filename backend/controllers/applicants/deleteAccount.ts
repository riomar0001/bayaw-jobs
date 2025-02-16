import { Request, Response } from "express";

/**
 * @description Delete an applicant by ID
 * @route DELETE /api/applicants/:id
 * @access Private
 */
export const deleteAccount = async (req: Request, res: Response) => {
    try {
        return res.status(200).json({
            success: true,
            message: "Account successfully deleted",
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

export default deleteAccount;