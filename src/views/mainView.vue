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
        <button @click="turnLogin()">登录</button>
      </div>
    </div>
    <div class="content">
      <div class="leftAside">
        左侧边栏
      </div>
      <div class="mainContainer">
        主容器
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import router from '@/router'
import { useViewStore } from '../stores/mainStore'
const viewStore = useViewStore()

const turnLogin = () =>{
  router.push('/login')
}
</script>

<style scoped>
@import url('../viewsStyle/mainView.css');
</style>
