<template>
  <div class="profileContainer">
    <div class="profileHeader">个人信息</div>
    <div class="profileBody">
      <div class="avatarBlock">
        <div class="avatar" :style="{ backgroundImage: `url(${avatarUrl})` }"></div>
        <div v-if="editMode" class="filePicker">
          <input id="avatar-input" type="file" accept="image/*" @change="onSelectAvatar" />
          <label for="avatar-input">选择头像（暂不上传）</label>
        </div>
      </div>
      <div class="infoBlock">
        <div class="info">
          <label>用户名：</label>
          <span v-if="!editMode">{{ form.userName || '未设置' }}</span>
          <input v-else v-model="form.userName" placeholder="请输入用户名" />
        </div>
        <div class="info">
          <label>账号：</label>
          <span>{{ accountName || '未设置' }}</span>
        </div>
        <div class="info">
          <label>邮箱：</label>
          <span v-if="!editMode">{{ form.email || '未更改' }}</span>
          <input v-else v-model="form.email" placeholder="请输入邮箱" />
        </div>
        <div class="info" v-if="editMode">
          <label>密码：</label>
          <input v-model="form.password" type="password" placeholder="请输入密码" />
        </div>

        <div class="actions">
          <button v-if="!editMode" @click="startEdit" :disabled="!isLogin">编辑</button>
          <template v-else>
            <button class="primary" @click="save">保存</button>
            <button @click="cancel">取消</button>
          </template>
        </div>
        <div v-if="!isLogin" class="tips">请先登录后再编辑个人信息。</div>
      </div>
    </div>
  </div>

</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useLoginStore } from '@/stores/loginStore'
import { apiCall } from '@/components/function/apiCall'

const loginStore = useLoginStore()
const isLogin = computed(() => loginStore.isLogin)
const accountName = computed(() => loginStore.accountName)

const editMode = ref(false)
const avatarUrl = ref<string>(new URL('@/components/img/b_194d524861bc60ea62da2963ffc88d58.jpg', import.meta.url).href)

const form = reactive({
  userName: loginStore.userName,
  email: '',
  password: ''
})

const startEdit = () => {
  editMode.value = true
}

const save = async () => {
  try {
    await apiCall('edit', {
      accountName: accountName.value,
      password: form.password,
      email: form.email
    })
    loginStore.userName = form.userName
    editMode.value = false
    form.password = ''
  } catch {
    console.log('Edit profile failed')
  }
}

const cancel = () => {
  form.userName = loginStore.userName
  form.password = ''
  editMode.value = false
}

const onSelectAvatar = (e: Event) => {
  const input = e.target as HTMLInputElement
  if (!input.files || input.files.length === 0) return
  const file = input.files[0]
  const reader = new FileReader()
  reader.onload = () => {
    avatarUrl.value = String(reader.result || '')
  }
  reader.readAsDataURL(file)
}
</script>

<style scoped>
@import url('@/viewsStyle/userProfile.css');
</style>


