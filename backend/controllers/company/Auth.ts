import { Response, Request } from "express";

/**
 * @description Authenticate Company
 * @route POST /api/companies/auth
 * @access Public
 */
export const authCompany = async (req: Request, res: Response) => {
    try {
        const { username_email, password } = req.body;
    
        if (!username_email || password) {
            res.status(400).json({
            success: false,
            message: "Username or Password is required",
            });
        }
    
        return res.status(200).json({
            success: true,
            message: "Login Success",
        });
        } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Error message: ${error}`,
        });
        }
};

export default authCompany;