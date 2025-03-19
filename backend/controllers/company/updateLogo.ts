import e, { Response, Request } from "express";
import jwt from "jsonwebtoken";
import { DecodedCompanyToken } from "@/types/types";
import prisma from "@/configs/prismaConfig";
import fs from "fs";
import supabase from "@/configs/supabaseConfig";
import sharp from "sharp";
import path from "path";

/**
 * @description Update company CV
 * @route PUT /api/companys/:companyId/cv
 * @access Private (authentication middleware required)
 */
export const updateLogo = async (req: Request, res: Response) => {
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

    const logo = Array.isArray(req.files) ? undefined : req.files?.logo?.[0];

    // console.log("LOGO", logo);
    // console.log("REQ FILES", req.files);

    if (!logo) {
      return res.status(404).json({
        success: false,
        user_type: "company",
        message: "Logo is Required!",
      });
    }

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

    const logoExist = await prisma.companies_logo.findFirst({
      where: {
        company_account_id: company_id,
      },
    });

    console.log(logoExist);

    if (!logoExist) {
      return res.status(404).send({ error: "company CV not found" });
    }

    const logoFilePath = logo.path;

    const logoFileName = `company_logo_${company_id}.jpeg`;
    const logoFileBuffer = fs.readFileSync(logoFilePath);

    const processedImagePath = path.join(
      path.dirname(logoFilePath),
      logoFileName
    );
    await sharp(logoFilePath).jpeg({ quality: 80 }).toFile(processedImagePath);

    const { error } = await supabase.storage
      .from("company_logo")
      .upload(logoFileName, logoFileBuffer, {
        cacheControl: "3600",
        upsert: true,
        contentType: "image/jpeg",
      });

    if (error) {
      return res.status(500).json({
        success: false,
        user_type: "applicant",
        message: "Failed to upload company logo",
        error: error.message,
      });
    }

    const updateQuery = await prisma.companies_logo.update({
      where: {
        company_account_id: company_id,
        logo_file: logoFileName,
      },
      data: {
        updated_at: new Date(),
      },
    });

    if (!updateQuery) {
      return res.status(400).json({
        success: false,
        user_type: "company",
        message: "Failed to update company logo",
      });
    }
    
    fs.unlinkSync(logo.path);

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
