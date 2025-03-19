import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

// Define the types for our auth states
type UserData = {
  id: string;
  username: string;
  email: string;
  done_onboarding: boolean;
};

// Define the API response structure
type AuthResponse = {
  success: boolean;
  user_type: "applicant" | "company";
  message: string;
  data: {
    id: string;
    username: string;
    email: string;
    done_onboarding: boolean;
  };
};

// Define separate types for company and applicant auth states
type CompanyAuthState = {
  user_type: "company";
  user_id: string;
  username: string;
  email: string;
  done_onboarding: boolean;
  authenticated: boolean;
};

type ApplicantAuthState = {
  user_type: "applicant";
  user_id: string;
  username: string;
  email: string;
  done_onboarding: boolean;
  authenticated: boolean;
};

// Define the AuthContext interface
interface AuthContextProps {

  authStateCompany?: {
    user_type: "company";
    user_id: string;
    username: string;
    email: string;
    done_onboarding: boolean;
    authenticated: boolean;
  };

  onRegisterCompany: (
    username: string,
    email: string,
    password: string,
  ) => Promise<any>;
  onLoginCompany: (
    username_email: string,
    email: string,
  ) => Promise<any>;
  onLogoutCompany?: () => Promise<any>;

  authStateApplicant?: {
    user_type: "applicant";
    user_id: string;
    username: string;
    email: string;
    done_onboarding: boolean;
    authenticated: boolean;
  };
  onRegisterApplicant: (
    username: string,
    email: string,
    password: string,
  ) => Promise<any>;
  onLoginApplicant: (
    username_email: string,
    email: string,
  ) => Promise<any>;
  onLogoutApplicant?: () => Promise<any>;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// Provider props type
interface AuthProviderProps {
  children: ReactNode;
}

// Create the provider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Initialize state directly from localStorage to prevent undefined flicker
  const getInitialCompanyState = (): CompanyAuthState | undefined => {
    try {
      const savedState = localStorage.getItem('authStateCompany');
      return savedState ? JSON.parse(savedState) as CompanyAuthState : undefined;
    } catch (error) {
      console.error('Error parsing company auth state:', error);
      return undefined;
    }
  };

  const getInitialApplicantState = (): ApplicantAuthState | undefined => {
    try {
      const savedState = localStorage.getItem('authStateApplicant');
      return savedState ? JSON.parse(savedState) as ApplicantAuthState : undefined;
    } catch (error) {
      console.error('Error parsing applicant auth state:', error);
      return undefined;
    }
  };

  const [authStateCompany, setAuthStateCompany] = useState<CompanyAuthState | undefined>(getInitialCompanyState());
  const [authStateApplicant, setAuthStateApplicant] = useState<ApplicantAuthState | undefined>(getInitialApplicantState());

  // Keep useEffect to handle external localStorage changes
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'authStateCompany') {
        try {
          const newState = event.newValue ? JSON.parse(event.newValue) as CompanyAuthState : undefined;
          setAuthStateCompany(newState);
        } catch (error) {
          console.error('Error handling storage change for company:', error);
        }
      }
      if (event.key === 'authStateApplicant') {
        try {
          const newState = event.newValue ? JSON.parse(event.newValue) as ApplicantAuthState : undefined;
          setAuthStateApplicant(newState);
        } catch (error) {
          console.error('Error handling storage change for applicant:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // COMPANY AUTH FUNCTIONS
  const onRegisterCompany = async (
    username: string,
    email: string,
    password: string,
  ): Promise<any> => {
    try {
      // Replace with your actual API call
      const response = await fetch('/api/company', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });

      const data = await response.json() as AuthResponse;

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Registration failed');
      }

      const newAuthState: CompanyAuthState = {
        user_type: "company",
        user_id: data.data.id,
        username: data.data.username,
        email: data.data.email,
        done_onboarding: data.data.done_onboarding,
        authenticated: true
      };


      localStorage.setItem('authStateCompany', JSON.stringify(newAuthState));
      setAuthStateCompany(newAuthState);
      return data;
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  };

  const onLoginCompany = async (
    username_email: string,
    password: string,
  ): Promise<any> => {
    try {
      // Replace with your actual API call
      const response = await fetch('/api/company/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username_email, password })
      });

      const data = await response.json() as AuthResponse;

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Login failed');
      }

      const newAuthState: CompanyAuthState = {
        user_type: "company",
        user_id: data.data.id,
        username: data.data.username,
        email: data.data.email,
        done_onboarding: data.data.done_onboarding,
        authenticated: true
      };

      setAuthStateCompany(newAuthState);
      localStorage.setItem('authStateCompany', JSON.stringify(newAuthState));

      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const onLogoutCompany = async (): Promise<any> => {
    try {
      // Perform any logout API calls if needed
      await fetch('/api/company/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      // Clear state and local storage regardless of API response
      setAuthStateCompany(undefined);
      localStorage.removeItem('authStateCompany');

      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);

      // Clear state and local storage even if the API call fails
      setAuthStateCompany(undefined);
      localStorage.removeItem('authStateCompany');

      throw error;
    }
  };

  // APPLICANT AUTH FUNCTIONS
  const onRegisterApplicant = async (
    username: string,
    email: string,
    password: string,
  ): Promise<any> => {
    try {
      // Replace with your actual API call
      const response = await fetch('/api/applicant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });

      const data = await response.json() as AuthResponse;

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Registration failed');
      }

      const newAuthState: ApplicantAuthState = {
        user_type: "applicant",
        user_id: data.data.id,
        username: data.data.username,
        email: data.data.email,
        done_onboarding: data.data.done_onboarding,
        authenticated: true
      };

      setAuthStateApplicant(newAuthState);
      localStorage.setItem('authStateApplicant', JSON.stringify(newAuthState));

      return data;
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  };

  const onLoginApplicant = async (
    username_email: string,
    password: string,
  ): Promise<any> => {
    try {
      // Replace with your actual API call
      const response = await fetch('/api/applicant/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username_email, password })
      });

      const data = await response.json() as AuthResponse;

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Login failed');
      }

      const newAuthState: ApplicantAuthState = {
        user_type: "applicant",
        user_id: data.data.id,
        username: data.data.username,
        email: data.data.email,
        done_onboarding: data.data.done_onboarding,
        authenticated: true
      };

      setAuthStateApplicant(newAuthState);
      localStorage.setItem('authStateApplicant', JSON.stringify(newAuthState));

      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const onLogoutApplicant = async (): Promise<any> => {
    try {
      // Perform any logout API calls if needed
      await fetch('/api/applicant/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      // Clear state and local storage regardless of API response
      setAuthStateApplicant(undefined);
      localStorage.removeItem('authStateApplicant');

      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);

      // Clear state and local storage even if the API call fails
      setAuthStateApplicant(undefined);
      localStorage.removeItem('authStateApplicant');

      throw error;
    }
  };

  // Combine all functions and state into the context value
  const value: AuthContextProps = {
    authStateCompany,
    onRegisterCompany,
    onLoginCompany,
    onLogoutCompany,
    authStateApplicant,
    onRegisterApplicant,
    onLoginApplicant,
    onLogoutApplicant
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook for using the auth context
export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};

// Export the context for direct use if needed
export default AuthContext;