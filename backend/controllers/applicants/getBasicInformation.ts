import { Response, Request } from "express";

/**
 * @description Get a specific applicant with related contact, CV, and experience data
 * @route GET /api/applicants/:id
 * @access Private
 */
export const getBasicInfo = async (req: Request, res: Response) => {
  try {
    return res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export default getBasicInfo;
