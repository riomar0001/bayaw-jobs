import e, { Response, Request } from "express";

/**
 * @description Update company email address
 * @route       PUT /api/company/update-email
 * @access      Private (authentication middleware required)
 */
export const updateCompanyAccountEmail = async (req: Request, res: Response) => {
    try {
        return res.status(200).json({
        success: true,
            message: "Email Successfully Updated",
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message,
        });
    }
};

export default updateCompanyAccountEmail;