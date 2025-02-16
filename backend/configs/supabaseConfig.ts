import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("Missing Supabase configuration");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function getSignedProfilePicture(fileName: string, expiresIn = 3600) {
  const bucketName = "applicant_profile_picture"; // Update if using a different bucket

  const { data, error } = await supabase.storage
    .from(bucketName)
    .createSignedUrl(fileName, expiresIn);

  if (error) {
    console.error("Error generating signed URL:", error);
    return null;
  }

  return data.signedUrl;
}

export default supabase;
