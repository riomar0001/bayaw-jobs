export interface DecodedApplicantToken {
  applicant: {
    id: string;
    username: string;
    email: string;
    done_onboarding: boolean;
  };
}

export interface DecodedCompanyToken {
  company: {
    id: string;
    username: string;
    email: string;
    done_onboarding: boolean;
  };
}
