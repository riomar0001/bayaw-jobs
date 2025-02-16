import e, { Response, Request } from "express";

/**
 * @description Update applicant details
 * @route PUT /api/applicants/:applicantId
 * @access Private (authentication middleware required)
 */
export const updateCompanyContact = async (req: Request, res: Response) => {
    try {
        return res.status(200).json({
            success: true,
            message: "Company Contact Successfully Updated",
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message,
        });
    }
};

export default updateCompanyContact;