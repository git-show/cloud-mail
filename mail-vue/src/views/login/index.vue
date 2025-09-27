<template>
  <div class="login-page">
  <div id="login-box">
    <LanguageSwitch class="login-lang-switch" :teleported="true" />
    <div id="background-wrap" v-if="!settingStore.settings.background">
      <div class="x1 cloud"></div>
      <div class="x2 cloud"></div>
      <div class="x3 cloud"></div>
      <div class="x4 cloud"></div>
      <div class="x5 cloud"></div>
    </div>
    <div v-else :style="background"></div>
    <div class="form-wrapper">
      <div class="container">
        <span class="form-title">{{ settingStore.settings.title }}</span>
        <span class="form-desc" v-if="show === 'login'">{{ $t('loginTitle') }}</span>
        <span class="form-desc" v-else>{{ $t('regTitle') }}</span>
        <div v-show="show === 'login'">
          <el-input :class="settingStore.settings.loginDomain === 0 ? 'email-input' : ''" v-model="form.email"
                    type="text" :placeholder="$t('emailAccount')" autocomplete="off">
            <template #append v-if="settingStore.settings.loginDomain === 0">
              <div @click.stop="openSelect">
                <el-select
                    v-if="show === 'login'"
                    ref="mySelect"
                    v-model="suffix"
                    :placeholder="$t('select')"
                    class="select"
                >
                  <el-option
                      v-for="item in domainList"
                      :key="item"
                      :label="item"
                      :value="item"
                  />
                </el-select>
                <div style="color: var(--el-text-color-primary)">
                  <span>{{ suffix }}</span>
                  <Icon class="setting-icon" icon="mingcute:down-small-fill" width="20" height="20"/>
                </div>
              </div>
            </template>
          </el-input>
          <el-input v-model="form.password" :placeholder="$t('password')" type="password" autocomplete="off">
          </el-input>
          <el-button class="btn" type="primary" @click="submit" :loading="loginLoading"
          >{{ $t('loginBtn') }}
          </el-button>
        </div>
        <div v-show="show !== 'login'">
          <el-input class="email-input" v-model="registerForm.email" type="text" :placeholder="$t('emailAccount')"
                    autocomplete="off">
            <template #append>
              <div @click.stop="openSelect">
                <el-select
                    v-if="show !== 'login'"
                    ref="mySelect"
                    v-model="suffix"
                    :placeholder="$t('select')"
                    class="select"
                >
                  <el-option
                      v-for="item in domainList"
                      :key="item"
                      :label="item"
                      :value="item"
                  />
                </el-select>
                <div>
                  <span>{{ suffix }}</span>
                  <Icon class="setting-icon" icon="mingcute:down-small-fill" width="20" height="20"/>
                </div>
              </div>
            </template>
          </el-input>
          <el-input v-model="registerForm.password" :placeholder="$t('password')" type="password" autocomplete="off"/>
          <el-input v-model="registerForm.confirmPassword" :placeholder="$t('confirmPwd')" type="password"
                    autocomplete="off"/>
          <el-input v-if="settingStore.settings.regKey === 0" v-model="registerForm.code" :placeholder="$t('regKey')"
                    type="text" autocomplete="off"/>
          <el-input v-if="settingStore.settings.regKey === 2" v-model="registerForm.code"
                    :placeholder="$t('regKeyOptional')" type="text" autocomplete="off"/>
          <div v-show="verifyShow"
               class="register-turnstile"
               :data-sitekey="settingStore.settings.siteKey"
               data-callback="onTurnstileSuccess"
               data-error-callback="onTurnstileError"
               data-after-interactive-callback="loadAfter"
               data-before-interactive-callback="loadBefore"
          >
            <span style="font-size: 12px;color: #F56C6C" v-if="botJsError">{{ $t('verifyModuleFailed') }}</span>
          </div>
          <div class="terms-agreement">
            <div class="terms-item" @click="openTermsModal">
              <Icon :icon="termsAgreed ? 'mingcute:check-circle-fill' : 'mingcute:close-circle-line'" 
                    :class="['agreement-icon', termsAgreed ? 'agreed' : 'not-agreed']" 
                    width="18" height="18" />
              <span class="agreement-text">{{ $t('termsOfService') }}</span>
            </div>
            <div class="terms-item" @click="openPrivacyModal">
              <Icon :icon="privacyAgreed ? 'mingcute:check-circle-fill' : 'mingcute:close-circle-line'" 
                    :class="['agreement-icon', privacyAgreed ? 'agreed' : 'not-agreed']" 
                    width="18" height="18" />
              <span class="agreement-text">{{ $t('privacyPolicy') }}</span>
            </div>
          </div>
          <el-button class="btn" type="primary" @click="submitRegister" :loading="registerLoading" :disabled="!isRegisterFormValid"
          >{{ $t('regBtn') }}
          </el-button>
        </div>
        <template v-if="settingStore.settings.register === 0">
          <div class="switch" @click="show = 'register'" v-if="show === 'login'">{{ $t('noAccount') }}
            <span>{{ $t('regSwitch') }}</span></div>
          <div class="switch" @click="show = 'login'" v-else>{{ $t('hasAccount') }} <span>{{ $t('loginSwitch') }}</span>
          </div>
        </template>
      </div>
    </div>
  </div>
  <AppFooter class="login-footer" />
  
  <!-- 利用規約モーダル -->
  <el-dialog v-model="showTermsModal" :title="$t('termsOfService')" width="80%" max-width="800px">
    <div class="modal-content" @scroll="handleTermsScroll" ref="termsModalContent">
      <h1>{{ termsContent.title }}</h1>
      <p v-if="termsContent.effectiveDate" class="meta-text">{{ termsContent.effectiveDate }}</p>
      <p v-if="termsContent.lastUpdated" class="meta-text">{{ termsContent.lastUpdated }}</p>
      <p class="intro-text">{{ termsContent.intro }}</p>
      <section
        v-for="section in termsContent.sections"
        :key="section.title"
        class="content-section"
      >
        <h2>{{ section.title }}</h2>
        <p
          v-for="(paragraph, index) in section.paragraphs"
          :key="`${section.title}-p-${index}`"
        >
          {{ paragraph }}
        </p>
        <ul v-if="section.bullets" class="bullet-list">
          <li
            v-for="(bullet, index) in section.bullets"
            :key="`${section.title}-b-${index}`"
          >
            {{ bullet }}
          </li>
        </ul>
      </section>
    </div>
    <template #footer>
      <div class="modal-footer">
        <el-checkbox v-model="termsModalAgreement" :disabled="!termsScrolledToBottom">
          {{ $t('agreeToTerms') }}
        </el-checkbox>
        <div class="modal-buttons">
          <el-button @click="showTermsModal = false">{{ $t('cancel') }}</el-button>
          <el-button type="primary" @click="confirmTermsAgreement" :disabled="!termsModalAgreement">
            {{ $t('confirm') }}
          </el-button>
        </div>
      </div>
    </template>
  </el-dialog>

  <!-- プライバシーポリシーモーダル -->
  <el-dialog v-model="showPrivacyModal" :title="$t('privacyPolicy')" width="80%" max-width="800px">
    <div class="modal-content" @scroll="handlePrivacyScroll" ref="privacyModalContent">
      <h1>{{ privacyContent.title }}</h1>
      <p v-if="privacyContent.effectiveDate" class="meta-text">{{ privacyContent.effectiveDate }}</p>
      <p class="intro-text">{{ privacyContent.intro }}</p>
      <section
        v-for="section in privacyContent.sections"
        :key="section.title"
        class="content-section"
      >
        <h2>{{ section.title }}</h2>
        <p
          v-for="(paragraph, index) in section.paragraphs"
          :key="`${section.title}-p-${index}`"
        >
          {{ paragraph }}
        </p>
        <ul v-if="section.bullets" class="bullet-list">
          <li
            v-for="(bullet, index) in section.bullets"
            :key="`${section.title}-b-${index}`"
          >
            {{ bullet }}
          </li>
        </ul>
      </section>
    </div>
    <template #footer>
      <div class="modal-footer">
        <el-checkbox v-model="privacyModalAgreement" :disabled="!privacyScrolledToBottom">
          {{ $t('agreeToPrivacy') }}
        </el-checkbox>
        <div class="modal-buttons">
          <el-button @click="showPrivacyModal = false">{{ $t('cancel') }}</el-button>
          <el-button type="primary" @click="confirmPrivacyAgreement" :disabled="!privacyModalAgreement">
            {{ $t('confirm') }}
          </el-button>
        </div>
      </div>
    </template>
  </el-dialog>
  </div>
