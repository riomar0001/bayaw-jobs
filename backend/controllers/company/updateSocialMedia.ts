import e, { Response, Request } from "express";
import jwt from "jsonwebtoken";
import { DecodedCompanyToken } from "@/types/types";
import prisma from "@/configs/prismaConfig";
/**
 * @description Update company details (logo, industry, address, or general information)
 * @route PUT /api/company/:companyId
 * @access Private (authentication middleware required)
 */

export const updateSocialMedia = async (req: Request, res: Response) => {
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
    const { socialmedia_id } = req.params;
    const { facebook, twitter, linkedin, github } = req.body;
    
    const existingSocials = await prisma.companies_social_media.findFirst({
      where: {
        id: socialmedia_id,
        company_account_id: company_id
      },
    });

    if (!existingSocials) {
      return res.status(404).json({
        success: false,
        user_type: "company",
        error: "No social medias are found",
      });
    }

    const updateQuery = await prisma.companies_social_media.update({
      where: {
        id: socialmedia_id,
        company_account_id: company_id
      },
      data: {
        facebook,
        twitter,
        linkedin,
        github,
        updated_at: new Date(),
      },
    });

    if (!updateQuery) {
      return res.status(400).json({
        success: false,
        user_type: "company",
        message: "Failed to update social medias",
      });
    }

    // const socialMedias = await prisma.companies_social_media.create({
    //   data: {
    //     company_account_id: company_id,
    //     facebook,
    //     twitter,
    //     linkedin,
    //     github,
    //   },
    // });

    // if (!socialMedias) {
    //   return res.status(400).json({
    //     success: false,
    //     user_type: "company",
    //     message: "Update Company Social Medias Failed",
    //   });
    // }

    return res.status(200).json({
      success: true,
      message: "Company Social Media Successfully Updated",
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export default updateSocialMedia;
