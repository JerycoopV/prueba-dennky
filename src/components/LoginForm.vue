<script setup lang="ts">
import { reactive, ref } from 'vue';
import AuthInput from './AuthInput.vue';
import { useAuthValidation } from '../composables/useAuthValidation';
import type { LoginFormData } from '../types/auth';

const emit = defineEmits<{
  (e: 'submit-success', data: { email: string }): void;
  (e: 'switch-mode', mode: 'register'): void;
  (e: 'google-click'): void;
  (e: 'forgot-password'): void;
}>();

const {
  loginErrors,
  validateLoginForm,
  clearLoginFieldError,
} = useAuthValidation();

const form = reactive<LoginFormData>({
  email: '',
  password: '',
  rememberMe: false,
});

const isSubmitting = ref(false);

const handleFieldInput = (field: keyof LoginFormData) => {
  clearLoginFieldError(field, form);
};

const handleSubmit = () => {
  const isValid = validateLoginForm(form);
  if (!isValid) {
    if (loginErrors.email) {
      document.getElementById('login-email')?.focus();
    } else if (loginErrors.password) {
      document.getElementById('login-password')?.focus();
    }
    return;
  }

  isSubmitting.value = true;
  setTimeout(() => {
    isSubmitting.value = false;
    emit('submit-success', {
      email: form.email.trim(),
    });
  }, 350);
};
</script>

<template>
  <div class="form-container">
    <header class="form-header">
      <h1 class="form-title">Welcome back</h1>
      <p class="form-subtitle">Enter your details to access your Nucleus workspace.</p>
    </header>

    <form class="auth-form" novalidate @submit.prevent="handleSubmit">
      <div class="fields-stack">
        <!-- Email Field -->
        <AuthInput
          id="login-email"
          name="email"
          type="email"
          label="Email"
          placeholder="alex.jordan@gmail.com"
          :model-value="form.email"
          :error="loginErrors.email"
          autocomplete="email"
          required
          @update:model-value="(val) => { form.email = val; handleFieldInput('email'); }"
        />

        <!-- Password Field -->
        <AuthInput
          id="login-password"
          name="password"
          type="password"
          label="Password"
          placeholder="•••••••••"
          :model-value="form.password"
          :error="loginErrors.password"
          autocomplete="current-password"
          required
          @update:model-value="(val) => { form.password = val; handleFieldInput('password'); }"
        />
      </div>

      <!-- Remember me & Forgot Password -->
      <div class="remember-row">
        <label class="remember-label">
          <input
            v-model="form.rememberMe"
            type="checkbox"
            class="checkbox-input"
            id="remember-checkbox"
          />
          <span class="custom-checkbox" aria-hidden="true">
            <svg class="check-icon" viewBox="0 0 12 12" fill="none">
              <path d="M2.5 6L5 8.5L9.5 3.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </span>
          <span class="remember-text">Remember for 30 days</span>
        </label>

        <button
          type="button"
          class="forgot-btn"
          id="forgot-password-link"
          @click="emit('forgot-password')"
        >
          Forgot password?
        </button>
      </div>

      <!-- Submit Button -->
      <button
        type="submit"
        class="submit-btn"
        :disabled="isSubmitting"
        id="submit-login-btn"
      >
        <span v-if="!isSubmitting">Log in</span>
        <span v-else class="spinner-wrapper">
          <svg class="spinner" viewBox="0 0 24 24" fill="none">
            <circle class="spinner-track" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" />
            <path class="spinner-head" d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
          </svg>
          <span>Iniciando sesión...</span>
        </span>
      </button>

      <!-- OR Divider -->
      <div class="divider">
        <span class="divider-line"></span>
        <span class="divider-text">OR</span>
        <span class="divider-line"></span>
      </div>

      <!-- Google Sign In Button -->
      <button
        type="button"
        class="social-btn google-btn"
        id="google-login-btn"
        @click="emit('google-click')"
      >
        <svg class="google-icon" viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
          />
        </svg>
        <span class="social-text">Sign in with Google</span>
      </button>

      <!-- Switch to Register -->
      <footer class="form-footer">
        <span class="footer-prompt">Don't have an account?</span>
        <button
          type="button"
          class="switch-mode-btn"
          id="switch-to-register"
          @click="emit('switch-mode', 'register')"
        >
          Sign up
        </button>
      </footer>
    </form>
  </div>
</template>