</template>

<script setup>
import router from "@/router";
import {computed, nextTick, reactive, ref} from "vue";
import {login} from "@/request/login.js";
import {register} from "@/request/login.js";
import {isEmail} from "@/utils/verify-utils.js";
import {useSettingStore} from "@/store/setting.js";
import {useAccountStore} from "@/store/account.js";
import {useUserStore} from "@/store/user.js";
import {useUiStore} from "@/store/ui.js";
import {Icon} from "@iconify/vue";
import {cvtR2Url} from "@/utils/convert.js";
import {loginUserInfo} from "@/request/my.js";
import {permsToRouter} from "@/perm/perm.js";
import {useI18n} from "vue-i18n";
import reservedWordsUtils from "@/utils/reserved-words-utils.js";
import LanguageSwitch from "@/components/language-switch/index.vue";
import AppFooter from "@/components/app-footer/index.vue";

const {t, tm} = useI18n();
const accountStore = useAccountStore();
const userStore = useUserStore();
const uiStore = useUiStore();
const settingStore = useSettingStore();
const loginLoading = ref(false)
const show = ref('login')
const form = reactive({
  email: '',
  password: '',

});
const mySelect = ref()
const suffix = ref('')
const registerForm = reactive({
  email: '',
  password: '',
  confirmPassword: '',
  code: null
})
const domainList = settingStore.domainList;
const registerLoading = ref(false)
suffix.value = domainList[0]
const verifyShow = ref(false)
let verifyToken = ''
let turnstileId = null
let botJsError = ref(false)
let verifyErrorCount = 0
const termsAgreed = ref(false)
const privacyAgreed = ref(false)
const showTermsModal = ref(false)
const showPrivacyModal = ref(false)
const termsScrolledToBottom = ref(false)
const privacyScrolledToBottom = ref(false)
const termsModalAgreement = ref(false)
const privacyModalAgreement = ref(false)

