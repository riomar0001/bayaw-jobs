import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { DecodedCompanyToken } from "@/types/types";
import prisma from "@/configs/prismaConfig";

/**
 * @desc    Get all applicants for a job posting with additional details
 * @route   GET /jobs/:job_posting_id/applicants
 * @access  Private
 */

interface ApplicantData {
  basic_info: {
    id: string;
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
  };
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
      include: {
        applicants: {
          select: {
            username: true,
            email: true,
            created_at: true,
            applicants_personal_information: {
              select: {
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
      },
    });

    // console.log("APPLICANTS:", applicants);
    if (!applicantList) {
      return res.status(404).json({
        success: false,
        user_type: "company",
        message: "Applicants not found",
      });
    }

    // console.log(JSON.stringify(applicantList, null, 2));

    const applicantMap: Record<string, ApplicantData> = {}; // Allows string keys

    applicantList.forEach((applicant) => {
      const applicantId = applicant.id;

      applicantMap[applicantId] = {
        basic_info: {
          id: applicant.id,
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
          created_at: applicant.created_at.toString(),
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
          resume_file:
            applicant.applicants?.applicants_resume?.resume_file || "",
        },
      };
    });

    console.log("APPLICANT MAP:", JSON.stringify(applicantMap, null, 2));

    return res.status(200).json({
      success: true,
      message: "All applicats by job ID are successfully retrieved",
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
