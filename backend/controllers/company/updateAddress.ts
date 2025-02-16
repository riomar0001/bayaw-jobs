import e, { Response, Request } from "express";

/**
 * @description Update applicant details
 * @route PUT /api/applicants/:applicantId
 * @access Private (authentication middleware required)
 */
export const updateCompanyAddress = async (req: Request, res: Response) => {
    try {
        return res.status(200).json({
            success: true,
            message: "Company details updated successfully",
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

export default updateCompanyAddress;
