<script setup lang="ts">
import { ref, computed } from 'vue';

interface Props {
  id: string;
  name: string;
  label: string;
  type?: 'text' | 'email' | 'password';
  placeholder?: string;
  modelValue?: string;
  error?: string;
  required?: boolean;
  autocomplete?: string;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  placeholder: '',
  modelValue: '',
  error: '',
  required: false,
  autocomplete: 'off',
  disabled: false,
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'blur', event: FocusEvent): void;
  (e: 'focus', event: FocusEvent): void;
}>();

const inputRef = ref<HTMLInputElement | null>(null);
const isFocused = ref(false);
const showPassword = ref(false);

const actualType = computed(() => {
  if (props.type === 'password') {
    return showPassword.value ? 'text' : 'password';
  }
  return props.type;
});

const handleContainerClick = () => {
  if (!props.disabled && inputRef.value) {
    inputRef.value.focus();
  }
};

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.value);
};

const handleFocus = (event: FocusEvent) => {
  isFocused.value = true;
  emit('focus', event);
};

const handleBlur = (event: FocusEvent) => {
  isFocused.value = false;
  emit('blur', event);
};

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};
</script>

<template>
  <div class="auth-field" :class="{ 'has-error': !!error, 'is-disabled': disabled }">
    <!-- Input Container -->
    <div
      class="input-box"
      :class="{ 'is-focused': isFocused, 'has-value': !!modelValue }"
      @click="handleContainerClick"
    >
      <div class="input-content">
        <label :for="id" class="floating-label">
          {{ label }}
          <span v-if="required" class="required-asterisk" aria-hidden="true">*</span>
        </label>
        <input
          :id="id"
          ref="inputRef"
          :name="name"
          :type="actualType"
          :value="modelValue"
          :placeholder="placeholder"
          :required="required"
          :disabled="disabled"
          :autocomplete="autocomplete"
          :aria-invalid="!!error"
          :aria-describedby="error ? `${id}-error` : undefined"
          class="native-input"
          @input="handleInput"
          @focus="handleFocus"
          @blur="handleBlur"
        />
      </div>

      <!-- Password Reveal / Hide Action -->
      <button
        v-if="type === 'password'"
        type="button"
        class="toggle-password-btn"
        :aria-label="showPassword ? 'Ocultar contraseña' : 'Ver contraseña'"
        tabindex="-1"
        @click.stop="togglePasswordVisibility"
      >
        <!-- Eye Icon (when hidden) -->
        <svg
          v-if="!showPassword"
          class="eye-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
        <!-- Eye Off Icon (when visible) -->
        <svg
          v-else
          class="eye-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
          <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
          <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
          <line x1="2" y1="2" x2="22" y2="22" />
        </svg>
      </button>
    </div>

    <!-- Error Message -->
    <transition name="fade-slide">
      <div v-if="error" :id="`${id}-error`" class="error-msg" role="alert">
        <svg
          class="error-icon"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5" />
          <path d="M8 4.5V8.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
          <circle cx="8" cy="11.5" r="0.75" fill="currentColor" />
        </svg>
        <span>{{ error }}</span>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.auth-field {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 2px;
}

.input-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  min-height: 58px;
  padding: 6px 14px 7px;
  background-color: #ffffff;
  border: 1px solid #d0d5dd;
  border-radius: 10px;
  box-sizing: border-box;
  cursor: text;
  transition: border-color 0.18s ease, box-shadow 0.18s ease, background-color 0.18s ease;
}

.input-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
  min-width: 0;
  text-align: left;
}

.floating-label {
  font-size: 11.5px;
  font-weight: 500;
  color: #667085;
  line-height: 1.25;
  margin-bottom: 2px;
  cursor: text;
  user-select: none;
  transition: color 0.15s ease;
}

.required-asterisk {
  color: #f04438;
  margin-left: 2px;
}

.native-input {
  width: 100%;
  border: none;
  outline: none;
  background: transparent;
  padding: 0;
  margin: 0;
  font-family: inherit;
  font-size: 14.5px;
  font-weight: 500;
  color: #101828;
  line-height: 1.35;
  box-sizing: border-box;
}

.native-input::placeholder {
  color: #98a2b3;
  font-weight: 400;
}

/* Password reveal button */
.toggle-password-btn {
  background: none;
  border: none;
  padding: 4px;
  margin-left: 6px;
  color: #98a2b3;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: color 0.15s ease, background-color 0.15s ease;
}

.toggle-password-btn:hover {
  color: #475467;
  background-color: #f2f4f7;
}

.eye-icon {
  width: 18px;
  height: 18px;
}

/* Focus State (Active state matching reference screenshot) */
.input-box.is-focused {
  border-color: #6d56e6;
  box-shadow: 0 0 0 3.5px rgba(109, 86, 230, 0.14);
}

.input-box.is-focused .floating-label {
  color: #6d56e6;
}

/* Error State */
.auth-field.has-error .input-box {
  border-color: #f04438;
  box-shadow: 0 0 0 3px rgba(240, 68, 56, 0.14);
}

.auth-field.has-error .floating-label {
  color: #d92d20;
}

.error-msg {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #d92d20;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.3;
  margin-top: 5px;
  padding-left: 2px;
  text-align: left;
}

.error-icon {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
}

/* Disabled State */
.auth-field.is-disabled .input-box {
  background-color: #f9fafb;
  border-color: #e4e7ec;
  cursor: not-allowed;
}

.auth-field.is-disabled .native-input {
  cursor: not-allowed;
  color: #667085;
}

/* Transition */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
