import { Request, Response } from "express";
import prisma from "@/configs/prismaConfig";
import jwt from "jsonwebtoken";
/**
 * @desc    Check if the applicant has already applied for a job posting
 * @route   GET /jobs/:job_posting_id/is-applied
 * @access  Private
 */
interface DecodedApplicantToken {
  applicant: {
    id: string;
    username: string;
    email: string;
    done_onboarding: boolean;
  };
}
export const checkIfApplied = async (req: Request, res: Response) => {
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

    const { job_posting_id } = req.params;

    const existingApplication = await prisma.job_applicants.findFirst({
      where: {
        job_id: job_posting_id,
        applicants_account_id: applicant_id,
      },
    });

    if (existingApplication) {
      return res.status(200).send({ success: true, applied: true });
    }

    res.status(200).send({ success: true, applied: false });

    // return res.status(200).json({
    //   success: true,
    //   data: {},
    // });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to check job application status",
      error: error.message,
    });
  }
};
