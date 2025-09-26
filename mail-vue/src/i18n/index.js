import { createI18n } from 'vue-i18n';
import en from './en.js'
import zh from './zh.js'
import ca from './ca.js'
import ja from './ja.js'
const i18n = createI18n({
    legacy: false,
    locale: 'en', // デフォルトのロケール
    fallbackLocale: 'en', // フォールバック用のロケール
    messages: {
        zh,
        en,
        ca,
        ja
    },
});

export default i18n;