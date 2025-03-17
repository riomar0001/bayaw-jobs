import express from "express";
import { protect } from "@/middlewares/ApplicantAuthHandler";
import authApplicant from "@/controllers/applicants/Auth";
import checkAuthApplicant from "@/controllers/applicants/checkAuth";
import {
  registerAccount,
  accountOnboarding,
} from "@/controllers/applicants/registerAccount";
import updateProfilePicture from "@/controllers/applicants/updateProfilePicture";
import uploadProfilePicture from "@/middlewares/uploadProfilePictureHandler";
import uploadResume from "@/middlewares/uploadResumeHandler";
import updateResume from "@/controllers/applicants/updateResume";
import addExperience from "@/controllers/applicants/addExperience";
import updateExperience from "@/controllers/applicants/updateExperience";
import deleteExperience from "@/controllers/applicants/deleteExperience";
import logoutAccount from "@/controllers/applicants/logoutAccount";
import addEducation from "@/controllers/applicants/addEducation";
import updateEducation from "@/controllers/applicants/updateEducation";
import deleteEducation from "@/controllers/applicants/deleteEducation";
import getExperience from "@/controllers/applicants/getExperience";
import getEducation from "@/controllers/applicants/getEducation";
import checkRole from "@/middlewares/checkRole";
import getSocialMedia from "@/controllers/applicants/getSocialMedia";
import addSocialMedia from "@/controllers/applicants/addSocialMedia";
import updateSocialMedia from "@/controllers/applicants/updateSocialMedia";
import deleteSocialMedia from "@/controllers/applicants/deleteSocialMedia";

const router = express.Router();

/**
 * @Reminder Place all GET requests here
 * @Format router.get("path", "middleware", "controller");
 */
router.get("/auth", protect, checkAuthApplicant);
router.get("/experience", protect, checkRole, getExperience.getAllExperiences);
router.get("/experience/:experience_id", protect, getExperience.getExperienceById);
router.get("/education", protect, checkRole, getEducation.getAllEducation);
router.get("/education/:education_id", protect, getEducation.getEducationById);
router.get("/social-media", protect, checkRole, getSocialMedia.getAllSocialMedia);
router.get("/social-media/:social_media_id", protect, getSocialMedia.getSocialMediaById);

/**
 * @Reminder Place all POST requests here
 * @Format router.post("path", "middleware", "controller");
 */
router.post("/auth", authApplicant);
router.post("/", registerAccount);
router.post(
  "/onboarding",
  protect,
  uploadResume.fields([{ name: "resume", maxCount: 1 }]),
  accountOnboarding
);
router.post("/experience", protect, addExperience);
router.post("/logout", protect, logoutAccount);
router.post("/education", protect, addEducation);
router.post("/social-media", protect, addSocialMedia);

/**
 * @Reminder Place all PUT requests here
 * @Format router.put("path", "middleware", "controller");
 */
router.put(
  "/profile-picture",
  protect,
  uploadProfilePicture.fields([{ name: "profile_picture", maxCount: 1 }]),
  updateProfilePicture
);
router.put(
  "/resume",
  protect,
  uploadResume.fields([{ name: "resume", maxCount: 1 }]),
  updateResume
);
router.put("/experience/:experience_id", protect, updateExperience);
router.put("/education/:education_id", protect, updateEducation);
router.put("/social-media/:social_media_id", protect, updateSocialMedia);

/**
 * @Reminder Place all DELETE requests here
 * @Format router.delete("path", "middleware", "controller");
 */
router.delete("/experience/:experience_id", protect, deleteExperience);
router.delete("/education/:education_id", protect, deleteEducation);
router.delete("/social-media/:social_media_id", protect, deleteSocialMedia);

export default router;