const isRegisterFormValid = computed(() => {
  return registerForm.email && 
         registerForm.password && 
         registerForm.confirmPassword && 
         termsAgreed.value && 
         privacyAgreed.value
})

window.onTurnstileSuccess = (token) => {
  verifyToken = token;
};

window.onTurnstileError = (e) => {
  if (verifyErrorCount >= 4) {
    return
  }
  verifyErrorCount++
  console.warn('人机验加载失败', e)
  setTimeout(() => {
    nextTick(() => {
      if (!turnstileId) {
        turnstileId = window.turnstile.render('.register-turnstile')
      } else {
        window.turnstile.reset(turnstileId);
      }
    })
  }, 1500)
};

window.loadAfter = (e) => {
  console.log('loadAfter')
}

window.loadBefore = (e) => {
  console.log('loadBefore')
}

// 利用規約・プライバシーポリシーのコンテンツ
const termsContent = computed(() => {
  const content = tm('terms') || {}
  return {
    title: content.title || '',
    intro: content.intro || '',
    sections: content.sections || [],
    effectiveDate: content.effectiveDate || '',
    lastUpdated: content.lastUpdated || ''
  }
})

const privacyContent = computed(() => {
  const content = tm('privacy') || {}
  return {
    title: content.title || '',
    intro: content.intro || '',
    sections: content.sections || [],
    effectiveDate: content.effectiveDate || ''
  }
})

// モーダル制御関数
const openTermsModal = () => {
  showTermsModal.value = true
  termsScrolledToBottom.value = false
  termsModalAgreement.value = false
}

