<script setup lang="ts">
import { ref, computed } from 'vue';
import type { AuthMode, FormSubmissionResult } from './types/auth';
import HeroBanner from './components/HeroBanner.vue';
import RegisterForm from './components/RegisterForm.vue';
import LoginForm from './components/LoginForm.vue';
import FeedbackModal from './components/FeedbackModal.vue';
import ToastNotification from './components/ToastNotification.vue';
import NucleusLogo from './components/NucleusLogo.vue';

const currentMode = ref<AuthMode>('register');
const isFeedbackModalOpen = ref(false);
const submissionResult = ref<FormSubmissionResult | null>(null);
const toastRef = ref<InstanceType<typeof ToastNotification> | null>(null);
const registerFormRef = ref<InstanceType<typeof RegisterForm> | null>(null);

// Local registry of created users for demo session
const registeredUsers = ref<Array<{ name: string; email: string }>>([]);
const registeredEmails = computed(() => registeredUsers.value.map((u) => u.email.toLowerCase()));

const handleRegisterSuccess = (data: { name: string; email: string }) => {
  // Store user in local session registry
  registeredUsers.value.push({
    name: data.name,
    email: data.email.toLowerCase(),
  });

  submissionResult.value = {
    mode: 'register',
    name: data.name,
    email: data.email,
    timestamp: new Date().toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }),
  };
  isFeedbackModalOpen.value = true;
};

const handleLoginSuccess = (data: { email: string }) => {
  submissionResult.value = {
    mode: 'login',
    email: data.email,
    timestamp: new Date().toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }),
  };
  isFeedbackModalOpen.value = true;
};

const switchMode = (mode: AuthMode) => {
  currentMode.value = mode;
  toastRef.value?.showToast(
    mode === 'login' ? 'Cambiado a modo Iniciar sesión' : 'Cambiado a modo Crear cuenta',
    'info'
  );
};

const handleGoogleClick = () => {
  toastRef.value?.showToast(
    'Autenticación con Google (Demostración Front-End: fuera del alcance del reto)',
    'info'
  );
};

const handleForgotPassword = () => {
  toastRef.value?.showToast(
    'Recuperación de contraseña (Demostración Front-End)',
    'info'
  );
};

const closeModal = () => {
  isFeedbackModalOpen.value = false;
  registerFormRef.value?.resetForm();
};

const handleRegisterAnother = () => {
  isFeedbackModalOpen.value = false;
  registerFormRef.value?.resetForm();
  toastRef.value?.showToast('Formulario limpio listo para un nuevo registro.', 'info');
  setTimeout(() => {
    document.getElementById('register-name')?.focus();
  }, 100);
};
</script>

<template>
  <main class="app-viewport">
    <div class="auth-card" role="region" aria-label="Pantalla de Autenticación Nucleus UI">
      <!-- Left Hero Banner (Desktop / Tablet) -->
      <div class="card-hero-column">
        <HeroBanner />
      </div>

      <!-- Right Form Column -->
      <div class="card-form-column">
        <!-- Brand logo visible in mobile header -->
        <div class="mobile-brand-bar">
          <NucleusLogo variant="dark" size="md" />
        </div>

        <div class="form-wrapper">
          <transition name="fade-mode" mode="out-in">
            <RegisterForm
              v-if="currentMode === 'register'"
              key="register"
              ref="registerFormRef"
              :existing-emails="registeredEmails"
              @submit-success="handleRegisterSuccess"
              @switch-mode="switchMode('login')"
              @google-click="handleGoogleClick"
            />
            <LoginForm
              v-else
              key="login"
              @submit-success="handleLoginSuccess"
              @switch-mode="switchMode('register')"
              @google-click="handleGoogleClick"
              @forgot-password="handleForgotPassword"
            />
          </transition>
        </div>
      </div>
    </div>

    <!-- Feedback Modal on successful local validation -->
    <FeedbackModal
      :is-open="isFeedbackModalOpen"
      :result="submissionResult"
      @close="closeModal"
      @register-another="handleRegisterAnother"
    />

    <!-- Toast Notification for secondary clicks -->
    <ToastNotification ref="toastRef" />
  </main>
</template>

<style scoped>
.app-viewport {
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 24px;
  background-color: var(--bg-page);
  box-sizing: border-box;
}

/* Central Card reproducing Nucleus UI reference */
.auth-card {
  width: 100%;
  max-width: 1360px;
  min-height: 820px;
  background-color: var(--bg-card);
  border-radius: 20px;
  box-shadow:
    0 24px 48px -12px rgba(16, 24, 40, 0.08),
    0 12px 24px -8px rgba(16, 24, 40, 0.04),
    0 0 0 1px rgba(16, 24, 40, 0.03);
  display: flex;
  overflow: hidden;
  position: relative;
}

/* Left Hero Column: exactly ~35% / 460px width */
.card-hero-column {
  flex: 0 0 460px;
  width: 460px;
  position: relative;
  overflow: hidden;
  background-color: #1a1a24;
}

/* Right Form Column: expands and centers form content */
.card-form-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 48px 36px;
  background-color: #ffffff;
  position: relative;
  overflow-y: auto;
}

.mobile-brand-bar {
  display: none;
  margin-bottom: 24px;
  text-align: center;
}

.form-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Cross-fade transition between Register and Login */
.fade-mode-enter-active,
.fade-mode-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-mode-enter-from {
  opacity: 0;
  transform: translateY(6px);
}

.fade-mode-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

/* Responsive Breakpoints */
@media (max-width: 1200px) {
  .auth-card {
    max-width: 1060px;
    min-height: 760px;
  }
  .card-hero-column {
    flex: 0 0 400px;
    width: 400px;
  }
}

@media (max-width: 960px) {
  .auth-card {
    max-width: 840px;
    min-height: 700px;
  }
  .card-hero-column {
    flex: 0 0 340px;
    width: 340px;
  }
  .card-form-column {
    padding: 36px 24px;
  }
}

@media (max-width: 768px) {
  .app-viewport {
    padding: 0;
    background-color: #ffffff;
    align-items: flex-start;
  }

  .auth-card {
    border-radius: 0;
    box-shadow: none;
    min-height: 100vh;
    flex-direction: column;
  }

  .card-hero-column {
    display: none;
  }

  .card-form-column {
    flex: 1;
    width: 100%;
    padding: 40px 20px 48px;
    justify-content: flex-start;
  }

  .mobile-brand-bar {
    display: flex;
    justify-content: center;
    margin-bottom: 28px;
  }
}
</style>
