<template>
  <div class="contact-page">
    <!-- ヘッダー -->
    <header class="contact-header">
      <router-link :to="homeRoute" class="back-btn">
        ←
      </router-link>
      <div class="lang-selector">
        <select v-model="currentLang" class="lang-select">
          <option value="ja">日本語</option>
          <option value="en">English</option>
          <option value="zh">中文</option>
          <option value="ca">Català</option>
        </select>
      </div>
    </header>

    <!-- メインコンテンツ -->
    <main class="contact-main">
      <div class="contact-form-container">
        <!-- 送信完了メッセージ -->
        <div v-if="isSubmitted" class="success-message">
          <div class="success-icon">✓</div>
          <h2 class="success-title">{{ texts[currentLang].thankYou }}</h2>
          <p class="success-text">{{ texts[currentLang].successMessage }}</p>
          <button @click="isSubmitted = false" class="back-to-form-btn">
            {{ texts[currentLang].backToForm }}
          </button>
        </div>

        <!-- フォーム -->
        <div v-else>
          <h1 class="contact-title">{{ texts[currentLang].title }}</h1>
          <p class="contact-intro">{{ texts[currentLang].intro }}</p>

          <form @submit.prevent="handleSubmit" class="contact-form">
          <!-- メールアドレス -->
          <div class="form-group">
            <label class="form-label">{{ texts[currentLang].email }}</label>
            <input
              type="email"
              v-model="form.email"
              :placeholder="texts[currentLang].emailPlaceholder"
              class="form-input"
              required
            />
          </div>

          <!-- 緊急度と問い合わせ項目を横並び -->
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">{{ texts[currentLang].urgency }}</label>
              <select v-model="form.urgency" class="form-select">
                <option value="low">{{ texts[currentLang].urgencyLow }}</option>
                <option value="normal">{{ texts[currentLang].urgencyNormal }}</option>
                <option value="high">{{ texts[currentLang].urgencyHigh }}</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">{{ texts[currentLang].category }}</label>
              <select v-model="form.category" class="form-select">
                <option value="general">{{ texts[currentLang].categoryGeneral }}</option>
                <option value="bug">{{ texts[currentLang].categoryBug }}</option>
                <option value="feature">{{ texts[currentLang].categoryFeature }}</option>
                <option value="support">{{ texts[currentLang].categorySupport }}</option>
              </select>
            </div>
          </div>

          <!-- 問い合わせ内容 -->
          <div class="form-group">
            <label class="form-label">{{ texts[currentLang].message }}</label>
            <textarea
              v-model="form.message"
              :placeholder="texts[currentLang].messagePlaceholder"
              class="form-textarea"
              rows="6"
              maxlength="200"
              required
            ></textarea>
            <div class="char-count">{{ form.message.length }}/200</div>
          </div>

          <!-- 返信が必要か -->
          <div class="form-group">
            <label class="checkbox-label">
              <input type="checkbox" v-model="form.needReply" class="checkbox">
              {{ texts[currentLang].needReply }}
            </label>
          </div>

          <!-- 送信ボタン -->
          <button type="submit" class="submit-btn" :disabled="isSubmitting">
            <span v-if="isSubmitting">{{ texts[currentLang].sending || '送信中...' }}</span>
            <span v-else>{{ texts[currentLang].submit }}</span>
          </button>
          </form>
        </div>
      </div>
    </main>

    <!-- フッター -->
    <footer class="contact-footer">
      <div class="footer-links">
        <router-link to="/terms">{{ texts[currentLang].terms }}</router-link>
        <span>•</span>
        <router-link to="/privacy">{{ texts[currentLang].privacy }}</router-link>
        <span>•</span>
        <router-link to="/contact">{{ texts[currentLang].contact }}</router-link>
      </div>
      <div class="copyright">© 2025 cats.cat</div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useSettingStore } from '@/store/setting.js'

const router = useRouter()
const { locale } = useI18n() // Vue.jsのi18nシステムから言語設定を取得
const settingStore = useSettingStore() // Piniaの設定ストアを使用

// フォームデータ
const form = ref({
  email: '',
  urgency: 'normal',
  category: 'general',
  message: '',
  needReply: false
})

// 現在の言語 - 統一されたシステムを使用
const currentLang = computed({
  get: () => locale.value,
  set: (value) => {
    settingStore.lang = value
    locale.value = value
  }
})

// ホームルート
const homeRoute = computed(() => {
  return localStorage.getItem('token') ? '/inbox' : '/login'
})

