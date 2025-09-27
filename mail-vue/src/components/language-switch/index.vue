<template>
  <el-dropdown
    class="language-switch"
    :class="[`language-switch--${variant}`, `language-switch--${size}`]"
    :trigger="trigger"
    :teleported="teleported"
    :placement="placement"
    popper-class="language-switch__dropdown"
    @command="selectLanguage"
  >
    <div class="language-switch__chip" role="button" tabindex="0">
  <span class="language-switch__label">{{ currentLanguage.label }}</span>
      <Icon icon="mingcute:down-small-fill" class="language-switch__arrow" width="18" height="18" />
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          v-for="option in languageOptions"
          :key="option.value"
          :command="option.value"
          :class="{ 'is-active': option.value === locale.value }"
        >
          <span class="language-switch__option-label">{{ option.label }}</span>
          <Icon
            v-if="option.value === locale.value"
            icon="mdi:check-bold"
            class="language-switch__check"
            width="16"
            height="16"
          />
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup>
import { computed } from 'vue'
import { useSettingStore } from '@/store/setting.js'
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'
import { setExtend } from '@/utils/day.js'

const props = defineProps({
  teleported: {
    type: Boolean,
    default: false
  },
  placement: {
    type: String,
    default: 'bottom-end'
  },
  trigger: {
    type: String,
    default: 'click'
  },
  variant: {
    type: String,
    default: 'chip'
  },
  size: {
    type: String,
    default: 'md'
  },
  toastOnChange: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['changed'])

const settingStore = useSettingStore()
const { t, locale } = useI18n()

const languageOptions = computed(() => [
  {
    value: 'en',
    label: t('languageEnglish')
  },
 {
    value: 'ca',
    label: t('languageCatalan')
  },
  {
    value: 'zh',
    label: t('languageChinese')
  },
  {
    value: 'ja',
    label: t('languageJapanese')
  }
])

const currentLanguage = computed(() => {
  return languageOptions.value.find((item) => item.value === locale.value) || languageOptions.value[0]
})

function selectLanguage(lang) {
  if (locale.value === lang) {
    return
  }
  settingStore.lang = lang
  locale.value = lang
  setExtend(lang)
  emit('changed', lang)
  if (props.toastOnChange && typeof ElMessage !== 'undefined') {
    ElMessage({
      message: t('saveSuccessMsg'),
      type: 'success',
      plain: true
    })
  }
}
</script>

<style scoped lang="scss">
.language-switch {
  display: inline-flex;
  &__chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 12px;
    border-radius: 999px;
    // background: linear-gradient(135deg, rgba(77, 171, 255, 0.18), rgba(91, 141, 255, 0.38));
    // border: 1px solid rgba(120, 165, 255, 0.35);
    // backdrop-filter: blur(6px);
    // transition: all 0.25s ease;
    color: var(--el-text-color-primary);
    cursor: pointer;
    // min-width: 110px;
  }

  &__chip:hover {
    opacity: 0.8;
  }

  &__label {
    font-weight: 600;
    font-size: 12px;
    letter-spacing: 0.4px;
    white-space: nowrap;
  }

  &__arrow {
    color: var(--regular-text-color);
  }

  &__option-label {
    flex: 1;
    font-size: 13px;
  }

  &__check {
    color: #3a80dd;
  }
}

.language-switch__dropdown {
  .el-dropdown-menu {
    padding: 6px;
    border-radius: 12px;
    // min-width: 160px;
  }

  .el-dropdown-menu__item {
    display: flex;
    align-items: center;
    gap: 10px;
    border-radius: 8px;
    padding: 8px 12px;
    transition: background 0.2s ease;
  }

  .el-dropdown-menu__item:hover {
    background: rgba(91, 141, 255, 0.12);
  }

  .el-dropdown-menu__item.is-active {
    background: rgba(91, 141, 255, 0.18);
    font-weight: 600;
  }
}
</style>
