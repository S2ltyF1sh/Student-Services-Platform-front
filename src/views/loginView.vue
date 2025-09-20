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
          <span class="lableInput"><p>图片上传：</p><input type="file" @change="handleFileSelect" accept="image/*"></span>
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
const selectedFile = ref<File | null>(null);

const handleFileSelect = (event: Event) => {
  if (!(event.target instanceof HTMLInputElement)) {
    return;
  }

  if (!event.target.files || event.target.files.length === 0) {
    return;
  }

  selectedFile.value = event.target.files[0];
};

const login = async () => {
  const formData = new FormData();

  formData.append('accountName', "1");
  formData.append('password', "12345678");
  formData.append('title', "1");
  formData.append('postType', "1");
  formData.append('isArgent', "true");
  formData.append('isAnonymity', "false");
  formData.append('isArgent', "55");

  if (selectedFile.value) {
    formData.append('image', selectedFile.value);
  } else {
    try {
      const response = await fetch('/src/components/img/b_194d524861bc60ea62da2963ffc88d58.jpg');
      const blob = await response.blob();
      formData.append('image', blob, 'b_194d524861bc60ea62da2963ffc88d58.jpg');
    } catch (error) {
      console.error('无法加载图片:', error);
    }
  }
  // const body = {
  //   accountName: "1",
  //   password: "123456789",
  //   title: "1",
  //   postType: "1",

  // }

  apiCall(
    'post',
    formData,
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
@import url('../style/appliedButton.css');
@import url('../style/input.css');
</style>
