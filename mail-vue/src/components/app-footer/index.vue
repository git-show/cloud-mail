<template>
  <footer class="app-footer">
    <router-link class="app-footer__link" to="/terms">
      {{ $t('footer.terms') }}
    </router-link>
    <span class="app-footer__text">{{ copyrightText }}</span>
  </footer>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const copyrightText = computed(() => {
  const year = new Date().getFullYear()
  return t('footer.copyright', { year })
})
</script>

<style scoped lang="scss">
.app-footer {
  position: fixed;
  left: 16px;
  bottom: 16px;
  display: inline-flex;
  flex-direction: column;
  gap: 6px;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.82)!important;
  backdrop-filter: blur(10px);
  border-radius: 12px;
  box-shadow: var(--el-box-shadow-lighter);
  font-size: 13px;
  color: var(--el-text-color-secondary);
  z-index: 250;

  @media (prefers-color-scheme: dark) {
    background: rgba(247, 247, 247, 0.963);
    box-shadow: var(--el-box-shadow-dark);
  }

  @media (max-width: 767px) {
    left: 12px;
    bottom: 12px;
    padding: 10px 14px;
    font-size: 12px;
  }

  &__link {
    color: #000;
    font-weight: 600;
    text-decoration: none;
    transition: color 0.2s ease;

    &:hover {
      color: var(--el-color-primary-light-3);
    }
  }

  &__text {
    color: var(--el-text-color-secondary);
  }
}
</style>
