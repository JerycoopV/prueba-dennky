<script setup lang="ts">
import heroImage from '../assets/hero-image.png';

interface Props {
  quote?: string;
  authorName?: string;
  authorRole?: string;
}

withDefaults(defineProps<Props>(), {
  quote: '“Simply all the tools that my team and I need.”',
  authorName: 'Karen Yue',
  authorRole: 'Director of Digital Marketing Technology',
});
</script>

<template>
  <aside class="hero-banner" aria-label="Testimonio de cliente de Nucleus UI">
    <!-- Visual background image -->
    <img
      :src="heroImage"
      alt="Karen Yue sonriendo mientras utiliza Nucleus UI en su tableta"
      class="hero-img"
      loading="eager"
      decoding="async"
    />

    <!-- Accessible hidden semantic quote for screen readers and SEO -->
    <div class="sr-only">
      <header>
        <h2>Nucleus UI</h2>
      </header>
      <figure>
        <blockquote>
          <p>{{ quote }}</p>
        </blockquote>
        <figcaption>
          <strong>{{ authorName }}</strong> — <cite>{{ authorRole }}</cite>
        </figcaption>
      </figure>
    </div>
  </aside>
</template>

<style scoped>
.hero-banner {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 100%;
  overflow: hidden;
  background-color: #1a1a24;
  user-select: none;
}

.hero-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center left;
  display: block;
}

/* Screen reader only utility */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
</style>