<style scoped>
.form-container {
  width: 100%;
  max-width: 384px;
  margin: 0 auto;
  box-sizing: border-box;
}

.form-header {
  text-align: center;
  margin-bottom: 24px;
}

.form-title {
  font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  font-size: 28px;
  font-weight: 700;
  color: #101828;
  letter-spacing: -0.025em;
  margin: 0 0 6px 0;
  line-height: 1.25;
}

.form-subtitle {
  font-size: 14.5px;
  color: #667085;
  margin: 0;
  line-height: 1.45;
}

.auth-form {
  display: flex;
  flex-direction: column;
}

.fields-stack {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
}

/* Remember me & Forgot Password */
.remember-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  font-size: 13.5px;
}

.remember-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;
}

.checkbox-input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.custom-checkbox {
  width: 17px;
  height: 17px;
  border: 1.5px solid #d0d5dd;
  border-radius: 5px;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
  color: #ffffff;
}

.checkbox-input:checked + .custom-checkbox {
  background-color: #6d56e6;
  border-color: #6d56e6;
}

.check-icon {
  width: 11px;
  height: 11px;
  opacity: 0;
  transform: scale(0.5);
  transition: all 0.15s ease;
}

.checkbox-input:checked + .custom-checkbox .check-icon {
  opacity: 1;
  transform: scale(1);
}

.remember-text {
  color: #475467;
  font-weight: 500;
}

.forgot-btn {
  background: none;
  border: none;
  padding: 0;
  font-family: inherit;
  font-size: 13.5px;
  font-weight: 600;
  color: #6d56e6;
  cursor: pointer;
  transition: color 0.15s ease;
}

.forgot-btn:hover {
  color: #533ec7;
  text-decoration: underline;
}

.submit-btn {
  width: 100%;
  height: 48px;
  background-color: #6d56e6;
  color: #ffffff;
  border: none;
  border-radius: 12px;
  font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.18s ease, transform 0.1s ease, box-shadow 0.18s ease;
  box-shadow: 0 1px 2px rgba(16, 24, 40, 0.05);
}

.submit-btn:hover:not(:disabled) {
  background-color: #5c45d3;
  box-shadow: 0 4px 12px rgba(109, 86, 230, 0.28);
}

.submit-btn:active:not(:disabled) {
  background-color: #503bbd;
  transform: scale(0.99);
}

.submit-btn:focus-visible {
  outline: 2px solid #6d56e6;
  outline-offset: 2px;
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.spinner-wrapper {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.spinner {
  width: 18px;
  height: 18px;
  animation: spin 0.8s linear infinite;
}

.spinner-track {
  opacity: 0.25;
}

.spinner-head {
  opacity: 0.9;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Divider */
.divider {
  display: flex;
  align-items: center;
  gap: 16px;
  margin: 20px 0;
}

.divider-line {
  flex: 1;
  height: 1px;
  background-color: #eaecf0;
}

.divider-text {
  font-size: 12px;
  font-weight: 600;
  color: #98a2b3;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

/* Google Social Button */
.social-btn {
  width: 100%;
  height: 48px;
  background-color: #f4f6f8;
  border: 1px solid transparent;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  cursor: pointer;
  transition: background-color 0.18s ease, border-color 0.18s ease, transform 0.1s ease;
}

.social-btn:hover {
  background-color: #eceff2;
  border-color: #e2e6ea;
}

.social-btn:active {
  transform: scale(0.99);
}

.social-btn:focus-visible {
  outline: 2px solid #98a2b3;
  outline-offset: 2px;
}

.google-icon {
  width: 20px;
  height: 20px;
}

.social-text {
  font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  font-size: 14.5px;
  font-weight: 600;
  color: #344054;
}

/* Footer Link */
.form-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: 24px;
  font-size: 14px;
}

.footer-prompt {
  color: #475467;
}

.switch-mode-btn {
  background: none;
  border: none;
  padding: 0;
  margin: 0;
  font-family: inherit;
  font-size: inherit;
  font-weight: 600;
  color: #6d56e6;
  cursor: pointer;
  transition: color 0.15s ease, text-decoration 0.15s ease;
}

.switch-mode-btn:hover {
  color: #533ec7;
  text-decoration: underline;
}

.switch-mode-btn:focus-visible {
  outline: 2px solid #6d56e6;
  outline-offset: 2px;
  border-radius: 4px;
}
</style>
