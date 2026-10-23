<script setup lang="ts">
import { ref } from 'vue';

interface ToastMessage {
  id: number;
  text: string;
  type: 'info' | 'success' | 'warning';
}

const toasts = ref<ToastMessage[]>([]);
let nextId = 1;

const showToast = (text: string, type: 'info' | 'success' | 'warning' = 'info') => {
  const id = nextId++;
  toasts.value.push({ id, text, type });
  setTimeout(() => {
    removeToast(id);
  }, 4000);
};

const removeToast = (id: number) => {
  toasts.value = toasts.value.filter((t) => t.id !== id);
};

defineExpose({
  showToast,
});
</script>

<template>
  <div class="toast-container" role="region" aria-label="Notificaciones del sistema">
    <transition-group name="toast-anim">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="toast-item"
        :class="toast.type"
        role="status"
      >
        <span class="toast-dot"></span>
        <span class="toast-text">{{ toast.text }}</span>
        <button
          type="button"
          class="toast-close"
          aria-label="Cerrar notificación"
          @click="removeToast(toast.id)"
        >
          &times;
        </button>
      </div>
    </transition-group>
  </div>
</template>

<style scoped>
.toast-container {
  position: fixed;
  bottom: 24px;
  right: 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 10000;
  pointer-events: none;
  max-width: calc(100vw - 48px);
}

.toast-item {
  pointer-events: auto;
  display: flex;
  align-items: center;
  gap: 10px;
  background-color: #1f2937;
  color: #f9fafb;
  padding: 10px 16px;
  border-radius: 10px;
  font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  font-size: 13.5px;
  font-weight: 500;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.2), 0 4px 6px -2px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.toast-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.toast-item.info .toast-dot {
  background-color: #6d56e6;
}

.toast-item.success .toast-dot {
  background-color: #10b981;
}

.toast-item.warning .toast-dot {
  background-color: #f59e0b;
}

.toast-text {
  flex: 1;
}

.toast-close {
  background: none;
  border: none;
  color: #9ca3af;
  font-size: 18px;
  cursor: pointer;
  padding: 0 4px;
  line-height: 1;
  border-radius: 4px;
}

.toast-close:hover {
  color: #ffffff;
}

.toast-anim-enter-active,
.toast-anim-leave-active {
  transition: all 0.25s ease;
}

.toast-anim-enter-from {
  opacity: 0;
  transform: translateY(12px) scale(0.96);
}

.toast-anim-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.96);
}
</style>