// 多言語テキスト
const texts = {
  ja: {
    title: 'cats.cat お問い合わせ',
    intro: '以下のフォームに必要事項を入力して送信してください。',
    email: 'メールアドレス',
    emailPlaceholder: 'you@example.com',
    urgency: '緊急度',
    urgencyLow: '低',
    urgencyNormal: '標準',
    urgencyHigh: '高',
    category: 'お問い合わせ項目',
    categoryGeneral: '一般的なお問い合わせ',
    categoryBug: '不具合報告',
    categoryFeature: '機能要望',
    categorySupport: 'アカウントサポート',
    message: 'お問い合わせ内容',
    messagePlaceholder: '200文字以内でご記入ください',
    needReply: '返信が必要',
    submit: '送信',
    sending: '送信中...',
    thankYou: 'ありがとうございました',
    successMessage: 'お問い合わせメールを送信いたしました。お返事をお待ちください。',
    backToForm: 'フォームに戻る',
    validationRequired: '必須項目を入力してください',
    validationLength: 'メッセージは200文字以内で入力してください',
    sendError: 'メール送信に失敗しました。しばらく時間をおいて再度お試しください。',
    terms: '利用規約',
    privacy: 'プライバシーポリシー',
    contact: 'お問い合わせ'
  },
  en: {
    title: 'Contact cats.cat',
    intro: 'Please fill out the form below and submit your inquiry.',
    email: 'Email',
    emailPlaceholder: 'you@example.com',
    urgency: 'Urgency',
    urgencyLow: 'Low',
    urgencyNormal: 'Normal',
    urgencyHigh: 'High',
    category: 'Inquiry Type',
    categoryGeneral: 'General Inquiry',
    categoryBug: 'Bug Report',
    categoryFeature: 'Feature Request',
    categorySupport: 'Account Support',
    message: 'Message',
    messagePlaceholder: 'Describe your inquiry (max 200 characters)',
    needReply: 'Reply required',
    submit: 'Send',
    sending: 'Sending...',
    thankYou: 'Thank You',
    successMessage: 'Your inquiry has been sent successfully. We will get back to you soon.',
    backToForm: 'Back to Form',
    validationRequired: 'Please fill in all required fields',
    validationLength: 'Message must be 200 characters or less',
    sendError: 'Failed to send email. Please try again later.',
    terms: 'Terms of Service',
    privacy: 'Privacy Policy',
    contact: 'Contact'
  },
  zh: {
    title: 'cats.cat 联系我们',
    intro: '请填写以下表单并提交您的咨询。',
    email: '邮箱',
    emailPlaceholder: 'you@example.com',
    urgency: '紧急程度',
    urgencyLow: '低',
    urgencyNormal: '正常',
    urgencyHigh: '高',
    category: '咨询类别',
    categoryGeneral: '一般咨询',
    categoryBug: '问题反馈',
    categoryFeature: '功能建议',
    categorySupport: '账号支持',
    message: '咨询内容',
    messagePlaceholder: '请在200字以内描述',
    needReply: '需要回复',
    submit: '发送',
    sending: '发送中...',
    thankYou: '谢谢您',
    successMessage: '您的咨询已成功发送。我们会尽快回复您。',
    backToForm: '返回表单',
    validationRequired: '请填写所有必填项',
    validationLength: '咨询内容请控制在200字以内',
    sendError: '邮件发送失败，请稍后重试。',
    terms: '服务条款',
    privacy: '隐私政策',
    contact: '联系我们'
  },
  ca: {
    title: 'Contacte de cats.cat',
    intro: 'Si us plau, ompliu el formulari següent i envieu la vostra consulta.',
    email: 'Correu electrònic',
    emailPlaceholder: 'tu@example.com',
    urgency: 'Nivell d\'urgència',
    urgencyLow: 'Baixa',
    urgencyNormal: 'Normal',
    urgencyHigh: 'Alta',
    category: 'Tipus de consulta',
    categoryGeneral: 'Consulta general',
    categoryBug: 'Informe d\'error',
    categoryFeature: 'Suggeriment de funcions',
    categorySupport: 'Suport de compte',
    message: 'Missatge',
    messagePlaceholder: 'Descriu-ho en un màxim de 200 caràcters',
    needReply: 'Necessito resposta',
    submit: 'Enviar',
    sending: 'Enviant...',
    thankYou: 'Gràcies',
    successMessage: 'La vostra consulta s\'ha enviat correctament. Us respondrem aviat.',
    backToForm: 'Tornar al formulari',
    validationRequired: 'Si us plau, ompliu tots els camps obligatoris',
    validationLength: 'El missatge ha de tenir 200 caràcters o menys',
    sendError: 'Error en enviar el correu. Si us plau, torneu-ho a provar més tard.',
    terms: 'Condicions del servei',
    privacy: 'Política de privadesa',
    contact: 'Contacte'
  }
}

