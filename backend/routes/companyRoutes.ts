import express from "express";
import { upload as uploadLogo } from "@/middlewares/uploadLogoHandler";
import { protect } from "@/middlewares/CompanyAuthHandler";
import authCompany from "@/controllers/company/Auth";
import checkAuthCompany from "@/controllers/company/checkAuth";

const router = express.Router();

/**
 * @Reminder Place all GET requests here
 * @Format router.get("path", "middleware", "controller");
 */
router.get("/auth", protect, checkAuthCompany);

/**
 * @Reminder Place all POST requests here
 * @Format router.post("path", "middleware", "controller");
 */
router.post("/auth", authCompany);

/**
 * @Reminder Place all PUT requests here
 * @Format router.put("path", "middleware", "controller");
 */

/**
 * @Reminder Place all DELETE requests here
 * @Format router.delete("path", "middleware", "controller");
 */

export default router;
