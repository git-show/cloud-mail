<template>
  <el-config-provider :locale="getElementLocale()">
    <router-view />
  </el-config-provider>
</template>
<script setup>
import { useI18n } from "vue-i18n";
import { watch } from "vue";
import {useSettingStore} from "@/store/setting.js";
const settingStore = useSettingStore()
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import ca from 'element-plus/es/locale/lang/ca';
import('@/icons/index.js')
const { locale } = useI18n()
locale.value = settingStore.lang
watch(() => settingStore.lang, () => locale.value = settingStore.lang)

const getElementLocale = () => {
  switch (settingStore.lang) {
    case 'zh':
      return zhCn;
    case 'ca':
      return ca;
    default:
      return null; // English is default
  }
}
</script>
