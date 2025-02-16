import { Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const generateApplicantToken = (res: Response, applicant: any) => {
  const token = jwt.sign({ applicant }, process.env.JWT_SECRET_APPLICANT!, {
    expiresIn: "3h",
  });

  if (!token) {
    return res.status(403).json({
      success: false,
      message: "Failed to generate token",
    });
  }

  res.cookie("applicant_access_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
};

export default generateApplicantToken;
