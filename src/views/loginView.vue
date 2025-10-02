<template>
  <!-- 登录界面 -->
  <div class="loginMain">
    <div class="Container">
      <header>
        <h1>欢迎使用SSP</h1>
      </header>
      <div class="SContainer">
        <div class="img"></div>

        <div class="sliderContainer">
          <div class="slider" :class="loginState">

            <!-- 登录详细块 -->
            <div class="slide loginSlide">
              <div class="inputContainer">
                <div class="inputInfo">
                  <span class="lableInput"><p>账户名：</p><input type="text" v-model="UserInfo.accountName"></span>
                  <span class="lableInput"><p>密码：</p><input type="password" v-model="UserInfo.password"></span>
                </div>
              </div>
            </div>

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
import router from '@/router';
import { useLoginStore } from '@/stores/loginStore';
import { computed, ref } from 'vue';

const loginStore = useLoginStore();
const loginState = ref('login')

const UserInfo =ref({
    username: '',
    accountName: '',
    password: '',
    type: 0,
    email: ''
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
      username: UserInfo.value.username,
      accountName: UserInfo.value.accountName,
      password: UserInfo.value.password,
      userType: Number(UserInfo.value.type),
      email: UserInfo.value.email
  }

  try {
    const response = await apiCall('regist', body);
    if (response.data) {loginState.value = 'login'
    }
  } catch (error) {
    console.error('注册失败:', error);
  }
};

const login = async () => {
  const body = {
    accountName: UserInfo.value.accountName,
    password: UserInfo.value.password,
  };

  try {
    const response = await apiCall('login', body);
    if (response.data) {
      const header = response.data.token;
      const username = response.data.username
      const userType = Number(response.data.userType ?? response.data.type ?? 0)

      loginStore.userName = username
      loginStore.header = header
      loginStore.isLogin = true
      loginStore.accountName = UserInfo.value.accountName
      loginStore.userType = userType
      setTimeout(() => {
        router.push('/')
      }, 1500)
    }
  } catch (error) {
    console.error('登录失败:', error);
  }
};
</script>

<style scoped>
@import url('../viewsStyle/loginView.css');
</style>
