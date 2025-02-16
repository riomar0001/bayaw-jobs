import { Response, Request } from "express";

/**
 * @desc    Check if user is authenticated
 * @route   GET /users/auth
 * @access  Private
 */
export const checkAuthCompany = async (req: Request, res: Response) => {
    try {
        return res.status(200).json({
            success: true,
            message: "User is authenticated",
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};

export default checkAuthCompany;