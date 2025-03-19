import e, { Response, Request } from "express";
import jwt from "jsonwebtoken";
import { DecodedCompanyToken } from "@/types/types";
import prisma from "@/configs/prismaConfig";
import { v4 as uuidv4 } from "uuid";
/**
 * @description Update company details (logo, industry, address, or general information)
 * @route PUT /api/company/:companyId
 * @access Private (authentication middleware required)
 */

export const addIndustry = async (req: Request, res: Response) => {
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
    const { industry_name } = req.body;

    if (!industry_name) {
      return res.status(404).json({
        success: false,
        user_type: "company",
        error: "Industry name is required!",
      });
    }

    const industryExist = await prisma.company_industries.findMany({
      where: {
        name: industry_name,
      },
    });

    let industryId;
    
    if (industryExist.length > 0) {
      industryId = industryExist[0].id;
    } else {
      industryId = uuidv4();

      await prisma.company_industries.create({
        data: {
          id: industryId,
          name: industry_name,
        },
      });
    }

    const updateQuery = await prisma.companies_information.update({
      where: {
        company_account_id: company_id,
      },
      data: {
        industry_id: industryId,
        updated_at: new Date(),
      },
    });

    if (!updateQuery) {
      return res.status(400).json({
        success: false,
        user_type: "company",
        message: "Failed to add industry",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Industry Successfully Added",
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export default addIndustry;
