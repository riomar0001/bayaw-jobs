import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { DecodedApplicantToken } from "@/types/types";
import prisma from "@/configs/prismaConfig";
import supabase from "@/configs/supabaseConfig";

/**
 * @description Get applicant resume
 * @route GET /api/applicants/resume/
 * @access Private (authentication middleware required)
 */
export const getResume = async (req: Request, res: Response) => {
  try {
    const { applicant_id } = req.params;
    // Check if the applicant exists and has a resume
    const applicantResume = await prisma.applicants_resume.findUnique({
      where: {
        applicants_account_id: applicant_id,
      },
      select: {
        resume_file: true,
      },
    });

    if (!applicantResume || !applicantResume.resume_file) {
      return res.status(404).json({
        success: false,
        applicant_id,
        user_type: "applicant",
        message: "Resume not found",
      });
    }

    // Get a signed URL from Supabase for temporary access to the file
    const { data, error } = await supabase.storage
      .from("applicant_resume")
      .createSignedUrl(applicantResume.resume_file, 60); // URL valid for 60 seconds

    if (error || !data) {
      return res.status(400).json({
        success: false,
        user_type: "applicant",
        message: "Unable to retrieve resume",
        error: error?.message,
      });
    }

    return res.status(200).json({
      success: true,
      user_type: "applicant",
      message: "Resume retrieved successfully",
      resume_file_name: applicantResume.resume_file,
      resume_file: data.signedUrl,
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

/**
 * @description Download applicant resume
 * @route GET /api/applicants/resume/download
 * @access Private (authentication middleware required)
 */
export const downloadResume = async (req: Request, res: Response) => {
  try {
    const { applicant_id } = req.params;
    // Check if the applicant exists and has a resume
    const applicantResume = await prisma.applicants_resume.findUnique({
      where: {
        applicants_account_id: applicant_id,
      },
      select: {
        resume_file: true,
      },
    });

    if (!applicantResume || !applicantResume.resume_file) {
      return res.status(404).json({
        success: false,
        user_type: "applicant",
        message: "Resume not found",
      });
    }

    // Download the file from Supabase
    const { data, error } = await supabase.storage
      .from("applicant_resume")
      .download(applicantResume.resume_file);

    if (error || !data) {
      return res.status(400).json({
        success: false,
        user_type: "applicant",
        message: "Unable to download resume",
        error: error?.message,
      });
    }

    // Set appropriate headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${applicantResume.resume_file}"`
    );

    // Convert Blob to Buffer and send
    const buffer = Buffer.from(await data.arrayBuffer());
    return res.send(buffer);
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
