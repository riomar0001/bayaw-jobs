import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { DecodedCompanyToken } from "@/types/types";
import prisma from "@/configs/prismaConfig";

/**
 * @description Update company details (logo, industry, address, or general information)
 * @route PUT /api/company/:companyId
 * @access Private (authentication middleware required)
 */
export const updateCompanyInformation = async (req: Request, res: Response) => {
  try {
    const company_token = req.cookies.company_access_token;

    const {
      new_name,
      new_address,
      new_description,
      new_email,
      new_contact_no,
    } = req.body;

    const company_token_info = jwt.verify(
      company_token,
      process.env.JWT_SECRET_COMPANY!
    ) as DecodedCompanyToken;

    const company_id = company_token_info.company.id;

    if (
      !new_name ||
      !new_address ||
      !new_description ||
      !new_contact_no ||
      !new_email
    ) {
      return res.status(400).json({
        success: false,
        user_type: "company",
        message: "All fields are required",
        missing_fields: {
          name: !new_name,
          address: !new_address,
          description: !new_description,
          contact_no: !new_contact_no,
          email: !new_email,
        },
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

    const updateQuery = await prisma.companies_information.update({
      where: {
        company_account_id: company_id,
      },
      data: {
        name: new_name,
        address: new_address,
        description: new_description,
        email: new_email,
        contact_no: new_contact_no,
        updated_at: new Date(),
      },
    });

    if (!updateQuery) {
      return res.status(404).json({
        success: false,
        user_type: "company",
        error: "Company Information Update Unsuccessful",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Company Details Successfully Updated",
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export default updateCompanyInformation;