const openPrivacyModal = () => {
  showPrivacyModal.value = true
  privacyScrolledToBottom.value = false
  privacyModalAgreement.value = false
}

// スクロール監視関数
const handleTermsScroll = (event) => {
  const { scrollTop, scrollHeight, clientHeight } = event.target
  if (scrollTop + clientHeight >= scrollHeight - 10) {
    termsScrolledToBottom.value = true
  }
}

const handlePrivacyScroll = (event) => {
  const { scrollTop, scrollHeight, clientHeight } = event.target
  if (scrollTop + clientHeight >= scrollHeight - 10) {
    privacyScrolledToBottom.value = true
  }
}

// 同意確認関数
const confirmTermsAgreement = () => {
  termsAgreed.value = true
  showTermsModal.value = false
}

const confirmPrivacyAgreement = () => {
  privacyAgreed.value = true
  showPrivacyModal.value = false
}

const loginOpacity = computed(() => {
  const opacity = settingStore.settings.loginOpacity
  return uiStore.dark ? `rgba(0, 0, 0, ${opacity})` : `rgba(255, 255, 255, ${opacity})`
})

const background = computed(() => {

  return settingStore.settings.background ? {
    'background-image': `url(${cvtR2Url(settingStore.settings.background)})`,
    'background-repeat': 'no-repeat',
    'background-size': 'cover',
    'background-position': 'center'
  } : ''
})


const openSelect = () => {
  mySelect.value.toggleMenu()
}

const submit = () => {

  if (!form.email) {
    ElMessage({
      message: t('emptyEmailMsg'),
      type: 'error',
      plain: true,
    })
    return
  }

  let email = form.email + (settingStore.settings.loginDomain === 0 ? suffix.value : '');

  if (!isEmail(email)) {
    ElMessage({
      message: t('notEmailMsg'),
      type: 'error',
      plain: true,
    })
    return
  }

  if (!form.password) {
    ElMessage({
      message: t('emptyPwdMsg'),
      type: 'error',
      plain: true,
    })
    return
  }

  loginLoading.value = true
  login(email, form.password).then(async data => {
    localStorage.setItem('token', data.token)
    const user = await loginUserInfo();
    accountStore.currentAccountId = user.accountId;
    userStore.user = user;
    const routers = permsToRouter(user.permKeys);
    routers.forEach(routerData => {
      router.addRoute('layout', routerData);
    });
    await router.replace({name: 'layout'})
    uiStore.showNotice()
  }).finally(() => {
    loginLoading.value = false
  })
}


