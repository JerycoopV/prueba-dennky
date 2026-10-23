export type AuthMode = 'register' | 'login';

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export type FormErrors<T> = Partial<Record<keyof T, string>>;

export interface FormSubmissionResult {
  mode: AuthMode;
  name?: string;
  email: string;
  timestamp: string;
}
