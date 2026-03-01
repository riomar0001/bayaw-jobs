import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

async function submitOnboarding(formData: OnboardingData) {
  const payload = {
    profile: {
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      age: Number(formData.age),
      gender: formData.gender,
      desired_position: formData.desiredPosition,
    },
    education: formData.education.school
      ? [
          {
            institution_name: formData.education.school,
            field_of_study: formData.education.field,
            start_year: Number(formData.education.yearGraduated) - 4,
            end_year: Number(formData.education.yearGraduated) || null,
          },
        ]
      : [],
    experience: formData.experiences
      .filter((e) => e.companyName)
      .map((e) => ({
        company_name: e.companyName,
        position: e.position,
        start_date: `${e.fromYear}-01-01`,
        is_current: e.currentlyWorking,
        end_date: e.currentlyWorking ? null : `${e.toYear}-12-31`,
      })),
    skills: formData.skills.map((s) => ({ skill_name: s })),
    languages: formData.languages.map((l) => ({
      language_name: l.language,
      proficiency_level: l.proficiency.toUpperCase(),
    })),
  };

  const fd = new FormData();
  fd.append("data", JSON.stringify(payload));
  if (formData.resume) {
    fd.append("resume", formData.resume);
  }

  const { data } = await axios.post(
    `${API_BASE}/applicants/onboarding`,
    fd,
    {
      withCredentials: true,
      // axios sets Content-Type: multipart/form-data with the boundary automatically
    }
  );

  return data;
}