function submitRegister() {

  if (!termsAgreed.value || !privacyAgreed.value) {
    ElMessage({
      message: t('agreeToTermsRequired'),
      type: 'error',
      plain: true,
    })
    return
  }

  if (!registerForm.email) {
    ElMessage({
      message: t('emptyEmailMsg'),
      type: 'error',
      plain: true,
    })
    return
  }

  if (!isEmail(registerForm.email + suffix.value)) {
    ElMessage({
      message: t('notEmailMsg'),
      type: 'error',
      plain: true,
    })
    return
  }

  // Validate reserved words
  const reservedValidation = reservedWordsUtils.validateUsername(registerForm.email);
  if (!reservedValidation.isValid) {
    if (reservedValidation.reason === 'reservedWord') {
      ElMessage({
        message: t('reservedWordError'),
        type: 'error',
        plain: true,
      })
      return
    }
  }

  if (!registerForm.password) {
    ElMessage({
      message: t('emptyPwdMsg'),
      type: 'error',
      plain: true,
    })
    return
  }

  if (registerForm.password.length < 6) {
    ElMessage({
      message: t('pwdLengthMsg'),
      type: 'error',
      plain: true,
    })
    return
  }

  if (registerForm.password !== registerForm.confirmPassword) {

    ElMessage({
      message: t('confirmPwdFailMsg'),
      type: 'error',
      plain: true,
    })
    return
  }

  if (settingStore.settings.regKey === 0) {

    if (!registerForm.code) {

      ElMessage({
        message: t('emptyRegKeyMsg'),
        type: 'error',
        plain: true,
      })
      return
    }

  }

  if (!verifyToken && (settingStore.settings.registerVerify === 0 || (settingStore.settings.registerVerify === 2 && settingStore.settings.regVerifyOpen))) {
    if (!verifyShow.value) {
      verifyShow.value = true
      nextTick(() => {
        if (!turnstileId) {
          try {
            turnstileId = window.turnstile.render('.register-turnstile')
          } catch (e) {
            botJsError.value = true
            console.log('人机验证js加载失败')
          }
        } else {
          window.turnstile.reset('.register-turnstile')
        }
      })
    } else if (!botJsError.value) {
      ElMessage({
        message: t('botVerifyMsg'),
        type: "error",
        plain: true
      })
    }
    return;
  }

  registerLoading.value = true

  const form = {
    email: registerForm.email + suffix.value,
    password: registerForm.password,
    token: verifyToken,
    code: registerForm.code
  }

  register(form).then(({regVerifyOpen}) => {
    show.value = 'login'
    registerForm.email = ''
    registerForm.password = ''
    registerForm.confirmPassword = ''
    registerForm.code = ''
    termsAgreed.value = false
    privacyAgreed.value = false
    termsScrolledToBottom.value = false
    privacyScrolledToBottom.value = false
    termsModalAgreement.value = false
    privacyModalAgreement.value = false
    registerLoading.value = false
    verifyToken = ''
    settingStore.settings.regVerifyOpen = regVerifyOpen
    verifyShow.value = false
    ElMessage({
      message: t('regSuccessMsg'),
      type: 'success',
      plain: true,
    })
  }).catch(res => {

    registerLoading.value = false

    if (res.code === 400) {
      verifyToken = ''
      settingStore.settings.regVerifyOpen = true
      if (turnstileId) {
        window.turnstile.reset(turnstileId)
      } else {
        nextTick(() => {
          turnstileId = window.turnstile.render('.register-turnstile')
        })
      }
      verifyShow.value = true

    }
  });
}

</script>


<style>
.el-select-dropdown__item {
  padding: 0 15px;
}

.no-autofill-pwd {
  .el-input__inner {
    -webkit-text-security: disc !important;
  }
}
</style>

<style lang="scss" scoped>

.form-wrapper {
  position: fixed;
  right: 0;
  height: 100%;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  @media (max-width: 767px) {
    width: 100%;
  }
}

.container {
  background: v-bind(loginOpacity);
  padding-left: 40px;
  padding-right: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 450px;
  height: 100%;
  border-left: 1px solid var(--login-border);
  box-shadow: var(--el-box-shadow-light);
  @media (max-width: 1024px) {
    padding: 20px 18px;
    width: 384px;
    margin-left: 18px;
  }
  @media (max-width: 767px) {
    border: 1px solid var(--login-border);
    padding: 20px 18px;
    border-radius: 6px;
    height: fit-content;
    width: 100%;
    margin-right: 18px;
    margin-left: 18px;
  }

  .btn {
    height: 36px;
    width: 100%;
    border-radius: 6px;
  }

  .form-desc {
    margin-top: 5px;
    margin-bottom: 18px;
    color: var(--form-desc-color);
  }

  .form-title {
    font-weight: bold;
    font-size: 22px !important;
  }

  .switch {
    margin-top: 20px;
    text-align: center;

    span {
      color: var(--login-switch-color);
      cursor: pointer;
    }
  }

  :deep(.el-input__wrapper) {
    border-radius: 6px;
    background: var(--el-bg-color);
  }

  .email-input :deep(.el-input__wrapper) {
    border-radius: 6px 0 0 6px;
    background: var(--el-bg-color);
  }

  .el-input {
    height: 38px;
    width: 100%;
    margin-bottom: 18px;

    :deep(.el-input__inner) {
      height: 36px;
    }
  }
}

:deep(.el-select-dropdown__item) {
  padding: 0 10px;
}

.setting-icon {
  position: relative;
  top: 6px;
}

:deep(.el-input-group__append) {
  padding: 0 !important;
  padding-left: 8px !important;
  padding-right: 4px !important;
  background: var(--el-bg-color);
  border-radius: 0 8px 8px 0;
}

