<template>
  <!-- 登录界面 -->
  <div class="loginMain">

    <div class="Container">
      <header>
        <h1>欢迎使用SSP</h1>
      </header>
      <!-- 登录详细块 -->
      <div class="loginContainer" v-if="loginState === 'login'">
        登录详细块
      </div>
      <!-- 注册详细块 -->
      <div class="registContainer" v-else>
        注册详细块
      </div>
      <!-- 功能按钮 -->
      <div class="functionButton">
        <button class="bigButton" @click="toggleState()">{{ toggleButtonContext }}</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

const loginState = ref('login')

const toggleButtonContext = computed(() => {
  switch(loginState.value){
    case 'login': return '切换为注册'
    case 'regist': return '切换为登录'
    default: return '切换'
  }
})

const toggleState = () => {loginState.value = loginState.value === 'login' ? 'regist' : 'login'}

</script>

<style scoped>
@import url('./loginMain.css');
@import url('../style/appliedButton.css');
@import url('../style/input.css');
</style>
