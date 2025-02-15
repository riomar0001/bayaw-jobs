import { Response, Request } from "express";

/**
 * @desc    Check if user is authenticated
 * @route   GET /users/auth
 * @access  Private
 */
const checkAuthUser = async (res: Response, req: Request) => {
    try {
        return res.status(200).json({
            success: true,
            data: {},
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message,
        });
    }
};

export default checkAuthUser;