import { Request, Response } from "express";

/**
 * @description Update applicant password
 * @route       PUT /api/applicant/update-password
 * @access      Private (authentication middleware required)
 */
export const updatePassword = async (req: Request, res: Response) => {
  try {
    return res.status(200).json({
      success: false,
      message: "Password Successfully Updated",
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Username or Password is required",
      error: error.message,
    });
  }
};
