import { Response, Request } from "express";
import jwt from "jsonwebtoken";

/**
 * @desc    Check if User is authenticated
 * @route   GET /applicant/auth
 * @access  Private
 */
const checkAuthApplicant = async (req: Request, res: Response) => {
  try {
    const applicant_token = req.cookies["applicant_access_token"];
    if (!applicant_token) {
      return res
        .status(403)
        .json({
          success: false,
          user_type: "applicant",
          message: "Unauthenticated",
        });
    }

    jwt.verify(
      applicant_token,
      process.env.JWT_SECRET_APPLICANT!,
      (err: any) => {
        if (err) {
          return res
            .status(403)
            .json({
              success: false,
              user_type: "applicant",
              forbidden: "Unauthenticated",
            });
        }

        res
          .status(200)
          .json({
            success: true,
            user_type: "applicant",
            message: "Authenticated",
          });
      }
    );
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      user_type: "applicant",
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export default checkAuthApplicant;
