import e, { Response, Request } from "express";
import jwt from "jsonwebtoken";
import { DecodedCompanyToken } from "@/types/types";
import prisma from "@/configs/prismaConfig";
import { hashPassword, verifyPassword } from "@/utils/passwordUtils";

/**
 * @description Update company details (logo, industry, address, or general information)
 * @route PUT /api/company/:companyId
 * @access Private (authentication middleware required)
 */
export const updateAccountPassword = async (req: Request, res: Response) => {
  try {
    const company_token = req.cookies.company_access_token;

    const company_token_info = jwt.verify(
      company_token,
      process.env.JWT_SECRET_COMPANY!
    ) as DecodedCompanyToken;

    const company_id = company_token_info.company.id;
    const { current_password, new_password, confirm_password } = req.body;

    const existingAccount = await prisma.companies_account.findFirst({
      where: {
        id: company_id,
      },
    });
    //   console.log(existingAccount);

    const hashedCurrentPassword = await hashPassword(confirm_password);
    const hashedConfirmPassword = await hashPassword(confirm_password);

    console.log("Current Passowrd:", existingAccount?.password);
    console.log("New Passowrd:", hashedCurrentPassword);
    
    const isPasswordValid = await verifyPassword(current_password, existingAccount?.password || "");

    if (!isPasswordValid) { 
      return res.status(404).json({
        success: false,
        user_type: "company",
        error: "Current password is incorrect",
      });
    }

    if (new_password !== confirm_password) {
      return res.status(404).json({
        success: false,
        user_type: "company",
        error: "New password and Confirm new password does not match",
      });
    }

    if (!existingAccount) {
      return res.status(404).json({
        success: false,
        user_type: "company",
        error: "This account does not exist",
      });
    }

    const updateQuery = await prisma.companies_account.update({
      where: {
        id: company_id,
      },
      data: {
        password: hashedConfirmPassword,
        updated_at: new Date(),
      },
    });
    console.log("UPDATE QUERY", updateQuery);

    if (!updateQuery) {
      return res.status(400).json({
        success: false,
        user_type: "company",
        message: "Failed to update Account",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Company Account Password Successfully Updated",
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export default updateAccountPassword;
