import e, { Request, Response } from "express";

/**
 * @description Update applicant contact details
 * @route PUT /api/applicants/:applicantId/contact
 * @access Private (authentication middleware required)
 */
export const updateContact = async (req: Request, res: Response) => {
    try {
        return res.status(200).json({
            success: true,
            message: "Contact Successfully Updated",
    });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
    });
    }
};

export default updateContact;