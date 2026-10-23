import { reactive } from 'vue';
import type { RegisterFormData, LoginFormData, FormErrors } from '../types/auth';

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

export function useAuthValidation() {
  const registerErrors = reactive<FormErrors<RegisterFormData>>({});
  const loginErrors = reactive<FormErrors<LoginFormData>>({});

  const validateName = (name: string): string => {
    const trimmed = name.trim();
    if (!trimmed) {
      return 'El nombre es obligatorio.';
    }
    if (trimmed.length < 2) {
      return 'El nombre debe contener al menos 2 caracteres.';
    }
    return '';
  };

  const validateEmail = (email: string, existingEmails: string[] = []): string => {
    const trimmed = email.trim();
    if (!trimmed) {
      return 'El correo electrónico es obligatorio.';
    }
    if (!EMAIL_REGEX.test(trimmed)) {
      return 'Introduce un formato de correo válido (ej. alex.jordan@gmail.com).';
    }
    const lowerEmail = trimmed.toLowerCase();
    if (existingEmails.some((e) => e.toLowerCase() === lowerEmail)) {
      return 'Este correo ya está registrado en el sistema. Inicia sesión con él o usa otro.';
    }
    return '';
  };

  const validatePassword = (password: string, userName?: string): string => {
    if (!password) {
      return 'La contraseña es obligatoria.';
    }
    if (password.length < 8) {
      return 'La contraseña debe tener al menos 8 caracteres.';
    }
    const lowerPass = password.toLowerCase();
    // Insecure trivial sequences (123, 12345678, password, etc.)
    if (/^(123|1234|12345|123456|1234567|12345678|123456789|password|admin|qwerty)$/i.test(lowerPass)) {
      return 'La contraseña no puede ser una secuencia predecible como 123 ni una palabra común.';
    }
    // Cannot be or contain user's name
    if (userName && userName.trim().length >= 3) {
      const cleanName = userName.trim().toLowerCase();
      if (lowerPass === cleanName || lowerPass.includes(cleanName)) {
        return 'La contraseña no puede contener el nombre de la cuenta.';
      }
    }
    return '';
  };

  const validateConfirmPassword = (confirmPassword: string, password: string): string => {
    if (!confirmPassword) {
      return 'Por favor confirma tu contraseña.';
    }
    if (confirmPassword !== password) {
      return 'Las contraseñas no coinciden.';
    }
    return '';
  };

  const validateRegisterField = (
    field: keyof RegisterFormData,
    data: RegisterFormData,
    existingEmails: string[] = []
  ): string => {
    let err = '';
    if (field === 'name') {
      err = validateName(data.name);
    } else if (field === 'email') {
      err = validateEmail(data.email, existingEmails);
    } else if (field === 'password') {
      err = validatePassword(data.password, data.name);
    } else if (field === 'confirmPassword') {
      err = validateConfirmPassword(data.confirmPassword, data.password);
    }

    if (err) {
      registerErrors[field] = err;
    } else {
      delete registerErrors[field];
    }

    // When password changes, also sync confirmPassword if it was already filled
    if (field === 'password' && data.confirmPassword) {
      const cErr = validateConfirmPassword(data.confirmPassword, data.password);
      if (cErr) {
        registerErrors.confirmPassword = cErr;
      } else {
        delete registerErrors.confirmPassword;
      }
    }

    return err;
  };

  const validateRegisterForm = (data: RegisterFormData, existingEmails: string[] = []): boolean => {
    const nameErr = validateName(data.name);
    const emailErr = validateEmail(data.email, existingEmails);
    const passErr = validatePassword(data.password, data.name);
    const confirmErr = validateConfirmPassword(data.confirmPassword, data.password);

    if (nameErr) registerErrors.name = nameErr; else delete registerErrors.name;
    if (emailErr) registerErrors.email = emailErr; else delete registerErrors.email;
    if (passErr) registerErrors.password = passErr; else delete registerErrors.password;
    if (confirmErr) registerErrors.confirmPassword = confirmErr; else delete registerErrors.confirmPassword;

    return !nameErr && !emailErr && !passErr && !confirmErr;
  };

  const clearRegisterFieldError = (
    field: keyof RegisterFormData,
    data?: RegisterFormData,
    existingEmails: string[] = []
  ) => {
    if (data) {
      validateRegisterField(field, data, existingEmails);
    } else {
      delete registerErrors[field];
    }
  };

  const validateLoginForm = (data: LoginFormData): boolean => {
    const emailErr = validateEmail(data.email);
    const passErr = validatePassword(data.password);

    if (emailErr) loginErrors.email = emailErr; else delete loginErrors.email;
    if (passErr) loginErrors.password = passErr; else delete loginErrors.password;

    return !emailErr && !passErr;
  };

  const clearLoginFieldError = (field: keyof LoginFormData, data?: LoginFormData) => {
    if (!loginErrors[field]) return;
    if (data) {
      if (field === 'email') {
        const err = validateEmail(data.email);
        if (!err) delete loginErrors.email;
        else loginErrors.email = err;
      } else if (field === 'password') {
        const err = validatePassword(data.password);
        if (!err) delete loginErrors.password;
        else loginErrors.password = err;
      }
    } else {
      delete loginErrors[field];
    }
  };

  const resetAllErrors = () => {
    Object.keys(registerErrors).forEach((key) => delete registerErrors[key as keyof RegisterFormData]);
    Object.keys(loginErrors).forEach((key) => delete loginErrors[key as keyof LoginFormData]);
  };

  return {
    registerErrors,
    loginErrors,
    validateRegisterField,
    validateRegisterForm,
    clearRegisterFieldError,
    validateLoginForm,
    clearLoginFieldError,
    resetAllErrors,
  };
}
