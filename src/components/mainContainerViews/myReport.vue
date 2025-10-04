<template>
  <div class="myReportContainer">
    <div class="listHeader">
      <div class="actions">
        <button @click="refresh" :disabled="loading">刷新</button>
      </div>
    </div>
    <div class="listBody">
      <div v-if="!isLogin" class="tips">请先登录查看您的报修记录。</div>
      <div v-else>
        <div v-if="loading" class="loading">加载中...</div>
        <div v-else-if="reports.length === 0" class="empty">暂无报修记录</div>
        <ul v-else class="reportList">
          <li v-for="item in reports" :key="item.reportId" class="reportItem">
            <div class="titleRow">
              <span class="title">{{ item.title || '未命名报修' }}</span>
              <span class="status" :data-status="statusFromReply(item)">{{ statusText(statusFromReply(item)) }}</span>
            </div>
            <div class="metaRow">
              <span>类型：{{ typeText(item.reportType) }}</span>
              <span>创建时间：{{ formatTime(item.postTime) }}</span>
            </div>
            <div v-if="item.content" class="content">{{ item.content }}</div>
            <img
              v-if="item.imageUrl"
              class="thumb"
              :src="item.imageUrl"
              alt="报修图片"
            />
            <img
              v-else
              class="thumb"
              :src="defaultImageUrl"
              alt="默认图片"
            />
            <div v-if="item.reply" class="replyRow">
              <span class="replyLabel">回复：</span>
              <span class="replyContent">{{ item.reply || '暂无回复' }}</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useLoginStore } from '@/stores/loginStore'
import { fetchReports as fetchReportsApi, type ReportItem, typeText, statusText, statusFromReply, formatTime } from '@/components/function/reportFunctions'

const loginStore = useLoginStore()
const isLogin = computed(() => loginStore.isLogin)

const reports = ref<ReportItem[]>([])
const loading = ref(false)
const defaultImageUrl = new URL('@/components/img/illust_115746356_20250921_142946.png', import.meta.url).href

const fetchReports = async () => {
  if (!isLogin.value) {
    reports.value = []
    return
  }
  loading.value = true
  try {
    reports.value = await fetchReportsApi('student')
  } catch {
    reports.value = []
  } finally {
    loading.value = false
  }
}

const refresh = () => {
  fetchReports()
}

onMounted(() => {
  fetchReports()
})
</script>

<style scoped>
@import url('@/viewsStyle/myReport.css');
</style>


