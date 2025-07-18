import { Response, Request } from "express";
import jwt from "jsonwebtoken";
import { DecodedCompanyToken } from "@/types/types";
import prisma from "@/configs/prismaConfig";

/**
 * @description Delete a Company by ID
 * @route DELETE /api/companies/:id
 * @access Private
 */
export const deleteCompany = async (req: Request, res: Response) => {
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

    const deleteCompany = await prisma.companies_account.delete({
        where: {
            id: company_id
        }
    })
    
    if (!deleteCompany) {
        return res.status(404).json({
          success: false,
          user_type: "company",
          message: "Delete company unsuccessful",
        });
      }

    return res.status(200).json({
      success: true,
      message: "Company successfully deleted",
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export default deleteCompany;
