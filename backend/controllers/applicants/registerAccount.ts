import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { DecodedApplicantToken } from "@/types/types";
import prisma from "@/configs/prismaConfig";
import fs from "fs";
import supabase from "@/configs/supabaseConfig";
import { hashPassword } from "@/utils/passwordUtils";
import generateApplicantToken from "@/utils/generateApplicantToken";
import { create } from "domain";

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
        user_type: "applicant",
        message: "All fields are required",
      });
    }

    const accountExist = await prisma.applicants_account.findFirst({
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
        user_type: "applicant",
        message: "Account already exist",
      });
    }

    const hashedPassword = await hashPassword(password);

    const newAccount = await prisma.applicants_account.create({
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
        user_type: "applicant",
        message: "Account Registration Failed",
      });
    }

    newAccount.password = undefined!;

    generateApplicantToken(res, newAccount);

    return res.status(200).json({
      success: true,
      user_type: "applicant",
      message: "Account Successfully Created",
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      user_type: "applicant",
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const accountOnboarding = async (req: Request, res: Response) => {
  try {
    const applicant_token = req.cookies.applicant_access_token;

    const applicant_token_info = jwt.verify(
      applicant_token,
      process.env.JWT_SECRET_APPLICANT!
    ) as DecodedApplicantToken;

    const applicant_id = applicant_token_info.applicant.id;

    const resume = Array.isArray(req.files)
      ? undefined
      : req.files?.resume?.[0];

    const {
      first_name,
      last_name,
      contact_no,
      date_of_birth,
      address,
      professional_title,
      website,
      work_type,
    } = req.body;

    if (!first_name || !last_name || !contact_no) {
      return res.status(400).json({
        success: false,
        user_type: "applicant",
        message: "All fields are required",
      });
    }

    if (!resume) {
      return res.status(400).json({
        success: false,
        user_type: "applicant",
        message: "Profile Picture and Resume are required",
      });
    }

    const accountExist = await prisma.applicants_account.findUnique({
      where: {
        id: applicant_id,
      },
      select: {
        id: true,
        done_onboarding: true,
      },
    });

    if (!accountExist) {
      return res.status(404).json({
        success: false,
        user_type: "applicant",
        message: "Account does not exist",
      });
    }

    if (accountExist.done_onboarding) {
      return res.status(400).json({
        success: false,
        user_type: "applicant",
        message: "Account has already been onboarded",
      });
    }

    const resumeFilePath = resume.path;
    const resumeFileName = `resume_${applicant_id}.pdf`;
    const resumeFileBuffer = fs.readFileSync(resumeFilePath);

    const { data, error } = await supabase.storage
      .from("applicant_resume")
      .upload(resumeFileName, resumeFileBuffer, {
        cacheControl: "3600",
        upsert: true,
        contentType: "application/pdf",
      });

    if (error) {
      return res.status(500).json({
        success: false,
        user_type: "applicant",
        message: "Resume Upload Failed",
        error: error.message,
      });
    }

    const onboardAccount = await prisma.applicants_account.update({
      where: {
        id: applicant_id,
      },
      data: {
        done_onboarding: true,
        updated_at: new Date(),
        applicants_personal_information: {
          create: {
            first_name,
            last_name,
            contact_no,
            date_of_birth: date_of_birth || null,
            address: address || null,
            professional_title: professional_title || null,
            website: website || null,
            work_type: work_type || [],
          },
        },
        applicants_resume: {
          create: {
            resume_file: resumeFileName,
          },
        },
        applicants_profile_picture: {
          create: {
            profile_picture: "default_profile_picture.jpg",
          },
        },
      },
    });

    if (!onboardAccount) {
      return res.status(404).json({
        success: false,
        user_type: "applicant",
        message: "Account Onboarding Failed",
      });
    }

    fs.unlinkSync(resume.path);

    return res.status(200).json({
      success: true,
      user_type: "applicant",
      message: "Account Onboarding Successful",
    });
  } catch (error: any) {
    console.log(error);

    return res.status(500).json({
      success: false,
      user_type: "applicant",
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
