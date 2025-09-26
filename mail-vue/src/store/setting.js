import { defineStore } from 'pinia'

export const useSettingStore = defineStore('setting', {
    state: () => ({
        domainList: [],
        settings: {
            r2Domain: '',
            loginOpacity: 1.00,
        },
    lang: null, // 初期状態は未設定。初回アクセス時にブラウザ言語で決定
    }),
    actions: {

    },
    persist: true // 設定を永続化
})
