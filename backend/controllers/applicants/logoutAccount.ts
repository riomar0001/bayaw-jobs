import { Request, Response } from "express";

/**
 * @desc    Logout user
 * @route   POST /applicant/logout
 * @access  Private
 */
export const logoutAccount = async (req: Request, res: Response) => {
  try {
    res.cookie("applicant_access_token", "", {
      httpOnly: true,
      expires: new Date(0),
    });

    return res.status(200).json({
      success: true,
      message: "Logout Successful",
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export default logoutAccount;
