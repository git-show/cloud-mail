import {useUserStore} from "@/store/user.js";
import {useSettingStore} from "@/store/setting.js";
import {useAccountStore} from "@/store/account.js";
import {loginUserInfo} from "@/request/my.js";
import {permsToRouter} from "@/perm/perm.js";
import router from "@/router";
import {websiteConfig} from "@/request/setting.js";
import i18n from "@/i18n/index.js";

export async function init() {
    document.title = '\u200B'

    const settingStore = useSettingStore();
    const userStore = useUserStore();
    const accountStore = useAccountStore();

    const token = localStorage.getItem('token');
    if (!settingStore.lang) {
        const supportedLanguages = ['zh', 'ja', 'ca', 'en'];
        
        // まず、古いLocalStorageの'lang'キーから移行を試行
        const oldLangSetting = localStorage.getItem('lang');
        if (oldLangSetting && supportedLanguages.includes(oldLangSetting)) {
            settingStore.lang = oldLangSetting;
            // 移行完了後、古いキーを削除
            localStorage.removeItem('lang');
        } else {
            // LocalStorageにない場合、ブラウザ言語から検出
            const nav = typeof navigator !== 'undefined' ? navigator : null;
            const candidateLanguages = nav && Array.isArray(nav.languages) && nav.languages.length
                ? nav.languages
                : nav?.language
                    ? [nav.language]
                    : [];

            const normalized = candidateLanguages
                .map(lang => (lang || '').toLowerCase().split(/[,_-]/)[0])
                .find(lang => supportedLanguages.includes(lang));

            settingStore.lang = normalized || 'en';
        }
    }

    i18n.global.locale.value = settingStore.lang

    let setting = null;

    if (token) {
        const userPromise = loginUserInfo().catch(e => {
            console.error(e);
            return null;
        });

        const [s, user] = await Promise.all([websiteConfig(), userPromise]);
        setting = s;
        settingStore.settings = setting;
        settingStore.domainList = setting.domainList;
        document.title = setting.title;

        if (user) {
            accountStore.currentAccountId = user.accountId;
            userStore.user = user;

            const routers = permsToRouter(user.permKeys);
            routers.forEach(routerData => {
                router.addRoute('layout', routerData);
            });
        }

    } else {
        setting = await websiteConfig();
        settingStore.settings = setting;
        settingStore.domainList = setting.domainList;
        document.title = setting.title;
    }

    removeLoading();
}

function removeLoading() {
    if (window.innerWidth < 1025) {
        document.documentElement.style.setProperty('--loading-hide-transition', 'none')
    }
    const doc = document.getElementById('loading-first');
    doc.classList.add('loading-hide')
    setTimeout(() => {
        doc.remove()
    },1000)
}

