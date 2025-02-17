import e, { Response, Request } from "express";

/**
 * @description Update company CV
 * @route PUT /api/companys/:companyId/cv
 * @access Private (authentication middleware required)
 */
export const updateLogo = async (req: Request, res: Response) => {
  try {
    return res.status(200).json({
      success: true,
      message: "Company Logo Successfully Updated",
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export default updateLogo;
