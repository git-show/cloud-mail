import i18next from 'i18next';
import zh from './zh.js'
import en from './en.js'
import ca from './ca.js'
import ja from './ja.js'
import app from '../hono/hono';

app.use('*', async (c, next) => {
	const supportedLanguages = ['zh', 'en', 'ca', 'ja'];
	const acceptLanguage = c.req.header('accept-language');

	const selectedLang = acceptLanguage
		? acceptLanguage
			.split(',')
			.map(lang => lang.trim().split(';')[0])
			.map(lang => lang.toLowerCase().split(/[_-]/)[0])
			.find(lang => supportedLanguages.includes(lang)) || 'en'
		: 'en';

	await i18next.changeLanguage(selectedLang);
	return await next();
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
