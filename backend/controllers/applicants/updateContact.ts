import { Request, Response } from "express";
import prisma from "@/configs/prismaConfig";
import jwt from "jsonwebtoken";

interface DecodedToken {
  applicant: {
    id: string;
    username: string;
    email: string;
    done_onboarding: boolean;
  };
}

/**
 * @description Update applicant contact details
 * @route PUT /api/applicants/:applicantId/contact
 * @access Private (authentication middleware required)
 */
export const updateContact = async (req: Request, res: Response) => {
  try {
    const applicant_token = req.cookies.applicant_access_token;

    const applicant_token_info = jwt.verify(
      applicant_token,
      process.env.JWT_SECRET_APPLICANT!
    ) as DecodedToken;

    const applicant_id = applicant_token_info.applicant.id;

    const { contact_no } = req.body;

    if (!contact_no) {
      return res.status(400).json({
        success: false,
        user_type: "applicant",
        message: "Phone Number is required",
      });
    }

    const updateQuery = await prisma.applicants.update({
      where: { id: applicant_id },
      data: { contact_no },
    });

    if (!updateQuery) {
      return res.status(400).json({
        success: false,
        user_type: "applicant",
        message: "Contact Number Update Failed",
      });
    }

    return res.status(200).json({
      success: true,
      user_type: "applicant",
      message: "Contact Number Successfully Updated",
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

export default updateContact;
