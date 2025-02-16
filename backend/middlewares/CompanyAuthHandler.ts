import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import prisma from "@configs/prismaConfig";

interface DecodedToken {
  company: {
    id: string;
    username: string;
    email: string;
    done_onboarding: boolean;
  };
}

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token = req.cookies.company_access_token;

  if (!token) {
    return res
      .status(403)
      .json({ success: false, message: "Forbidden, no token" });
  }

  try {
    if (!process.env.JWT_SECRET_COMPANY) {
      return res.status(500).json({
        success: false,
        message: "Internal Server Error, env JWT_SECRET_COMPANY not found",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET_COMPANY as string
    ) as DecodedToken;

    const companyAccountExists = await prisma.companies.findUnique({
      where: { id: decoded.company.id },
      select: { id: true },
    });

    if (!companyAccountExists) {
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
