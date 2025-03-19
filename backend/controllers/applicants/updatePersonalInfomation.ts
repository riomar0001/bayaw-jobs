import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { DecodedApplicantToken } from "@/types/types";
import prisma from "@/configs/prismaConfig";
import generateApplicantToken from "@/utils/generateApplicantToken";

export const updatePersonalInformation = async (
  req: Request,
  res: Response
) => {
  try {
    // Get the token from cookies
    const applicant_token = req.cookies.applicant_access_token;

    // Verify the token
    const applicant_token_info = jwt.verify(
      applicant_token,
      process.env.JWT_SECRET_APPLICANT!
    ) as DecodedApplicantToken;

    const applicant_id = applicant_token_info.applicant.id;

    // Get the updated information from the request body
    const {
      first_name,
      last_name,
      contact_no,
      date_of_birth,
      address,
      professional_title,
      website,
      work_type,
      email,
    } = req.body;

    // Validate required fields
    if (
      !first_name ||
      !last_name ||
      !contact_no ||
      !date_of_birth ||
      !address ||
      !professional_title ||
      !website ||
      !work_type ||
      !email
    ) {
      return res.status(400).json({
        success: false,
        user_type: "applicant",
        message: "All fields are required",
        missing_fields: [
          !first_name && "first_name",
          !last_name && "last_name",
          !contact_no && "contact_no",
          !date_of_birth && "date_of_birth",
          !address && "address",
          !professional_title && "professional_title",
          !website && "website",
          !work_type && "work_type",
          !email && "email",
        ].filter((field) => field),
      });
    }

    // Check if the account exists
    const accountExist = await prisma.applicants_account.findUnique({
      where: {
        id: applicant_id,
      },
      include: {
        applicants_personal_information: true,
      },
    });

    if (!accountExist) {
      return res.status(404).json({
        success: false,
        user_type: "applicant",
        message: "Account does not exist",
      });
    }

    // Check if the email is being changed and if it's already in use
    if (email && email !== accountExist.email) {
      const emailExists = await prisma.applicants_account.findFirst({
        where: {
          email,
          id: {
            not: applicant_id,
          },
        },
      });

      if (emailExists) {
        return res.status(400).json({
          success: false,
          user_type: "applicant",
          message: "Email already in use",
        });
      }
    }

    // Update the account information
    let updatedAccount;

    if (accountExist.applicants_personal_information) {
      // If personal information exists, update it
      updatedAccount = await prisma.applicants_account.update({
        where: {
          id: applicant_id,
        },
        data: {
          email: email || accountExist.email,
          updated_at: new Date(),
          applicants_personal_information: {
            update: {
              first_name,
              last_name,
              contact_no,
              date_of_birth: date_of_birth || null,
              address: address || null,
              professional_title: professional_title || null,
              website: website || null,
              work_type:
                work_type ||
                accountExist.applicants_personal_information.work_type,
            },
          },
        },
        include: {
          applicants_personal_information: true,
        },
      });
    } else {
      // If personal information doesn't exist, create it
      updatedAccount = await prisma.applicants_account.update({
        where: {
          id: applicant_id,
        },
        data: {
          email: email || accountExist.email,
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
        },
        include: {
          applicants_personal_information: true,
        },
      });
    }

    // Remove sensitive data from response
    updatedAccount.password = undefined!;
    updatedAccount.created_at = undefined!;
    updatedAccount.updated_at = undefined!;

    // Generate new token if email was updated
    if (email && email !== accountExist.email) {
      generateApplicantToken(res, updatedAccount);
    }

    return res.status(200).json({
      success: true,
      user_type: "applicant",
      message: "Personal information updated successfully",
      data: updatedAccount,
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
