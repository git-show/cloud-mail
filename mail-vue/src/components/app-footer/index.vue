<template>
  <footer class="app-footer">
    <div class="app-footer__content">
      <span class="app-footer__text">{{ copyrightText }}</span>
      <router-link class="app-footer__link" to="/terms">
        {{ $t('footer.terms') }}
      </router-link>
    </div>
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
  width: 100%;
  border-top: 1px solid var(--el-border-color);
  margin-top: auto;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(8px);

  @media (prefers-color-scheme: dark) {
    background: rgba(30, 30, 30, 0.7);
  }

  &__content {
    max-width: 960px;
    margin: 0 auto;
    padding: 18px 20px;
    display: flex;
    gap: 16px;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    color: var(--el-text-color-secondary);

    @media (max-width: 767px) {
      flex-direction: column;
      gap: 12px;
      text-align: center;
    }
  }

  &__link {
    color: var(--el-color-primary);
    font-weight: 600;
    text-decoration: none;
    transition: color 0.2s ease;

    &:hover {
      color: var(--el-color-primary-light-3);
    }
  }
}
</style>
