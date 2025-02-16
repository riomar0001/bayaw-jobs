import { Request, Response } from "express";

/**
 * @desc    Logout user
 * @route   POST /applicant/logout
 * @access  Private
 */
export const logoutAccount = async (req: Request, res: Response) => {
    try {
        return res.status(200).json({
            success: true,
            message: "Logout Successful",
    });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
    });
    }
};

export default logoutAccount;