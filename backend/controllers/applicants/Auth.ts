import { Response, Request } from "express";
import prisma from "@/configs/prismaConfig";
import { verifyPassword } from "@/utils/passwordUtils";
import generateApplicantToken from "@/utils/generateApplicantToken";
import bcrypt from "bcryptjs";

/**
 * @description Authenticate Company
 * @route POST /api/companies/auth
 * @access Public
 */
export const authApplicant = async (req: Request, res: Response) => {
  try {
    const { username_email, password } = req.body;

    if (!username_email || !password) {
      return res.status(400).json({
        success: false,
        user_type: "applicant",
        message: "Username or Password is required",
      });
    }

    const company = await prisma.applicants.findFirst({
      where: {
        OR: [
          {
            username: username_email,
          },
          {
            email: username_email,
          },
        ],
      },
      select: {
        id: true,
        username: true,
        email: true,
        password: true,
        done_onboarding: true,
      },
    });

    if (!company) {
      return res.status(400).json({
        success: false,
        user_type: "applicant",
        message: "Invalid Email or Username",
      });
    }

    console.log(company);

    // Check Password
    const passwordVerification = verifyPassword(password, company.password);

    if (!passwordVerification) {
      return res.status(400).json({
        success: false,
        user_type: "applicant",
        message: "Invalid Password",
      });
    }

    company.password = undefined!;

    generateApplicantToken(res, company);

    return res.status(200).json({
      success: true,
      user_type: "applicant",
      message: "Login Success",
    });
  } catch (error: any) {
    console.log(error);

    return res.status(500).json({
      success: false,
      user_type: "applicant",
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export default authApplicant;
