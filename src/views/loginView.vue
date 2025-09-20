<template>
  <!-- 登录界面 -->
  <div class="loginMain">
    <div class="Container">
      <header>
        <h1>欢迎使用SSP</h1>
      </header>

      <div class="sliderContainer">
        <div class="slider" :class="loginState">
          <!-- 注册详细块 -->
          <div class="slide registSlide">
            <div class="inputContainer">
              <div class="inputInfo">
                <span class="lableInput"><p>用户名：</p><input type="text" v-model="UserInfo.username"></span>
                <span class="lableInput"><p>账户名：</p><input type="text" v-model="UserInfo.accountName"></span>
                <span class="lableInput"><p>密码：</p><input type="password" v-model="UserInfo.password"></span>
                <span class="lableInput"><p>账户类型：</p>
                  <div class="radios">
                    <label><input type="radio" value="1" v-model="UserInfo.type"> 普通用户</label>
                    <label><input type="radio" value="2" v-model="UserInfo.type"> 管理员</label>
                    <label><input type="radio" value="3" v-model="UserInfo.type"> 超级管理员</label>
                  </div>
                </span>
                <span class="lableInput"><p>账户邮箱：</p><input type="email" v-model="UserInfo.email"></span>
              </div>
            </div>
          </div>

          <!-- 登录详细块 -->
          <div class="slide loginSlide">
            <div class="inputContainer">
              <div class="inputInfo">
                <span class="lableInput"><p>账户名：</p><input type="text" v-model="UserInfo.accountName"></span>
                <span class="lableInput"><p>密码：</p><input type="password" v-model="UserInfo.password"></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 功能按钮 -->
      <div class="functionButtons">
        <button class="functionButton" @click="toggleState()">{{ toggleButtonContext }}</button>
        <button class="functionButton" @click="login()" v-if="loginState === 'login'">{{ functionButtonContext }}</button>
        <button class="functionButton" @click="regist()" v-else>{{ functionButtonContext }}</button>
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

const regist = async () => {

  const body ={
      username: "ggbond",
      accountName: "1",
      password: "12345678",
      type: 1,
      email: "2974651270@qq.com"
  }

  apiCall(
    'regist',
    body,
    undefined,
    {
      headers: {
        'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwcml2YXRlX21lc3NhZ2UiOnsiYWNjb3VudE5hbWUiOiIxIiwidXNlcklkIjo0fSwiZXhwIjoxNzU4Mzc5NDM4fQ.sKnVJMrx9HgjXrdvJI4UR4byrER75oa7nY-5x0GahHg'
      }
    }
  );
};

const login = async () => {

  const body = {
    accountName: "1",
    password: "123456789",
  }

  apiCall(
    'login',
    body,
    undefined,
    {
      headers: {
        'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwcml2YXRlX21lc3NhZ2UiOnsiYWNjb3VudE5hbWUiOiIxIiwidXNlcklkIjo0fSwiZXhwIjoxNzU4Mzc5NDM4fQ.sKnVJMrx9HgjXrdvJI4UR4byrER75oa7nY-5x0GahHg'
      }
    }
  );
};
</script>

<style scoped>
@import url('../viewsStyle/loginView.css');
</style>
