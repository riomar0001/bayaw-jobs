import { Response, Request } from "express";

/**
 * @description Authenticate User
 * @route POST /api/users/auth
 * @access Public
 */

const AuthUser = async (res: Response, req: Request) => {
  try {
    const { username_email, password } = req.body;

    if (!username_email || password) {
      res.status(400).json({
        success: false,
        message: "Username or Password is required",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Login Success",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Error message: ${error}`,
    });
  }
};

export default AuthUser;
