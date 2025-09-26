const reservedWordsUtils = {
    // 預設的保留字列表
    DEFAULT_RESERVED_WORDS: [
        'root', 'admin', 'administrator', 'system', 'mail', 'email', 
        'www', 'ftp', 'api', 'app', 'web', 'server', 'service',
        'support', 'help', 'info', 'contact', 'no-reply', 'noreply',
        'postmaster', 'hostmaster', 'webmaster', 'mailer-daemon',
        'security', 'abuse', 'spam', 'test', 'user', 'users',
        'guest', 'public', 'private', 'null', 'void', 'undefined'
    ],

    // 檢查是否為保留字
    isReservedWord(name, customReservedWords = []) {
        if (!name || typeof name !== 'string') {
            return false;
        }

        const nameToCheck = name.toLowerCase().trim();

        // 檢查預設保留字
        if (this.DEFAULT_RESERVED_WORDS.includes(nameToCheck)) {
            return true;
        }

        // 檢查自定義保留字
        const customWords = customReservedWords.map(word => word.toLowerCase().trim());
        if (customWords.includes(nameToCheck)) {
            return true;
        }

        // 檢查3文字以內的英數字（只包含字母和數字）
        if (this.isShortAlphanumeric(nameToCheck)) {
            return true;
        }

        return false;
    },

    // 檢查是否為3文字以內的純英數字
    isShortAlphanumeric(name) {
        if (!name || typeof name !== 'string') {
            return false;
        }

        const trimmedName = name.trim();
        
        // 長度必須在1-3之間
        if (trimmedName.length === 0 || trimmedName.length > 3) {
            return false;
        }

        // 只能包含英文字母和數字
        const alphanumericRegex = /^[a-zA-Z0-9]+$/;
        return alphanumericRegex.test(trimmedName);
    },

    // 獲取完整的保留字列表（用於前端顯示）
    getAllReservedWords(customReservedWords = []) {
        const allWords = [...this.DEFAULT_RESERVED_WORDS, ...customReservedWords];
        // 去重並排序
        return [...new Set(allWords.map(word => word.toLowerCase()))].sort();
    },

    // 驗證郵箱用戶名部分是否為保留字
    validateEmailUsername(email, customReservedWords = []) {
        if (!email || typeof email !== 'string') {
            return {
                isValid: false,
                reason: 'invalidEmail'
            };
        }

        const parts = email.split('@');
        if (parts.length !== 2) {
            return {
                isValid: false,
                reason: 'invalidEmailFormat'
            };
        }

        const username = parts[0].toLowerCase().trim();
        
        if (this.isReservedWord(username, customReservedWords)) {
            return {
                isValid: false,
                reason: 'reservedWord',
                reservedWord: username
            };
        }

        return {
            isValid: true
        };
    }
};

export default reservedWordsUtils;