<script setup lang="ts">
import { reactive, ref } from 'vue';
import AuthInput from './AuthInput.vue';
import { useAuthValidation } from '../composables/useAuthValidation';
import type { RegisterFormData } from '../types/auth';

interface Props {
  existingEmails?: string[];
}

const props = withDefaults(defineProps<Props>(), {
  existingEmails: () => [],
});

const emit = defineEmits<{
  (e: 'submit-success', data: { name: string; email: string }): void;
  (e: 'switch-mode', mode: 'login'): void;
  (e: 'google-click'): void;
}>();

const {
  registerErrors,
  validateRegisterForm,
  validateRegisterField,
  resetAllErrors,
} = useAuthValidation();

const form = reactive<RegisterFormData>({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
});

const touched = reactive<Record<keyof RegisterFormData, boolean>>({
  name: false,
  email: false,
  password: false,
  confirmPassword: false,
});

const isSubmitting = ref(false);

const handleFieldBlur = (field: keyof RegisterFormData) => {
  touched[field] = true;
  validateRegisterField(field, form, props.existingEmails);
};

const handleFieldInput = (field: keyof RegisterFormData) => {
  // If the field has been touched or already has error or has content, validate in real time
  if (touched[field] || registerErrors[field] || form[field].length > 0) {
    validateRegisterField(field, form, props.existingEmails);
  }
};

const resetForm = () => {
  form.name = '';
  form.email = '';
  form.password = '';
  form.confirmPassword = '';
  touched.name = false;
  touched.email = false;
  touched.password = false;
  touched.confirmPassword = false;
  resetAllErrors();
};

const handleSubmit = () => {
  // Mark all fields as touched
  touched.name = true;
  touched.email = true;
  touched.password = true;
  touched.confirmPassword = true;

  const isValid = validateRegisterForm(form, props.existingEmails);
  if (!isValid) {
    // Focus the first invalid field for accessibility
    const firstInvalidField = (['name', 'email', 'password', 'confirmPassword'] as (keyof RegisterFormData)[])
      .find((f) => registerErrors[f]);
    if (firstInvalidField) {
      const el = document.getElementById(`register-${firstInvalidField}`);
      el?.focus();
    }
    return;
  }

  isSubmitting.value = true;
  const submittedName = form.name.trim();
  const submittedEmail = form.email.trim();

  // Local validation simulation
  setTimeout(() => {
    isSubmitting.value = false;
    // Reset form cleanly so user can register another account without state conflicts
    resetForm();
    emit('submit-success', {
      name: submittedName,
      email: submittedEmail,
    });
  }, 350);
};

const handleGoogleClick = () => {
  emit('google-click');
};

defineExpose({
  resetForm,
});
</script>

<template>
  <div class="form-container">
    <header class="form-header">
      <h1 class="form-title">Create your account</h1>
      <p class="form-subtitle">Join Nucleus UI and start designing with ease.</p>
    </header>

    <form class="auth-form" novalidate @submit.prevent="handleSubmit">
      <div class="fields-stack">
        <!-- Name Field -->
        <AuthInput
          id="register-name"
          name="name"
          label="Name"
          placeholder="Alex Jordan"
          :model-value="form.name"
          :error="registerErrors.name"
          autocomplete="name"
          required
          @update:model-value="(val) => { form.name = val; handleFieldInput('name'); }"
          @blur="handleFieldBlur('name')"
        />

        <!-- Email Field -->
        <AuthInput
          id="register-email"
          name="email"
          type="email"
          label="Email"
          placeholder="alex.jordan@gmail.com"
          :model-value="form.email"
          :error="registerErrors.email"
          autocomplete="email"
          required
          @update:model-value="(val) => { form.email = val; handleFieldInput('email'); }"
          @blur="handleFieldBlur('email')"
        />

        <!-- Password Field -->
        <AuthInput
          id="register-password"
          name="password"
          type="password"
          label="Password"
          placeholder="•••••••••"
          :model-value="form.password"
          :error="registerErrors.password"
          autocomplete="new-password"
          required
          @update:model-value="(val) => { form.password = val; handleFieldInput('password'); }"
          @blur="handleFieldBlur('password')"
        />

        <!-- Confirm Password Field -->
        <AuthInput
          id="register-confirmPassword"
          name="confirmPassword"
          type="password"
          label="Confirm password"
          placeholder="•••••••••"
          :model-value="form.confirmPassword"
          :error="registerErrors.confirmPassword"
          autocomplete="new-password"
          required
          @update:model-value="(val) => { form.confirmPassword = val; handleFieldInput('confirmPassword'); }"
          @blur="handleFieldBlur('confirmPassword')"
        />
      </div>

      <!-- Submit Button -->
      <button
        type="submit"
        class="submit-btn"
        :disabled="isSubmitting"
        id="submit-register-btn"
      >
        <span v-if="!isSubmitting">Create account</span>
        <span v-else class="spinner-wrapper">
          <svg class="spinner" viewBox="0 0 24 24" fill="none">
            <circle class="spinner-track" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" />
            <path class="spinner-head" d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
          </svg>
          <span>Verificando datos...</span>
        </span>
      </button>

      <!-- OR Divider -->
      <div class="divider">
        <span class="divider-line"></span>
        <span class="divider-text">OR</span>
        <span class="divider-line"></span>
      </div>

      <!-- Google Sign Up Button -->
      <button
        type="button"
        class="social-btn google-btn"
        id="google-register-btn"
        @click="handleGoogleClick"
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
        <span class="social-text">Sign up with Google</span>
      </button>

      <!-- Switch to Log in -->
      <footer class="form-footer">
        <span class="footer-prompt">Have an account?</span>
        <button
          type="button"
          class="switch-mode-btn"
          id="switch-to-login"
          @click="emit('switch-mode', 'login')"
        >
          Log in
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
  margin-bottom: 20px;
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