// 言語変更（computedプロパティで自動処理）

// 送信完了状態
const isSubmitted = ref(false)

// 送信中状態
const isSubmitting = ref(false)

// フォーム送信
const handleSubmit = async () => {
  if (!form.value.email || !form.value.message) {
    alert(texts[currentLang.value].validationRequired || '必須項目を入力してください')
    return
  }

  if (form.value.message.length > 200) {
    alert(texts[currentLang.value].validationLength || 'メッセージは200文字以内で入力してください')
    return
  }

  isSubmitting.value = true

  try {
    // APIエンドポイントに送信
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept-Language': currentLang.value // バックエンドの統一言語システムに言語を伝える
      },
      body: JSON.stringify({
        email: form.value.email,
        urgency: form.value.urgency,
        category: form.value.category,
        message: form.value.message,
        needReply: form.value.needReply,
        lang: currentLang.value // 互換性のため残す
      }),
    })

    const result = await response.json()

    if (result.success) {
      // 送信成功
      isSubmitted.value = true
      
      // フォームリセット
      form.value = {
        email: '',
        urgency: 'normal',
        category: 'general', 
        message: '',
        needReply: false
      }
    } else {
      // 送信失敗
      alert(result.error || texts[currentLang.value].sendError || 'メール送信に失敗しました')
    }
  } catch (error) {
    console.error('Send error:', error)
    alert(texts[currentLang.value].sendError || 'メール送信に失敗しました')
  } finally {
    isSubmitting.value = false
  }
}

// コンポーネント初期化
onMounted(() => {
  // 設定ストアから言語を初期化（Piniaの永続化機能を使用）
  if (settingStore.lang && ['ja', 'en', 'zh', 'ca'].includes(settingStore.lang)) {
    locale.value = settingStore.lang
  }
})
</script>

<style scoped>
.contact-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.contact-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.back-btn {
  color: #333;
  text-decoration: none;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #ddd;
  border-radius: 50%;
  background: white;
  transition: all 0.2s;
  font-size: 18px;
  font-weight: bold;
}

.back-btn:hover {
  background: #f8f9fa;
  border-color: #007bff;
  color: #007bff;
}

.lang-selector {
  position: relative;
}

.lang-select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: white;
  font-size: 14px;
  cursor: pointer;
}

.contact-main {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 20px;
}

.contact-form-container {
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  padding: 40px;
  max-width: 600px;
  width: 100%;
}

.contact-title {
  font-size: 28px;
  font-weight: 700;
  color: #333;
  margin-bottom: 12px;
  text-align: center;
}

.contact-intro {
  color: #666;
  text-align: center;
  margin-bottom: 32px;
  line-height: 1.6;
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-weight: 600;
  color: #333;
  font-size: 14px;
}

.form-input,
.form-select,
.form-textarea {
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.2s;
  font-family: inherit;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 120px;
}

.char-count {
  text-align: right;
  font-size: 12px;
  color: #666;
  margin-top: -4px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: normal;
  cursor: pointer;
}

.checkbox {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.submit-btn {
  background: #007bff;
  color: white;
  border: none;
  padding: 16px 32px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.submit-btn:hover:not(:disabled) {
  background: #0056b3;
}

.submit-btn:disabled {
  background: #6c757d;
  cursor: not-allowed;
  opacity: 0.7;
}

.contact-footer {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  padding: 20px;
  text-align: center;
}

.footer-links {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.footer-links a {
  color: #333;
  text-decoration: none;
  font-weight: 600;
  font-size: 14px;
}

.footer-links a:hover {
  color: #007bff;
}

.footer-links span {
  color: #999;
}

.copyright {
  color: #666;
  font-size: 12px;
}

/* 送信完了メッセージのスタイル */
.success-message {
  text-align: center;
  padding: 40px 20px;
}

.success-icon {
  width: 80px;
  height: 80px;
  background: #28a745;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  font-weight: bold;
  margin: 0 auto 24px;
}

.success-title {
  font-size: 24px;
  font-weight: 700;
  color: #333;
  margin-bottom: 16px;
}

.success-text {
  color: #666;
  line-height: 1.6;
  margin-bottom: 32px;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
}

.back-to-form-btn {
  background: #6c757d;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.back-to-form-btn:hover {
  background: #545b62;
}
</style>
