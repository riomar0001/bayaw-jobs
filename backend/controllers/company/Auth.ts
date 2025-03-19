import { Response, Request } from "express";
import prisma from "@/configs/prismaConfig";
import { verifyPassword } from "@/utils/passwordUtils";
import generateCompanyToken from "@/utils/generateCompanyToken";
import bcrypt from "bcryptjs";
import { log } from "console";

/**
 * @description Authenticate Company
 * @route POST /api/companies/auth
 * @access Public
 */
export const authCompany = async (req: Request, res: Response) => {
  try {
    const { username_email, password } = req.body;

    console.log(username_email, password);
    

    if (!username_email || !password) {
      return res.status(400).json({
        success: false,
        user_type: "company",
        message: "Username or Password is required",
      });
    }

    const company = await prisma.companies_account.findFirst({
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
        user_type: "company",
        message: "Invalid Email or Username",
      });
    }

    // Check Password
    const passwordVerification = verifyPassword(password, company.password);

    if (!passwordVerification) {
      return res.status(400).json({
        success: false,
        user_type: "company",
        message: "Invalid Password",
      });
    }

    company.password = undefined!;

    generateCompanyToken(res, company);

    return res.status(200).json({
      success: true,
      user_type: "company",
      message: "Login Success",
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      user_type: "company",
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export default authCompany;
