import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import prisma from "@configs/prismaConfig";

interface DecodedToken {
  id: string;
  isDoneOnboarding: boolean;
}

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token = req.cookies.applicant_access_token;

  if (!token) {
    return res
      .status(403)
      .json({ success: false, message: "Forbidden, no token" });
  }

  try {
    if (process.env.JWT_SECRET) {
      return res.status(500).json({
        success: false,
        message: "Internal Server Error, JWT_SECRET not found",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as DecodedToken;

    const applicantAccountExists = await prisma.applicants.findUnique({
      where: { id: decoded.id },
      select: { id: true },
    });

    if (!applicantAccountExists) {
      return res
        .status(403)
        .json({ success: false, message: "Forbidden, user not found" });
    }

    next();
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized, token has expired" });
    }

    if (process.env.NODE_ENV === "development") {
      return console.error(error);
    }

    return res
      .status(403)
      .json({ success: false, message: "Forbidden, Invalid token" });
  }
};
