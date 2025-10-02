<template>
  <div class="container">
    <div class="header">
      <div class="logo" @click.prevent="toggleView('myProfile')"></div>
      <div class="guideContainer">
        <div class="guide">
          <a
            href="#"
            :class="{active: viewStore.currentView === 'toReport'}"
            @click.prevent="toggleView('toReport')">
            我要报修
          </a>
          <a
            href="#"
            :class="{active: viewStore.currentView === 'myReport'}"
            @click.prevent="toggleView('myReport')">
            我的报修
          </a>
          <a
            v-if="loginStore.userType === 2 || loginStore.userType === 3"
            href="#"
            :class="{active: viewStore.currentView === 'normalAdmin'}"
            @click.prevent="toggleView('normalAdmin')"
            >
            管理报修
          </a>
          <a
            v-if="loginStore.userType === 3"
            href="#"
            :class="{active: viewStore.currentView === 'superAdmin'}"
            @click.prevent="toggleView('superAdmin')"
            >
            超管Only可视化界面
          </a>
        </div>
      </div>
      <div class="userStatus">
        <button @click="turnLogin()" v-if="!loginStore.isLogin">登录</button>
        <button v-if="loginStore.isLogin" @click.prevent="toggleView('myProfile')">欢迎{{ loginStore.userName }}</button>
        <button @click="logout()" v-if="loginStore.isLogin">退出登录</button>
      </div>
    </div>
    <div class="content">
      <div class="mainContainer">
        <div v-if="viewStore.currentView !== 'superAdmin'" class="mainHeader">{{ headerTitle }}</div>
        <div class="mainBody">
          <transition name="profile-zoom">
            <div v-if="viewStore.currentView === 'myProfile'">
              <UserProfile />
            </div>
          </transition>
          <transition name="profile-zoom">
            <div v-if="viewStore.currentView === 'toReport'">
              <ToReport />
            </div>
          </transition>
          <transition name="profile-zoom">
            <div v-if="viewStore.currentView === 'myReport'">
              <MyReport />
            </div>
          </transition>
          <transition name="profile-zoom">
            <div v-if="viewStore.currentView === 'normalAdmin'">
              <NormalAdminReports />
            </div>
          </transition>
          <transition name="profile-zoom">
            <div v-if="viewStore.currentView === 'superAdmin'">
              <SuperAdmin />
            </div>
          </transition>
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
import { computed } from 'vue'
import UserProfile from '@/components/mainContainerViews/userProfile.vue'
import ToReport from '@/components/mainContainerViews/toReport.vue'
import MyReport from '@/components/mainContainerViews/myReport.vue'
import NormalAdminReports from '@/components/mainContainerViews/normalAdminReports.vue'
import SuperAdmin from '@/components/mainContainerViews/superAdmin.vue'
const viewStore = useViewStore()
const loginStore = useLoginStore()
const headerTitle = computed(() => {
  switch (viewStore.currentView) {
    case 'toReport':
      return '我要报修'
    case 'myReport':
      return '我的报修'
    case 'normalAdmin':
      return '普通管理员'
    case 'myProfile':
      return '个人中心'
    default:
      return '欢迎使用学生服务系统！'
  }
})

const toggleView = (target: string) => {
  viewStore.currentView = viewStore.currentView === target ? '' : target
}

const turnLogin = () =>{
  router.push('/login')
}
const logout = async () => {
  try {
    await apiCall('logout');
    loginStore.isLogin = false;
    loginStore.header = '';
    loginStore.userName = '';
    loginStore.accountName = '';
  } catch (error) {
    console.error('退出登录失败:', error);
  }
}
</script>

<style scoped>
@import url('../viewsStyle/mainView.css');
</style>
