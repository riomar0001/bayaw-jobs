import { Response, Request } from "express";
import jwt from "jsonwebtoken";
import { DecodedCompanyToken } from "@/types/types";
import prisma from "@/configs/prismaConfig";

/**
 * @desc    Get company details
 * @route   GET /api/company/:companyId
 * @access  Private
 */
export const getCompanyDetails = async (req: Request, res: Response) => {
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

    const companyInformation = await prisma.companies_information.findFirst({
      where: {
        company_account_id: company_id,
      },
    });

    if (!companyInformation) {
      return res.status(404).json({
        success: false,
        user_type: "company",
        message: "Company details not found",
      });
    }
    // console.log(companyInformation);

    return res.status(200).json({
      success: true,
      user_type: "company",
      message: "Company Details found",
      data: companyInformation,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export default getCompanyDetails;
