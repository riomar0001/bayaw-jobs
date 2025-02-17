import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { DecodedCompanyToken } from "@/types/types";
import prisma from "@/configs/prismaConfig";
import fs from "fs";
import supabase from "@/configs/supabaseConfig";
import { hashPassword } from "@/utils/passwordUtils";
import generateCompanyToken from "@/utils/generateCompanyToken";
import sharp from "sharp";
import path from "path";

/**
 * @description registration of a new user
 * @route POST /api/applcants/
 * @access Public
 */
export const registerAccount = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        user_type: "company",
        message: "All fields are required",
      });
    }

    const accountExist = await prisma.companies_account.findFirst({
      where: {
        OR: [
          {
            username,
          },
          {
            email,
          },
        ],
      },
    });

    if (accountExist) {
      return res.status(400).json({
        success: false,
        user_type: "company",
        message: "Account already exist",
      });
    }

    const hashedPassword = await hashPassword(password);

    const newAccount = await prisma.companies_account.create({
      data: {
        username,
        email,
        password: hashedPassword,
        created_at: new Date(),
        done_onboarding: false,
      },
    });

    if (!newAccount) {
      return res.status(400).json({
        success: false,
        user_type: "company",
        message: "Account Registration Failed",
      });
    }

    newAccount.password = undefined!;

    generateCompanyToken(res, newAccount);

    return res.status(200).json({
      success: true,
      user_type: "company",
      message: "Account Successfully Created",
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      user_type: "company",
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const accountOnboarding = async (req: Request, res: Response) => {
  try {
    const company_token = req.cookies.company_access_token;

    const company_token_info = jwt.verify(
      company_token,
      process.env.JWT_SECRET_COMPANY!
    ) as DecodedCompanyToken;

    const company_id = company_token_info.company.id;

    const logo = Array.isArray(req.files) ? undefined : req.files?.logo?.[0];

    const { name, address, description, contact_no, email, industry } =
      req.body;

    if (
      !name ||
      !address ||
      !description ||
      !contact_no ||
      !industry ||
      !email ||
      !logo
    ) {
      return res.status(400).json({
        success: false,
        user_type: "company",
        message: "All fields are required",
        missing_fields: {
          name: !name,
          address: !address,
          description: !description,
          contact_no: !contact_no,
          industry: !industry,
          email: !email,
          logo: !logo,
        },
      });
    }

    const accountExist = await prisma.companies_account.findUnique({
      where: {
        id: company_id,
      },
      select: {
        id: true,
        done_onboarding: true,
      },
    });

    if (!accountExist) {
      return res.status(404).json({
        success: false,
        user_type: "company",
        message: "Account does not exist",
      });
    }

    if (accountExist.done_onboarding) {
      return res.status(400).json({
        success: false,
        user_type: "company",
        message: "Account has already been onboarded",
      });
    }

    // // Upload to Supabase Storage (Bucket: "applicant_profile_picture")
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

    const checkIndustry = await prisma.company_industries.findFirst({
      where: {
        name: industry,
      },
    });

    let addIndustry = checkIndustry;
    if (!checkIndustry) {
      addIndustry = await prisma.company_industries.create({
        data: {
          name: industry,
        },
      });
    }

    const onboardAccount = await prisma.companies_account.update({
      where: {
        id: company_id,
      },
      data: {
        done_onboarding: true,
        updated_at: new Date(),
        companies_information: {
          create: {
            name,
            address,
            description,
            contact_no,
            email,
            industry_id: addIndustry?.id ?? "",
          },
        },
        companies_logo: {
          create: {
            logo_file: logoFileName,
          },
        },
      },
    });

    if (!onboardAccount) {
      return res.status(404).json({
        success: false,
        user_type: "company",
        message: "Account Onboarding Failed",
      });
    }

    fs.unlinkSync(logo.path);

    return res.status(200).json({
      success: true,
      user_type: "company",
      message: "Account Onboarding Successful",
    });
  } catch (error: any) {
    console.log(error);

    return res.status(500).json({
      success: false,
      user_type: "company",
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
