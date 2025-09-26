import { defineStore } from 'pinia'

export const useSettingStore = defineStore('setting', {
    state: () => ({
        domainList: [],
        settings: {
            r2Domain: '',
            loginOpacity: 1.00,
        },
        lang: 'en', // デフォルトを英語に設定
    }),
    actions: {

    },
    persist: true // 設定を永続化
})
