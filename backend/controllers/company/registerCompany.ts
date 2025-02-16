import { Response, Request } from "express";

/**
 * @description Registration of a new company
 * @route POST /api/companies/
 * @access Public
 */
export const registerCompany = async (req: Request, res: Response) => {
    try {
        return res.status(200).json({
            success: true,
            message: "Company successfully registered",
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

export default registerCompany;