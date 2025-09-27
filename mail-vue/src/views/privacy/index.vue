<template>
  <div class="privacy-page">
    <header class="privacy-page__header">
      <router-link class="privacy-page__back" :to="homeRoute" aria-label="Back">
        <Icon icon="mingcute:left-line" class="privacy-page__back-icon" width="24" height="24" />
      </router-link>
      <LanguageSwitch class="privacy-page__language" :teleported="false" placement="bottom-end" />
    </header>
    <main class="privacy-page__body">
      <h1 class="privacy-page__title">{{ privacyContent.title }}</h1>
      <p v-if="privacyContent.effectiveDate" class="privacy-page__meta">{{ privacyContent.effectiveDate }}</p>
      <p class="privacy-page__intro">{{ privacyContent.intro }}</p>
      <section
        v-for="section in privacyContent.sections"
        :key="section.title"
        class="privacy-page__section"
      >
        <h2 class="privacy-page__section-title">{{ section.title }}</h2>
        <p
          v-for="(paragraph, index) in section.paragraphs"
          :key="`${section.title}-p-${index}`"
          class="privacy-page__paragraph"
        >
          {{ paragraph }}
        </p>
        <ul v-if="section.bullets" class="privacy-page__list">
          <li
            v-for="(bullet, index) in section.bullets"
            :key="`${section.title}-b-${index}`"
            class="privacy-page__list-item"
          >
            {{ bullet }}
          </li>
        </ul>
      </section>
    </main>
    <AppFooter class="privacy-page__footer" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'
import LanguageSwitch from '@/components/language-switch/index.vue'
import AppFooter from '@/components/app-footer/index.vue'

const { tm } = useI18n()

const privacyContent = computed(() => {
  const content = tm('privacy') || {}
  return {
    title: content.title || '',
    intro: content.intro || '',
    sections: content.sections || [],
    effectiveDate: content.effectiveDate || ''
  }
})

const homeRoute = computed(() => (localStorage.getItem('token') ? '/inbox' : '/login'))
</script>

<style scoped lang="scss">
.privacy-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--el-bg-color);
  color: var(--el-text-color-primary);
  padding: 32px 16px 48px;

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 32px;
  }

  &__back {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 12px;
    border: 1px solid var(--el-border-color);
    color: var(--el-text-color-primary);
    text-decoration: none;
    transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;

    &:hover {
      background-color: var(--el-color-primary-light-9);
      border-color: var(--el-color-primary-light-5);
      color: var(--el-color-primary);
    }
  }

  &__back-icon {
    display: block;
  }

  &__language {
    :deep(.language-switch__chip) {
      border: 1px solid var(--el-border-color);
      border-radius: 999px;
      padding: 4px 16px;
      background-color: rgba(255, 255, 255, 0.6);
      backdrop-filter: blur(6px);
    }
  }

  &__body {
    max-width: 960px;
    margin: 0 auto;
    width: 100%;
    background: rgba(255, 255, 255, 0.9)!important;
    border-radius: 16px;
    box-shadow: var(--el-box-shadow);
    padding: 40px 28px;

    @media (prefers-color-scheme: dark) {
      background: rgba(30, 30, 30, 0.85);
    }

    @media (max-width: 767px) {
      padding: 28px 20px;
    }
  }

  &__title {
    font-size: 28px;
    font-weight: 700;
    margin-bottom: 12px;
  }

  &__meta {
    margin-bottom: 16px;
    font-size: 14px;
    color: var(--el-text-color-secondary);
  }

  &__intro,
  &__paragraph,
  &__list-item {
    line-height: 1.8;
    font-size: 16px;
    margin-bottom: 12px;
  }

  &__section {
    margin-top: 32px;
    border-top: 1px solid var(--el-border-color);
    padding-top: 24px;
  }

  &__section-title {
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 12px;
  }

  &__list {
    list-style: disc;
    padding-left: 24px;
  }

  &__footer {
    margin-top: 32px;
  }
}
</style>
