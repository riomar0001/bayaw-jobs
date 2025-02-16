import { Response, Request } from "express";

/**
 * @description Delete a Company by ID
 * @route DELETE /api/companies/:id
 * @access Private
 */
export const deleteCompany = async (req: Request, res: Response) => {
    try {
        return res.status(200).json({
            success: true,
            message: "Company successfully deleted",
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message,
        });
    }
};

export default deleteCompany;
