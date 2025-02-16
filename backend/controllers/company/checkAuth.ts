import { Response, Request } from "express";
import jwt from "jsonwebtoken";

/**
 * @desc    Check if user is authenticated
 * @route   GET /applicant/auth
 * @access  Private
 */
const checkAuthCompany = async (req: Request, res: Response) => {
  try {
    const comapny_token = req.cookies["company_access_token"];
    if (!comapny_token) {
      return res.status(403).json({
        success: false,
        user_type: "company",
        message: "Unauthenticated",
      });
    }

    jwt.verify(comapny_token, process.env.JWT_SECRET_COMPANY!, (err: any) => {
      if (err) {
        return res.status(403).json({
          success: false,
          user_type: "company",
          forbidden: "Unauthenticated",
        });
      }

      res.status(200).json({
        success: true,
        user_type: "company",
        message: "Authenticated",
      });
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      user_type: "company",
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export default checkAuthCompany;
