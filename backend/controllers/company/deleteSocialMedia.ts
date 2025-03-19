import e, { Response, Request } from "express";
import jwt from "jsonwebtoken";
import { DecodedCompanyToken } from "@/types/types";
import prisma from "@/configs/prismaConfig";
/**
 * @description Update company details (logo, industry, address, or general information)
 * @route PUT /api/company/:companyId
 * @access Private (authentication middleware required)
 */
export const deleteSocialMedia = async (req: Request, res: Response) => {
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

    const existingSocials = await prisma.companies_social_media.findFirst({
      where: {
        id: socialmedia_id,
        company_account_id: company_id,
      },
    });

    if (!existingSocials) {
      return res.status(404).json({
        success: false,
        user_type: "social media",
        error: "No social medias are found",
      });
    }

    const deleteSocialMedia = await prisma.companies_social_media.delete({
      where: { id: socialmedia_id, company_account_id: company_id },
    });

    if (!deleteSocialMedia) {
      return res.status(404).json({
        success: false,
        user_type: "company",
        message: "Delete company unsuccessful",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Company Social Medias Successfully Deleted",
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export default deleteSocialMedia;
