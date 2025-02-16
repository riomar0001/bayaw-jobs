import { Response, Request } from "express";

/**
 * @description Get all industries
 * @route GET /api/industries
 * @access Public
 */
export const getIndustries = async (req: Request, res: Response) => {
    try {
        return res.status(200).json({
            success: true,
            data: {},
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

export default getIndustries;