.register-turnstile {
  margin-bottom: 18px;
}

.terms-agreement {
  margin-bottom: 18px;
  font-size: 14px;
  width: 100%;
  
  .terms-item {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
    cursor: pointer;
    padding: 8px;
    border-radius: 6px;
    transition: background-color 0.2s;
    
    &:hover {
      background-color: var(--el-fill-color-light);
    }
    
    .agreement-icon {
      margin-right: 8px;
      
      &.agreed {
        color: var(--el-color-success);
      }
      
      &.not-agreed {
        color: var(--el-color-error);
      }
    }
    
    .agreement-text {
      color: var(--el-text-color-primary);
      font-weight: 500;
    }
  }
}

.modal-content {
  max-height: 400px;
  overflow-y: auto;
  padding: 20px 0;
  
  h1 {
    font-size: 24px;
    margin-bottom: 16px;
    color: var(--el-text-color-primary);
  }
  
  h2 {
    font-size: 18px;
    margin: 20px 0 12px 0;
    color: var(--el-text-color-primary);
  }
  
  .meta-text {
    font-size: 14px;
    color: var(--el-text-color-secondary);
    margin-bottom: 8px;
  }
  
  .intro-text {
    margin-bottom: 20px;
    line-height: 1.6;
  }
  
  .content-section {
    margin-bottom: 24px;
    
    p {
      margin-bottom: 12px;
      line-height: 1.6;
    }
    
    .bullet-list {
      margin-left: 20px;
      
      li {
        margin-bottom: 8px;
        line-height: 1.6;
      }
    }
  }
}

.modal-footer {
  display: flex;
  flex-direction: column;
  gap: 16px;
  
  .modal-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
  }
}

.select {
  position: absolute;
  right: 30px;
  width: 100px;
  opacity: 0;
  pointer-events: none;
}

.custom-style {
  margin-bottom: 10px;
}

.custom-style .el-segmented {
  --el-border-radius-base: 6px;
  width: 180px;
}


.login-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(to bottom, #2980b9, #6dd5fa, #fff);
}

#login-box {
  flex: 1 1 auto;
  width: 100%;
  background: linear-gradient(to bottom, #2980b9, #6dd5fa, #fff);
  font: 100% Arial, sans-serif;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
  display: grid;
  grid-template-columns: 1fr;
  position: relative;
}


.login-lang-switch {
  position: absolute;
  top: 24px;
  right: 24px;
  z-index: 20;

  @media (max-width: 767px) {
    top: 18px;
    right: 18px;
  }

  :deep(.language-switch__chip) {
    backdrop-filter: blur(10px);
  }
}


#background-wrap {
  height: 100%;
  z-index: 0;
}

@keyframes animateCloud {
  0% {
    margin-left: -500px;
  }

  100% {
    margin-left: 100%;
  }
}

.x1 {
  animation: animateCloud 30s linear infinite;
  transform: scale(0.65);
}

.x2 {
  animation: animateCloud 15s linear infinite;
  transform: scale(0.3);
}

.x3 {
  animation: animateCloud 25s linear infinite;
  transform: scale(0.5);
}

.x4 {
  animation: animateCloud 13s linear infinite;
  transform: scale(0.4);
}

.x5 {
  animation: animateCloud 20s linear infinite;
  transform: scale(0.55);
}

.cloud {
  background: linear-gradient(to bottom, #fff 5%, #f1f1f1 100%);
  border-radius: 100px;
  box-shadow: 0 8px 5px rgba(0, 0, 0, 0.1);
  height: 120px;
  width: 350px;
  position: relative;
}

.cloud:after,
.cloud:before {
  content: "";
  position: absolute;
  background: #fff;
  z-index: -1;
}

.cloud:after {
  border-radius: 100px;
  height: 100px;
  left: 50px;
  top: -50px;
  width: 100px;
}

.cloud:before {
  border-radius: 200px;
  height: 180px;
  width: 180px;
  right: 50px;
  top: -90px;
}

</style>
