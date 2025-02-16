import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { DecodedToken } from "@/types/types";
import prisma from "@/configs/prismaConfig";
import fs from "fs";
import supabase from "@/configs/supabaseConfig";
import sharp from "sharp";
import path from "path";

/**
 * @description registration of a new user
 * @route PUT /api/applcants/profile-picture
 * @access Public
 */

const updateProfilePicture = async (req: Request, res: Response) => {
  try {
    const applicant_token = req.cookies.applicant_access_token;

    const applicant_token_info = jwt.verify(
      applicant_token,
      process.env.JWT_SECRET_APPLICANT!
    ) as DecodedToken;

    const applicant_id = applicant_token_info.applicant.id;

    const profile_picture = Array.isArray(req.files)
      ? undefined
      : req.files?.profile_picture?.[0];

    if (!profile_picture) {
      return res.status(400).json({
        success: false,
        user_type: "applicant",
        message: "Profile picture is required",
      });
    }

    console.log(profile_picture.path);
    

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

    // // Upload to Supabase Storage (Bucket: "applicant_profile_picture")
    const profilePicFilePath = profile_picture.path;
    const profilePicFileName = `profile_${applicant_id}.jpeg`;
    const profilePicFileBuffer = fs.readFileSync(profilePicFilePath);

    const processedImagePath = path.join(
      path.dirname(profilePicFilePath),
      profilePicFileName
    );
    await sharp(profilePicFilePath)
      .jpeg({ quality: 80 })
      .toFile(processedImagePath);

    const { error } = await supabase.storage
      .from("applicant_profile_picture")
      .upload(profilePicFileName, fs.readFileSync(processedImagePath), {
        cacheControl: "3600",
        upsert: true,
        contentType: "image/jpeg",
      });

    if (error) throw error;

    const updateProfilePic = await prisma.applicants.update({
      where: {
        id: applicant_id,
      },
      data: {
        profile_picture: profilePicFileName,
        updated_at: new Date(),
      },
    });

    if (!updateProfilePic) {
      return res.status(500).json({
        success: false,
        user_type: "applicant",
        message: "Failed to update profile picture",
      });
    }


    fs.unlinkSync(profile_picture.path);
    fs.unlinkSync(`storage\\profilePictures\\${profilePicFileName}`);

    return res.status(200).json({
      success: true,
      user_type: "applicant",
      message: "Profile picture updated",
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

export default updateProfilePicture;
