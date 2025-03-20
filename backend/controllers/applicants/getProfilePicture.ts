import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { DecodedApplicantToken } from "@/types/types";
import prisma from "@/configs/prismaConfig";
import fs from "fs";
import supabase from "@/configs/supabaseConfig";
import sharp from "sharp";
import path from "path";

/**
 * @description Get the profile picture of an applicant
 * @route GET /api/applicants/profile-picture/:account_id
 * @access Public
 */

const getProfilePicture = async (req: Request, res: Response) => {
  try {
    const { account_id } = req.params;
    
    if (!account_id) {
      return res.status(400).json({
        success: false,
        user_type: "applicant",
        message: "Account ID is required",
      });
    }
    
    const accountExist = await prisma.applicants_profile_picture.findUnique({
      where: {
        applicants_account_id: account_id,
      },
    });

    if (!accountExist) {
      return res.status(404).json({
        success: false,
        user_type: "applicant",
        message: "Account not found",
      });
    }
    
    // Get the profile picture filename
    const profilePicFileName = accountExist.profile_picture;
    
    if (!profilePicFileName) {
      return res.status(200).json({
        success: true,
        user_type: "applicant",
        message: "No profile picture found",
        profile_picture: null,
      });
    }
    
    // Get the URL of the profile picture from Supabase
    const { data } = supabase.storage
      .from("applicant_profile_picture")
      .getPublicUrl(profilePicFileName);
      
    if (!data || !data.publicUrl) {
      return res.status(500).json({
        success: false,
        user_type: "applicant",
        message: "Failed to retrieve profile picture",
      });
    }

    return res.status(200).json({
      success: true,
      user_type: "applicant",
      message: "Profile picture retrieved",
      profile_picture: data.publicUrl,
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

export default getProfilePicture;
