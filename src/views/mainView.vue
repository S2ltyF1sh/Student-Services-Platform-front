<template>
  <div class="container">
    <div class="header">
      <div class="logo"></div>
      <div class="guideContainer">
        <div class="guide">
          <a
            href="#"
            :class="{active: viewStore.currentView === 'toReport'}"
            @click.prevent="viewStore.changeView('toReport')">
            我要报修
          </a>
          <a
            href="#"
            :class="{active: viewStore.currentView === 'myReport'}"
            @click.prevent="viewStore.changeView('myReport')">
            我的报修
          </a>
        </div>
      </div>
      <div class="userStatus">
        <button @click="turnLogin()" v-if="!loginStore.isLogin">登录</button>
        <button v-if="loginStore.isLogin">欢迎{{ loginStore.userName }}</button>
        <button @click="logout()" v-if="loginStore.isLogin">退出登录</button>
      </div>
    </div>
    <div class="content">
      <div class="mainContainer">
        <div class="mainHeader">{{ headerTitle }}</div>
        <div class="mainBody">
          <UserProfile />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import router from '@/router'
import { useViewStore } from '../stores/mainStore'
import { useLoginStore } from '@/stores/loginStore'
import { apiCall } from '@/components/function/apiCall'
import { ref } from 'vue'
import UserProfile from '@/components/mainContainerViews/selfPage/UserProfile.vue'
const viewStore = useViewStore()
const loginStore = useLoginStore()
const headerTitle = ref('欢迎使用学生服务系统！')

const turnLogin = () =>{
  router.push('/login')
}
const logout = async () => {
  try {
    await apiCall('logout');
    loginStore.changeIsLogin(false);
    loginStore.currentHeader('');
    loginStore.currentUser('');
    loginStore.currentAccount('');
  } catch (error) {
    console.error('退出登录失败:', error);
  }
}
</script>

<style scoped>
@import url('../viewsStyle/mainView.css');
</style>
