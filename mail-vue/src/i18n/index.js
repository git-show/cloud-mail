import { createI18n } from 'vue-i18n';
import en from './en.js'
import zh from './zh.js'
import ca from './ca.js'
const i18n = createI18n({
    legacy: false,
    messages: {
        zh,
        en,
        ca
    },
});

export default i18n;