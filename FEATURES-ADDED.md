# Cloud Mail 新功能說明

## 新增功能

### 1. 保留字驗證功能

系統現在會阻止使用以下類型的用戶名：

#### 預設保留字
以下用戶名被系統保留，不能用於註冊或添加賬戶：
- `root`, `admin`, `administrator`, `system`
- `mail`, `email`, `www`, `ftp`, `api`, `app`, `web`
- `server`, `service`, `support`, `help`, `info`, `contact`
- `no-reply`, `noreply`, `postmaster`, `hostmaster`, `webmaster`
- `mailer-daemon`, `security`, `abuse`, `spam`, `test`
- `user`, `users`, `guest`, `public`, `private`
- `null`, `void`, `undefined`

#### 3字符以內英數字限制
所有3個字符或更少且只包含字母和數字的用戶名都被禁止使用，例如：
- `abc`, `123`, `a1`, `xy`, `z99` 等

#### 實現位置
- **後端驗證**：
  - `/mail-worker/src/utils/reserved-words-utils.js` - 保留字驗證工具
  - `/mail-worker/src/service/user-service.js` - 用戶添加驗證
  - `/mail-worker/src/service/login-service.js` - 註冊驗證
  - `/mail-worker/src/service/account-service.js` - 賬戶添加驗證

- **前端驗證**：
  - `/mail-vue/src/utils/reserved-words-utils.js` - 前端保留字驗證工具
  - `/mail-vue/src/views/user/index.vue` - 用戶添加表單驗證
  - `/mail-vue/src/views/login/index.vue` - 註冊表單驗證
  - `/mail-vue/src/layout/account/index.vue` - 賬戶添加表單驗證

### 2. 加泰羅尼亞語（Catalan）支持

系統現在支援加泰羅尼亞語作為第三種語言選項。

#### 新增文件
- `/mail-vue/src/i18n/ca.js` - 前端加泰羅尼亞語翻譯
- `/mail-worker/src/i18n/ca.js` - 後端加泰羅尼亞語翻譯

#### 更新文件
- `/mail-vue/src/i18n/index.js` - 添加加泰羅尼亞語支持
- `/mail-worker/src/i18n/i18n.js` - 添加加泰羅尼亞語支持
- `/mail-vue/src/App.vue` - 更新 Element Plus 語言配置
- `/mail-vue/src/utils/day.js` - 添加加泰羅尼亞語日期格式支持

#### 語言代碼
- 中文：`zh`
- 英文：`en`
- 加泰羅尼亞語：`ca`

### 3. 錯誤消息

新增了以下錯誤消息的多語言支持：

**中文**
- `reservedWordError`: "此用户名为保留字，不能使用"
- `shortAlphanumericError`: "3个字符以内的纯英数字用户名不能使用"

**英文**
- `reservedWordError`: "This username is a reserved word and cannot be used"
- `shortAlphanumericError`: "Usernames with 3 characters or less containing only letters and numbers cannot be used"

**加泰羅尼亞語**
- `reservedWordError`: "Aquest nom d'usuari és una paraula reservada i no es pot utilitzar"
- `shortAlphanumericError`: "Els noms d'usuari de 3 caràcters o menys que continguin només lletres i números no es poden utilitzar"

## 使用方法

### 對於開發者

1. **自定義保留字**：
   可以通過修改 `reserved-words-utils.js` 中的 `DEFAULT_RESERVED_WORDS` 數組來添加更多保留字。

2. **語言切換**：
   用戶可以在系統設置中選擇語言，系統會自動切換界面語言和日期格式。

3. **驗證流程**：
   - 前端會先進行驗證，提供即時反饋
   - 後端會再次驗證，確保數據安全性
   - 如果用戶名被禁止，會顯示相應的錯誤消息

### 測試

運行測試文件來驗證保留字功能：
```bash
# 在瀏覽器中打開
open test-reserved-words.html
```

## 兼容性

- 現有用戶名不會受到影響
- 新的驗證只適用於新註冊和新添加的賬戶
- 所有現有功能保持不變

## 注意事項

1. 保留字驗證不區分大小寫
2. 3字符規則只適用於純字母數字組合（不包含特殊字符如 `-`, `_`, `.`）
3. 新語言支持包括界面翻譯和日期格式
4. 錯誤消息會根據用戶選擇的語言顯示