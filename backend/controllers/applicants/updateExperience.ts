import e, { Request, Response } from "express";

/**
 * @description Update applicant experience
 * @route PUT /api/applicants/:experience_id/:experienceId
 * @access Private (authentication middleware required)
 */
export const updateExperience = async (req: Request, res: Response) => {
    try {
        return res.status(200).json({
            success: true,
            message: "Experience Successfully Updated",
    });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
    });
    }
};

export default updateExperience;