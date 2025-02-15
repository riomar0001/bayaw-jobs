import { Request, Response } from "express";

/**
 * @description registration of a new user
 * @route POST /api/applcants/
 * @access Public
 */
export const registerAccount = async (req: Request, res: Response) => {
    try {
        return res.status(200).json({
            success: true,
            message: "Account Successfully Created",
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};

export default registerAccount;