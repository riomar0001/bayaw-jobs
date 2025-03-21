import { Response, Request } from "express";
import jwt from "jsonwebtoken";
import { DecodedCompanyToken } from "@/types/types";
import prisma from "@/configs/prismaConfig";
import supabase from "@/configs/supabaseConfig";

/**
 * @desc    Get company details
 * @route   GET /api/company/:companyId
 * @access  Private
 */
export const getAllCompanyDetails = async (req: Request, res: Response) => {
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

    // Get all company data including information, logo, and social media
    const companyData = await prisma.companies_account.findUnique({
      where: {
        id: company_id,
      },
      include: {
        companies_information: {
          include: {
            industry: true,
          }
        },
        companies_logo: true,
        companies_social_media: true,
      }
    });

    if (companyData) {
      (companyData as any).password = undefined;
    }

    if (!companyData) {
      return res.status(404).json({
        success: false,
        user_type: "company",
        message: "Company details not found",
      });
    }

    // If company has a logo, generate a URL for it
    let logoUrl = null;
    if (companyData.companies_logo) {
      const { data } = supabase.storage
        .from("company_logo")
        .getPublicUrl(companyData.companies_logo.logo_file);
      
      logoUrl = data.publicUrl;
    }

    // Include logo URL in the response
    const responseData = {
      ...companyData,
      logoUrl
    };

    return res.status(200).json({
      success: true,
      user_type: "company",
      message: "Company Details found",
      data: responseData,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export default getAllCompanyDetails;
