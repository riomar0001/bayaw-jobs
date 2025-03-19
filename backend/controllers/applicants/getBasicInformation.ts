import { Response, Request } from "express";
import prisma from "@/configs/prismaConfig";
import jwt from "jsonwebtoken";

interface DecodedApplicantToken {
  applicant: {
    id: string;
    username: string;
    email: string;
    done_onboarding: boolean;
  };
}

/**
 * @description Get a specific applicant with related contact, CV, and experience data
 * @route GET /api/applicants/:id
 * @access Private
 */
export const getBasicInfo = async (req: Request, res: Response) => {
  try {
    const applicant_token = req.cookies.applicant_access_token;

    if (!applicant_token) {
      return res.status(401).json({
        success: false,
        user_type: "applicant",
        message: "Unauthorized - No token provided",
      });
    }

    const applicant_token_info = jwt.verify(
      applicant_token,
      process.env.JWT_SECRET_APPLICANT!
    ) as DecodedApplicantToken;

    const applicant_id = applicant_token_info.applicant.id;

    const accountInfo = await prisma.applicants_account.findFirst({
      where: { id: applicant_id },
      select: { email: true, username: true },
    });

    const accountPersonalInfo =
      await prisma.applicants_personal_information.findFirst({
        where: { applicants_account_id: applicant_id },
      });

    return res.status(200).json({
      success: true,
      user_type: "applicant",
      message: "Experiences found",
      accountPersonalInfo: { ...accountInfo, ...accountPersonalInfo },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      user_type: "applicant",
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export default getBasicInfo;
