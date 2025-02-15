import { Request, Response } from "express";

/**
 * @description delete an applicant's experience
 * @route DELETE /api/applicants/experience/:id
 * @access Private
 */
export const deleteExperience = async (req: Request, res: Response) => {
    try {
        return res.status(200).json({
            success: true,
            message: "Account experience successfully deleted",
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message,
        });
    }
};

export default deleteExperience;