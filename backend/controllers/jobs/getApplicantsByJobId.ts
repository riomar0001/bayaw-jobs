import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { DecodedCompanyToken } from "@/types/types";
import prisma from "@/configs/prismaConfig";
import supabase from "@/configs/supabaseConfig";

/**
 * @desc    Get all applicants for a job posting with additional details
 * @route   GET /jobs/:job_posting_id/applicants
 * @access  Private
 */

interface ApplicantData {
  basic_info: {
    id: string;
    applicants_account_id: string;
    first_name: string;
    last_name: string;
    email: string;
    contact_no: string;
    created_at: string;
  };
  work_experience: {
    id: string;
    company: string;
    address: string;
    position: string;
    worked_years: string;
  }[];
  resume: {
    id: string;
    resume_file: string;
    resume_link: string;
  };
  application_status: string;
}

export const getApplicantByJobId = async (req: Request, res: Response) => {
  try {
    const company_token = req.cookies.company_access_token;

    if (!company_token) {
      return res.status(401).json({
        success: false,
        user_type: "company",
        message: "Unauthorized - No token provided",
      });
    }

    const { job_posting_id } = req.params;

    const jobExist = await prisma.job_offers.findFirst({
      where: {
        id: job_posting_id,
      },
    });

    if (!jobExist) {
      return res.status(404).json({
        success: false,
        user_type: "company",
        message: "Job not found",
      });
    }

    const applicantList = await prisma.job_applicants.findMany({
      where: {
      job_id: job_posting_id,
      },
      select: {
      applicants: {
        select: {
        id: true,
        username: true,
        email: true,
        created_at: true,
        applicants_personal_information: {
          select: {
          applicants_account_id: true,
          id: true,
          first_name: true,
          last_name: true,
          contact_no: true,
          },
        },
        applicants_experience: {
          select: {
          id: true,
          company: true,
          location: true,
          position: true,
          worked_years: true,
          },
        },
        applicants_resume: {
          select: {
          id: true,
          resume_file: true,
          },
        },
        },
      },
      status: true, // Include the status field
      },
    });

    if (!applicantList || applicantList.length === 0) {
      return res.status(404).json({
        success: false,
        user_type: "company",
        message: "Applicants not found",
      });
    }

    const applicantMap: Record<string, ApplicantData> = {}; // Allows string keys

    // Create a signed URLs for each resume
    for (const applicant of applicantList) {
      const applicantId = applicant.applicants.id;
      const resumeFile = applicant.applicants?.applicants_resume?.resume_file || "";
      let resumeLink = "";
      
      // Only try to get a signed URL if there's a resume file
      if (resumeFile) {
        // Get a signed URL from Supabase for temporary access to the file (valid for 1 hour)
        const { data, error } = await supabase.storage
          .from("applicant_resume")
          .createSignedUrl(resumeFile, 3600); 
        
        if (!error && data) {
          resumeLink = data.signedUrl;
        }
      }

      applicantMap[applicantId] = {
        basic_info: {
          id: applicant.applicants.id,
          applicants_account_id:
            applicant.applicants?.applicants_personal_information
              ?.applicants_account_id || "",
          first_name:
            applicant.applicants?.applicants_personal_information?.first_name ||
            "",
          last_name:
            applicant.applicants?.applicants_personal_information?.last_name ||
            "",
          email: applicant.applicants?.email || "",
          contact_no:
            applicant.applicants?.applicants_personal_information?.contact_no ||
            "",
          created_at: applicant.applicants?.created_at?.toString() || "",
        },
        work_experience:
          applicant.applicants?.applicants_experience?.map((exp) => ({
            id: exp.id,
            company: exp.company,
            address: exp.location, // assuming 'location' is the address
            position: exp.position,
            worked_years: exp.worked_years,
          })) || [],
        resume: {
          id: applicant.applicants?.applicants_resume?.id || "",
          resume_file: resumeFile,
          resume_link: resumeLink,
        },
        application_status: applicant.status || "pending",
      };
    }

    console.log("APPLICANT MAP:", JSON.stringify(applicantMap, null, 2));

    return res.status(200).json({
      success: true,
      message: "All applicants by job ID are successfully retrieved",
      applicantMap,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch applicants",
      error: error.message,
    });
  }
};