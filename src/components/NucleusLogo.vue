<script setup lang="ts">
interface Props {
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

withDefaults(defineProps<Props>(), {
  variant: 'dark',
  size: 'md',
  showText: true,
});
</script>

<template>
  <div class="nucleus-logo" :class="[variant, size]">
    <!-- Nucleus Icon (4-petal cluster mark) -->
    <svg
      class="logo-icon"
      viewBox="0 0 28 28"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <!-- Top-Left droplet -->
      <path d="M5.5 2C3.57 2 2 3.57 2 5.5C2 7.43 3.57 9 5.5 9H9.5C11.43 9 13 7.43 13 5.5C13 3.57 11.43 2 9.5 2H5.5Z" />
      <!-- Top-Right droplet -->
      <path d="M18.5 2C16.57 2 15 3.57 15 5.5C15 7.43 16.57 9 18.5 9H22.5C24.43 9 26 7.43 26 5.5C26 3.57 24.43 2 22.5 2H18.5Z" />
      <!-- Bottom-Left droplet -->
      <path d="M5.5 19C3.57 19 2 20.57 2 22.5C2 24.43 3.57 26 5.5 26H9.5C11.43 26 13 24.43 13 22.5C13 20.57 11.43 19 9.5 19H5.5Z" />
      <!-- Bottom-Right droplet -->
      <path d="M18.5 19C16.57 19 15 20.57 15 22.5C15 24.43 16.57 26 18.5 26H22.5C24.43 26 26 24.43 26 22.5C26 20.57 24.43 19 22.5 19H18.5Z" />
      <!-- Subtle diagonal dynamic links in center -->
      <rect x="7.5" y="7.5" width="5" height="5" rx="2.5" />
      <rect x="15.5" y="15.5" width="5" height="5" rx="2.5" />
    </svg>

    <span v-if="showText" class="logo-text">Nucleus</span>
  </div>
</template>

<style scoped>
.nucleus-logo {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  user-select: none;
}

.logo-icon {
  width: 26px;
  height: 26px;
  flex-shrink: 0;
}

.logo-text {
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1;
}

/* Sizes */
.nucleus-logo.sm .logo-icon {
  width: 20px;
  height: 20px;
}
.nucleus-logo.sm .logo-text {
  font-size: 17px;
}

.nucleus-logo.md .logo-icon {
  width: 26px;
  height: 26px;
}
.nucleus-logo.md .logo-text {
  font-size: 21px;
}

.nucleus-logo.lg .logo-icon {
  width: 32px;
  height: 32px;
}
.nucleus-logo.lg .logo-text {
  font-size: 25px;
}

/* Color Variants */
.nucleus-logo.light {
  color: #ffffff;
}

.nucleus-logo.dark {
  color: #111827;
}
</style>
