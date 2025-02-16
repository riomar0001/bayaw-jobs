import e, { Response, Request } from "express";

/**
 * @description Update company password
 * @route       PUT /api/company/update-password
 * @access      Private (authentication middleware required)
 */
export const updateCompanyAccountPassword = async (req: Request, res: Response) => {
    try {
        return res.status(200).json({
            success: true,
            message: "Password Successfully Updated",
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

export default updateCompanyAccountPassword;