import express from "express";
import uploadLogoHandler from "@/middlewares/uploadLogoHandler";
import { protect } from "@/middlewares/CompanyAuthHandler";
import authCompany from "@/controllers/company/Auth";
import checkAuthCompany from "@/controllers/company/checkAuth";
import {
  registerAccount,
  accountOnboarding,
} from "@/controllers/company/registerAccount";
import logoutAccount from "@/controllers/company/logoutAccount";
const router = express.Router();
import addSocialMedia from "@/controllers/company/addSocialMedia";

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
router.post("/", registerAccount);
router.post("/logout", protect, logoutAccount);
router.post("/socials", protect, addSocialMedia);

router.post(
  "/onboarding",
  protect,
  uploadLogoHandler.fields([{ name: "logo", maxCount: 1 }]),
  accountOnboarding
);


/**
 * @Reminder Place all PUT requests here
 * @Format router.put("path", "middleware", "controller");
 */



/**
 * @Reminder Place all DELETE requests here
 * @Format router.delete("path", "middleware", "controller");
 */

export default router;
