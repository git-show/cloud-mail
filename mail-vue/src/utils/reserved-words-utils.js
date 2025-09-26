// 前端保留字驗證工具

// 前端驗證工具，複製自後端的保留字驗證邏輯
const frontendReservedWordsUtils = {
    // 預設的保留字列表（與後端保持一致）
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
    },

    // 驗證單純的用戶名（不包含@域名部分）
    validateUsername(username, customReservedWords = []) {
        if (!username || typeof username !== 'string') {
            return {
                isValid: false,
                reason: 'invalidUsername'
            };
        }

        const trimmedUsername = username.toLowerCase().trim();
        
        if (this.isReservedWord(trimmedUsername, customReservedWords)) {
            return {
                isValid: false,
                reason: 'reservedWord',
                reservedWord: trimmedUsername
            };
        }

        return {
            isValid: true
        };
    }
};

export default frontendReservedWordsUtils;