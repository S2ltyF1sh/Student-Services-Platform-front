<template>
  <div class="normalAdminReportsContainer">
    <div class="listHeader">
      <div class="actions">
        <button @click="refresh" :disabled="loading">刷新</button>
      </div>
    </div>
    <div class="bodyContainer">
      <aside class="sideBar">
        <button :class="{ active: activeTab === 'all' }" @click="switchTab('all')">全部报修</button>
        <button :class="{ active: activeTab === 'accepted' }" @click="switchTab('accepted')">已接单</button>
      </aside>
      <div class="listBody">
        <div v-if="loading" class="loading">加载中...</div>
        <div v-else-if="currentList.length === 0" class="empty">暂无报修记录</div>
        <ul v-else class="reportList">
        <li v-for="item in currentList" :key="getId(item)" class="reportItem">
          <div class="titleRow">
            <span class="title">{{ item.title || '未命名报修' }}</span>
            <span class="status" :data-status="statusFromReply(item)">{{ statusText(statusFromReply(item)) }}</span>
          </div>
          <div class="metaRow">
            <span>上报人：{{ item.accountName || '-' }}</span>
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
            <span class="replyContent">{{ item.reply }}</span>
          </div>
          <div class="adminActions">
            <button @click="markSpam(item, 1)" title="标记为垃圾">标记垃圾</button>
            <button v-if="!isAccepted(item)" @click="accept(item)" title="接单">接单</button>
            <button v-else @click="cancel(item)" title="撤销接单">撤销接单</button>
            <button v-if="isAccepted(item)" @click="reply(item)" title="回复">回复</button>
          </div>
        </li>
      </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { apiCall } from '@/components/function/apiCall'
import { fetchReports as fetchReportsApi, type ReportItem as SharedReportItem, typeText, statusText, statusFromReply, formatTime } from '@/components/function/reportFunctions'

interface ReportItem extends SharedReportItem {
  reportId?: number;
  accountName?: string;
  title?: string;
  content?: string;
  imageUrl?: string;
  reportType?: number | string;
  reply?: string | null;
  postTime?: string | number | Date;
}

type ReportIdLike = number | string | undefined

const getId = (item: ReportItem): ReportIdLike => {
  return item.reportId as ReportIdLike
}

const reports = ref<ReportItem[]>([])
const acceptedReports = ref<ReportItem[]>([])
const loading = ref(false)
const defaultImageUrl = new URL('@/components/img/illust_115746356_20250921_142946.png', import.meta.url).href
const activeTab = ref<'all' | 'accepted'>('all')
const currentList = computed(() => activeTab.value === 'all' ? reports.value : acceptedReports.value)

const fetchAllReports = async () => {
  loading.value = true
  try {
    reports.value = await fetchReportsApi('all')
  } catch {

    reports.value = []
  } finally {
    loading.value = false
  }
}

const fetchAcceptedReports = async () => {
  loading.value = true
  try {
    acceptedReports.value = await fetchReportsApi('accepted')
  } catch {
    acceptedReports.value = []
  } finally {
    loading.value = false
  }
}

const refresh = () => {
  if (activeTab.value === 'all') fetchAllReports(); else fetchAcceptedReports();
}

const switchTab = (tab: 'all' | 'accepted') => {
  activeTab.value = tab
  refresh()
}

const markSpam = async (item: ReportItem, level: 1 | 2) => {
  try {
    const reportId = getId(item)
    if (!reportId) return
    await apiCall('markPost', { reportId, spam: level } as Record<string, unknown>)
    refresh()
  } catch {
  }
}

const accept = async (item: ReportItem) => {
  try {
    const reportId = getId(item)
    if (!reportId) return
    await apiCall('acceptPost', { reportId } as Record<string, unknown>)
    refresh()
  } catch {
  }
}

const cancel = async (item: ReportItem) => {
  try {
    const reportId = getId(item)
    if (!reportId) return
    await apiCall('cancelAccept', { reportId } as Record<string, unknown>)
    refresh()
  } catch {
  }
}

const isAccepted = (item: ReportItem) => {
  const id = getId(item)
  return acceptedReports.value.some(r => getId(r) === id)
}

const reply = async (item: ReportItem) => {
  const reportId = getId(item)
  if (!reportId) return
  const text = window.prompt('请输入回复内容：', '')
  if (text === null) return
  const content = String(text).trim()
  if (!content) return
  try {
    await apiCall('replyPost', { reportId, reply: content } as Record<string, unknown>)
    refresh()
  } catch {
  }
}

onMounted(() => {
  fetchAllReports()
  fetchAcceptedReports()
})
</script>

<style scoped>
@import url('@/viewsStyle/normalAdminReports.css');
</style>
