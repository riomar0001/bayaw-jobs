import e, { Response, Request } from "express";
import jwt from "jsonwebtoken";
import { DecodedCompanyToken } from "@/types/types";
import prisma from "@/configs/prismaConfig";

/**
 * @description Update company details (logo, industry, address, or general information)
 * @route PUT /api/company/:companyId
 * @access Private (authentication middleware required)
 */
export const updateCompanyAccount = async (req: Request, res: Response) => {
  try {
    const company_token = req.cookies.company_access_token;
    if (!company_token) {
      return res.status(401).json({
        success: false,
        user_type: "company",
        message: "Unauthorized - No token provided",
      });
    }
    const company_token_info = jwt.verify(
      company_token,
      process.env.JWT_SECRET_COMPANY!
    ) as DecodedCompanyToken;

    const company_id = company_token_info.company.id;
    const { new_email } = req.body;


    if (!new_email) {
      return res.status(404).json({
        success: false,
        user_type: "company",
        message: "New email is Required!",
      });
    }

    const existingAccount = await prisma.companies_account.findFirst({
      where: {
        id: company_id,
      },
    });

    //   console.log(existingAccount);

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
        email: new_email,
        updated_at: new Date(),
      },
    });
    // console.log("UPDATE QUERY", updateQuery);
    
    if (!updateQuery) {
      return res.status(400).json({
        success: false,
        user_type: "company",
        message: "Failed to update Account",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Company Account Email Successfully Updated",
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export default updateCompanyAccount;
