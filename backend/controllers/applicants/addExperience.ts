import { Request, Response } from "express";

/**
 * @description registration of a new user
 * @route POST /api/applcants/onboarding
 * @access Private
 */
export const addExperience = async (req: Request, res: Response) => {
    try {
        return res.status(200).json({
            success: true,
            message: "Account experience successfully added",
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message,
        });
    }
};

export default addExperience;