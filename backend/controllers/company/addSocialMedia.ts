import e, { Response, Request } from "express";
import jwt from "jsonwebtoken";
import { DecodedCompanyToken } from "@/types/types";
import prisma from "@/configs/prismaConfig";
import fs from "fs";
import supabase from "@/configs/supabaseConfig";

/**
 * @description Update company details (logo, industry, address, or general information)
 * @route PUT /api/company/:companyId
 * @access Private (authentication middleware required)
 */
export const addSocialMedia = async (req: Request, res: Response) => {
  try {
    const company_token = req.cookies.company_access_token;

    const company_token_info = jwt.verify(
      company_token,
      process.env.JWT_SECRET_COMPANY!
    ) as DecodedCompanyToken;

    const company_id = company_token_info.company.id;

    const { facebook, twitter, linkedin, github } = req.body;

    const socialMedias = await prisma.companies_social_media.create({
        data: {
            company_account_id: company_id,
            facebook,
            twitter,
            linkedin,
            github
        }
    });

    if (!socialMedias) {
        return res.status(400).json({
          success: false,
          user_type: "company",
          message: "Add Company Social Medias Failed",
        });
      }


    return res.status(200).json({
      success: true,
      message: "Company Social Media Successfully Added",
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export default addSocialMedia;
