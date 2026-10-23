<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import type { FormSubmissionResult } from '../types/auth';

interface Props {
  isOpen: boolean;
  result: FormSubmissionResult | null;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'register-another'): void;
}>();

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.isOpen) {
    emit('close');
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
});
</script>

<template>
  <teleport to="body">
    <transition name="modal-fade">
      <div
        v-if="isOpen && result"
        class="modal-backdrop"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        @click.self="emit('close')"
      >
        <div class="modal-card">
          <!-- Success Badge Icon -->
          <div class="badge-icon-wrapper">
            <div class="badge-icon-glow"></div>
            <div class="badge-icon">
              <svg viewBox="0 0 24 24" fill="none" class="check-svg" aria-hidden="true">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" />
                <path d="M8 12.5L10.5 15L16 9" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </div>
          </div>

          <span class="badge-pill">Verificación Front-End Completada</span>

          <h2 id="modal-title" class="modal-title">¡Formulario validado con éxito!</h2>
          <p class="modal-description">
            Todos los campos han pasado satisfactoriamente las validaciones locales.
            Tal como especifican los requisitos del reto, no existe conexión a un servidor real.
          </p>

          <!-- Submitted Data Summary -->
          <div class="data-summary">
            <div class="summary-row">
              <span class="summary-label">Operación:</span>
              <span class="summary-value summary-highlight">
                {{ result.mode === 'register' ? 'Registro de cuenta' : 'Inicio de sesión' }}
              </span>
            </div>
            <div v-if="result.name" class="summary-row">
              <span class="summary-label">Nombre:</span>
              <span class="summary-value">{{ result.name }}</span>
            </div>
            <div class="summary-row">
              <span class="summary-label">Correo electrónico:</span>
              <span class="summary-value">{{ result.email }}</span>
            </div>
            <div class="summary-row">
              <span class="summary-label">Estado de verificación:</span>
              <span class="summary-value status-success">
                <span class="status-dot"></span> Validado en cliente
              </span>
            </div>
            <div class="summary-row">
              <span class="summary-label">Hora:</span>
              <span class="summary-value">{{ result.timestamp }}</span>
            </div>
          </div>

          <!-- Actions -->
          <div class="modal-actions">
            <button
              v-if="result.mode === 'register'"
              type="button"
              class="secondary-action-btn"
              id="create-another-btn"
              @click="emit('register-another')"
            >
              Registrar otro usuario
            </button>
            <button
              type="button"
              class="primary-action-btn"
              id="close-modal-btn"
              @click="emit('close')"
            >
              Entendido / Cerrar
            </button>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background-color: rgba(16, 24, 40, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 16px;
  box-sizing: border-box;
}

.modal-card {
  width: 100%;
  max-width: 440px;
  background-color: #ffffff;
  border-radius: 20px;
  padding: 32px 28px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  animation: modal-pop 0.28s cubic-bezier(0.16, 1, 0.3, 1);
}

.badge-icon-wrapper {
  position: relative;
  margin-bottom: 16px;
}

.badge-icon-glow {
  position: absolute;
  inset: -6px;
  background: radial-gradient(circle, rgba(16, 185, 129, 0.25) 0%, transparent 70%);
  border-radius: 50%;
}

.badge-icon {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #ecfdf5;
  color: #10b981;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.check-svg {
  width: 32px;
  height: 32px;
}

.badge-pill {
  display: inline-block;
  padding: 4px 10px;
  background-color: #f0fdf4;
  color: #15803d;
  font-size: 11.5px;
  font-weight: 600;
  border-radius: 999px;
  border: 1px solid #bbf7d0;
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.modal-title {
  font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  font-size: 21px;
  font-weight: 700;
  color: #101828;
  margin: 0 0 8px 0;
  letter-spacing: -0.02em;
}

.modal-description {
  font-size: 13.5px;
  color: #475467;
  line-height: 1.5;
  margin: 0 0 20px 0;
}

.data-summary {
  width: 100%;
  background-color: #f9fafb;
  border: 1px solid #eaecf0;
  border-radius: 12px;
  padding: 12px 16px;
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  text-align: left;
  box-sizing: border-box;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
}

.summary-label {
  color: #667085;
  font-weight: 500;
}

.summary-value {
  color: #1d2939;
  font-weight: 600;
  max-width: 60%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.summary-highlight {
  color: #6d56e6;
}

.status-success {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #15803d;
}

.status-dot {
  width: 7px;
  height: 7px;
  background-color: #16a34a;
  border-radius: 50%;
}

.modal-actions {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.primary-action-btn,
.secondary-action-btn {
  width: 100%;
  height: 44px;
  border-radius: 10px;
  font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  font-size: 14.5px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.18s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.primary-action-btn {
  background-color: #6d56e6;
  color: #ffffff;
  border: none;
}

.primary-action-btn:hover {
  background-color: #5b45d4;
}

.secondary-action-btn {
  background-color: #f4f6f8;
  color: #344054;
  border: 1px solid #d0d5dd;
}

.secondary-action-btn:hover {
  background-color: #e9ecef;
  border-color: #cbd5e1;
}

/* Transitions */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.22s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

@keyframes modal-pop {
  from {
    opacity: 0;
    transform: scale(0.94) translateY(8px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
</style>
