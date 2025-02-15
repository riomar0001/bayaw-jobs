import { Response, Request } from "express";

/**
 * @desc    Get company details
 * @route   GET /api/company/:companyId
 * @access  Private
 */
export const getCompanyDetails = async (req: Request, res: Response) => {
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

export default getCompanyDetails;