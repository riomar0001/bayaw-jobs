import { Request, Response } from "express";

/**
 * @description Update applicant personal information
 * @route PUT /api/applicants/information/:applicantId
 * @access Private (authentication middleware required)
 */
export const updatePersonalInfomation = async (req: Request, res: Response) => {
  try {
    return res.status(200).json({
      success: true,
      message: "Personal Information Successfully Updated",
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export default updatePersonalInfomation;
