<template>
  <!-- 登录界面 -->
  <div class="loginMain">

    <div class="Container">
      <header>
        <h1>欢迎使用SSP</h1>
      </header>
      <!-- 登录详细块 -->
      <div class="loginContainer" v-if="loginState === 'login'">
        <div class="loginInfo">
          <span class="lableInput"><p>用户名：</p><input type="text" v-model="UserInfo.username"></span>
          <span class="lableInput"><p>账户名：</p><input type="text" v-model="UserInfo.accountName"></span>
          <span class="lableInput"><p>密码：</p><input type="text" v-model="UserInfo.password"></span>
          <span class="lableInput"><p>账户类型：</p><input type="radio" v-model="UserInfo.type"><input type="radio" v-model="UserInfo.type"></span>
          <span class="lableInput"><p>账户邮箱：</p><input type="text" v-model="UserInfo.email"></span>
        </div>
      </div>
      <!-- 注册详细块 -->
      <div class="registContainer" v-else>
        注册详细块
      </div>
      <!-- 功能按钮 -->
      <div class="functionButton">
        <button class="bigButton" @click="toggleState()">{{ toggleButtonContext }}</button>
        <button class="bigButton" @click="login()">{{ functionButtonContext }}</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { apiCall } from '@/components/function/apiCall';
import { computed, ref } from 'vue';

const loginState = ref('login')
const UserInfo =ref({
    username: "ggbond",
    accountName: "1234",
    password: "12345678",
    type: 1,
    email: "2974651270@qq.com"
})

const toggleButtonContext = computed(() => {
  switch(loginState.value){
    case 'login': return '切换为注册'
    case 'regist': return '切换为登录'
    default: return ''
  }
})
const functionButtonContext = computed(() => {
  switch(loginState.value){
    case 'login': return '登录'
    case 'regist': return '注册'
    default: return ''
  }
})

const toggleState = () => {loginState.value = loginState.value === 'login' ? 'regist' : 'login'}
const login = () => {
  const body = {
    accountName: "1",
    password: "12345678"
  }
  apiCall('login',body,)
}

</script>

<style scoped>
@import url('../viewsStyle/loginView.css');
@import url('../style/appliedButton.css');
@import url('../style/input.css');
</style>
