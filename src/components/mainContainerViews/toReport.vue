<template>
  <div class="toReportContainer">
    <div class="cardHeader"></div>
    <form class="form" @submit.prevent="onSubmit">
      <div class="formRow">
        <label>标题</label>
        <input v-model.trim="form.title" type="text" placeholder="请输入报修标题" required />
      </div>

      <div class="formRow">
        <label>类型</label>
        <select v-model="form.reportType" required>
          <option disabled value="">请选择类型</option>
          <option value="1">宿舍设施</option>
          <option value="2">教学设备</option>
          <option value="3">公共区域</option>
          <option value="4">网络与软件</option>
          <option value="5">其他</option>
        </select>
      </div>

      <div class="formRow">
        <label>紧急程度</label>
        <div class="inline">
          <label class="checkbox">
            <input type="checkbox" v-model="form.isUrgent" /> 紧急
          </label>
        </div>
      </div>

      <div class="formRow">
        <label>匿名提交</label>
        <div class="inline">
          <label class="checkbox">
            <input type="checkbox" v-model="form.isAnonymity" /> 匿名
          </label>
        </div>
      </div>

      <div class="formRow">
        <label>详细描述</label>
        <textarea v-model.trim="form.content" rows="5" placeholder="请描述问题、位置、时间等信息" />
      </div>

      <div class="formRow">
        <label>图片</label>
        <input type="file" accept="image/*" @change="onSelectImage" />
        <div v-if="previewUrl" class="preview" :style="{ backgroundImage: `url(${previewUrl})` }"></div>
      </div>

      <div class="actions">
        <button class="primary" type="submit" :disabled="submitting || !canSubmit">提交</button>
        <button type="button" @click="onReset" :disabled="submitting">重置</button>
      </div>

      <div v-if="!isLogin" class="tips">请先登录后再提交报修。</div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import { useLoginStore } from '@/stores/loginStore'
import { apiCall } from '@/components/function/apiCall'

const loginStore = useLoginStore()
const isLogin = computed(() => loginStore.isLogin)

const form = reactive({
  title: '',
  reportType: '' as '' | '1' | '2' | '3' | '4' | '5',
  isUrgent: false,
  isAnonymity: false,
  content: ''
})

const selectedFile = ref<File | null>(null)
const previewUrl = ref<string>('')
const submitting = ref(false)

const canSubmit = computed(() => {
  return isLogin.value && !!form.title && !!form.reportType
})

const onSelectImage = (e: Event) => {
  const input = e.target as HTMLInputElement
  if (!input.files || input.files.length === 0) {
    selectedFile.value = null
    previewUrl.value = ''
    return
  }
  selectedFile.value = input.files[0]
  const reader = new FileReader()
  reader.onload = () => {
    previewUrl.value = String(reader.result || '')
  }
  reader.readAsDataURL(selectedFile.value)
}

const onReset = () => {
  form.title = ''
  form.reportType = ''
  form.isUrgent = false
  form.isAnonymity = false
  form.content = ''
  selectedFile.value = null
  previewUrl.value = ''
}

const onSubmit = async () => {
  if (!canSubmit.value || submitting.value) return
  submitting.value = true
  try {
    const data = new FormData()
    data.append('title', form.title)
    data.append('reportType', form.reportType)
    data.append('isUrgent', String(form.isUrgent))
    data.append('isAnonymity', String(form.isAnonymity))
    if (form.content) data.append('content', form.content)
    if (selectedFile.value) { data.append('image', selectedFile.value) }

    await apiCall('report', data)
    onReset()
    alert('提交成功')
  } catch {
    console.log('Report submission failed')
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
@import url('@/viewsStyle/toReport.css');
</style>


