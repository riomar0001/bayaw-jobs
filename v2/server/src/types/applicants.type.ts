export interface ApplicantEducation {
  institution_name: string;
  field_of_study: string;
  start_year: number;
  end_year?: number | null;
}

export interface ApplicantExperience {
  company_name: string;
  position: string;
  start_date: string;
  is_current: boolean;
  end_date?: string | null;
}

export interface ApplicantSkills {
  skill_name: string;
}

export type LanguageProficiency = 'BASIC' | 'CONVERSATIONAL' | 'FLUENT' | 'NATIVE';

export interface ApplicantLanguages {
  language_name: string;
  proficiency_level: LanguageProficiency;
}

export interface ApplicantResume {
  file_name: string;
}

export type ApplicantCareerStatus =
  | 'ACTIVELY_LOOKING'
  | 'OPEN_TO_OPPORTUNITIES'
  | 'EMPLOYED_NOT_LOOKING'
  | 'NOT_LOOKING';

export interface ApplicantProfile {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  age: number;
  gender: string;
  desired_position: string;
  profile_picture?: string | null;
  career_status?: ApplicantCareerStatus;
}
