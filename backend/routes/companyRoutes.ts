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
import updateSocialMedia from "@/controllers/company/updateSocialMedia";
import deleteSocialMedia from "@/controllers/company/deleteSocialMedia";
import updateCompanyAccount from "@/controllers/company/updateAccount";
import updateAccountPassword from "@/controllers/company/updateAccountPassword";
import updateLogo from "@/controllers/company/updateLogo";
import updateCompanyInformation from "@/controllers/company/updateInformation";
import getCompanyDetails from "@/controllers/company/getInformation";
import getIndustries from "@/controllers/company/getIndustries";
import getPostedJob from "@/controllers/company/getPostedJob";
import updateCompanyIndustry from "@/controllers/company/updateCompanyIndustry";
import deleteCompany from "@/controllers/company/deleteCompany";
import addIndustry from "@/controllers/company/addIndustry";
/**
 * @Reminder Place all GET requests here
 * @Format router.get("path", "middleware", "controller");
 */
router.get("/auth", protect, checkAuthCompany);
router.get("/", protect, getCompanyDetails);
router.get("/industries", protect, getIndustries);
router.get("/jobs", protect, getPostedJob);
router.get("/all-jobs", protect, getIndustries);


/**
 * @Reminder Place all POST requests here
 * @Format router.post("path", "middleware", "controller");
 */
router.post("/auth", authCompany);
router.post("/", registerAccount);
router.post("/logout", protect, logoutAccount);
router.post("/socials", protect, addSocialMedia);
router.post("/industry", protect, addIndustry);
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
router.put("/update", protect, updateCompanyAccount);
router.put("/password", protect, updateAccountPassword);
router.put("/update/info", protect, updateCompanyInformation);
router.put("/socials/:socialmedia_id", protect, updateSocialMedia);
router.put("/industry", protect, updateCompanyIndustry);
router.put(
  "/logo",
  protect,
  uploadLogoHandler.fields([{ name: "logo", maxCount: 1 }]),
  updateLogo
);

/**
 * @Reminder Place all DELETE requests here
 * @Format router.delete("path", "middleware", "controller");
 */

router.delete("/socials/:socialmedia_id", protect, deleteSocialMedia);
router.delete("/", protect, deleteCompany);

export default router;
