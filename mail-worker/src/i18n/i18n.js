import i18next from 'i18next';
import zh from './zh.js'
import en from './en.js'
import ca from './ca.js'
import ja from './ja.js'
import app from '../hono/hono';

app.use('*', async (c, next) => {
	const lang = c.req.header('accept-language')?.split('-')[0]
	// サポートされている言語のみ設定、それ以外は英語をデフォルトに
	const supportedLanguages = ['zh', 'en', 'ca', 'ja'];
	const selectedLang = supportedLanguages.includes(lang) ? lang : 'en';
	i18next.init({
		lng: selectedLang,
	});
	return await next()
})

const resources = {
	en: {
		translation: en
	},
	zh: {
		translation: zh,
	},
	ca: {
		translation: ca,
	},
	ja: {
		translation: ja,
	},
};

i18next.init({
	fallbackLng: 'en', // フォールバック言語を英語に変更
	resources,
});

export const t = (key) => i18next.t(key)

export default i18next;
