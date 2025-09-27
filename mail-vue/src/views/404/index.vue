<template>
  <div class="error-page">
    <div class="box-404">
      <el-empty :image-size="isPhone ? 120 : 0" class="empty" :description="$t('error404')">
        <el-button type="primary" @click="router.replace({name: 'layout'})">{{ $t('home') }}</el-button>
      </el-empty>
    </div>
    <AppFooter class="error-footer" />
  </div>
</template>

<script lang="js" setup>
import router from "@/router/index.js";
import AppFooter from "@/components/app-footer/index.vue";

let isPhone = window.innerWidth < 1025
</script>

<style scoped lang="scss">
.error-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.box-404 {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  flex: 1 1 auto;
}
</style>