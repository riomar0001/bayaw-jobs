import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { DecodedToken } from "@/types/types";
import prisma from "@/configs/prismaConfig";
import fs from "fs";
import supabase from "@/configs/supabaseConfig";
import sharp from "sharp";
import path from "path";

/**
 * @description Update applicant CV
 * @route PUT /api/applicants/resume/
 * @access Private (authentication middleware required)
 */
export const updateResume = async (req: Request, res: Response) => {
  try {
    const applicant_token = req.cookies.applicant_access_token;

    const applicant_token_info = jwt.verify(
      applicant_token,
      process.env.JWT_SECRET_APPLICANT!
    ) as DecodedToken;

    const applicant_id = applicant_token_info.applicant.id;

    const resume = Array.isArray(req.files)
      ? undefined
      : req.files?.resume?.[0];

    if (!resume) {
      return res.status(400).json({
        success: false,
        user_type: "applicant",
        message: "Resume is required",
      });
    }

    const accountExist = await prisma.applicants.findUnique({
      where: {
        id: applicant_id,
      },
    });

    if (!accountExist) {
      return res.status(404).json({
        success: false,
        user_type: "applicant",
        message: "Account not found",
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

    if (error) throw error;

    const update = await prisma.applicants.update({
      where: {
        id: applicant_id,
      },
      data: {
        resume: resumeFileName,
        updated_at: new Date(),
      },
    });

    if (!update) {
      return res.status(400).json({
        success: false,
        user_type: "applicant",
        message: "Unable to update resume",
      });
    }

    fs.unlinkSync(resume.path);

    return res.status(200).json({
      success: true,
      user_type: "applicant",
      message: "Resume Successfully Updated",
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

export default updateResume;
