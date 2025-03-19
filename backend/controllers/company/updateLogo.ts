import e, { Response, Request } from "express";
import jwt from "jsonwebtoken";
import { DecodedCompanyToken } from "@/types/types";
import prisma from "@/configs/prismaConfig";

/**
 * @description Update company CV
 * @route PUT /api/companys/:companyId/cv
 * @access Private (authentication middleware required)
 */
export const updateLogo = async (req: Request, res: Response) => {
  try {
    const company_token = req.cookies.company_access_token;

    const company_token_info = jwt.verify(
      company_token,
      process.env.JWT_SECRET_COMPANY!
    ) as DecodedCompanyToken;

    const company_id = company_token_info.company.id;

    const logo = Array.isArray(req.files) ? undefined : req.files?.logo?.[0];

    const existingAccount = await prisma.companies_account.findFirst({
      where: {
        id: company_id,
      },
    });

    if (!existingAccount) {
      return res.status(404).json({
        success: false,
        user_type: "company",
        error: "This account does not exist",
      });
    }

    // const updateQuery = await prisma.companies_account.update({
    //   where: {
    //     id: company_id,
    //   },
    //   data: {
    //     logo: ,

    //     updated_at: new Date(),
    //   },
    // });

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
