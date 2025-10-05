<template>
  <div class="normalAdminReportsContainer">
    <div class="listHeader">
      <div class="actions">
        <button @click="refresh" :disabled="loading">刷新</button>
        <span class="pager">
          <button @click="prevPage" :disabled="loading || pageNum <= 1">上一页</button>
          <span class="pageNo">第 {{ pageNum }} 页</span>
          <button @click="nextPage" :disabled="loading">下一页</button>
        </span>
      </div>
    </div>
    <div class="categoryFilter">
      <button
        :class="{ active: activeCategory === 'all' }"
        @click="switchCategory('all')"
      >
        全部类型
      </button>
      <button
        :class="{ active: activeCategory === '1' }"
        @click="switchCategory('1')"
      >
        宿舍设施
      </button>
      <button
        :class="{ active: activeCategory === '2' }"
        @click="switchCategory('2')"
      >
        教学设备
      </button>
      <button
        :class="{ active: activeCategory === '3' }"
        @click="switchCategory('3')"
      >
        公共区域
      </button>
      <button
        :class="{ active: activeCategory === '4' }"
        @click="switchCategory('4')"
      >
        网络与软件
      </button>
      <button
        :class="{ active: activeCategory === '5' }"
        @click="switchCategory('5')"
      >
        其他
      </button>
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
      <div v-if="showReplyDialog" class="reply-dialog-overlay" @click="handleOverlayClick">
      <div class="reply-dialog">
        <h3 class="dialog-title">选择回复内容</h3>
        <div class="preset-replies">
          <button
            v-for="(reply, index) in presetReplies"
            :key="index"
            type="button"
            class="preset-reply-btn"
            @click="handlePresetSelect(reply)"
          >
            {{ reply }}
          </button>
        </div>

        <textarea
          v-model="customContent"
          class="custom-reply-input"
          placeholder="或输入自定义回复..."
          @keydown.ctrl.enter="handleConfirm"
          @keydown.meta.enter="handleConfirm"
        ></textarea>

        <div class="dialog-actions">
          <button type="button" class="cancel-btn" @click="handleCancel">取消</button>
          <button type="button" class="confirm-btn" @click="handleConfirm" :disabled="!hasContent">
            发送
          </button>
        </div>
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

const reports = ref<ReportItem[]>([])
const acceptedReports = ref<ReportItem[]>([])
const loading = ref(false)
const defaultImageUrl = new URL('@/components/img/illust_115746356_20250921_142946.png', import.meta.url).href
const activeTab = ref<'all' | 'accepted'>('all')
const activeCategory = ref<'all' | '1' | '2' | '3' | '4' | '5'>('all')

const currentList = computed(() => {
  const baseList = activeTab.value === 'all' ? reports.value : acceptedReports.value

  if (activeCategory.value === 'all') {
    return baseList
  }

  return baseList.filter(item => String(item.reportType) === activeCategory.value)
})
const pageNum = ref(1)
const showReplyDialog = ref(false)
const hasContent = computed(() => customContent.value.trim().length > 0)
const customContent = ref('')
const currentReportId = ref<number|string>('')
const presetReplies = ref([
  "收到，我们会尽快处理",
  "感谢您的反馈",
  "问题已记录，正在排查中",
  "请提供更多详细信息",
  "这个问题已经修复"
])

const getId = (item: ReportItem): ReportIdLike => {
  return item.reportId as ReportIdLike
}

const fetchAllReports = async () => {
  loading.value = true
  try {
    reports.value = await fetchReportsApi('all', pageNum.value)
  } catch {

    reports.value = []
  } finally {
    loading.value = false
  }
}

const fetchAcceptedReports = async () => {
  loading.value = true
  try {
    acceptedReports.value = await fetchReportsApi('accepted', pageNum.value)
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
  pageNum.value = 1
  refresh()
}

const switchCategory = (category: 'all' | '1' | '2' | '3' | '4' | '5') => {
  activeCategory.value = category
}

const prevPage = () => {
  if (pageNum.value > 1) {
    pageNum.value -= 1
    refresh()
  }
}

const nextPage = () => {
  pageNum.value += 1
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

  currentReportId.value = reportId
  showReplyDialog.value = true
  customContent.value = ''

}

const handlePresetSelect = (content: string) => {
  sendReply(content)
}

const handleConfirm = async () => {
  const content = customContent.value.trim()
  if (content) {
    await sendReply(content)
  }
}

const handleCancel = () => {
  showReplyDialog.value = false
  customContent.value = ''
}

const handleOverlayClick = (event: MouseEvent) => {
  if (event.target === event.currentTarget) {
    handleCancel()
  }
}

const sendReply = async (content: string) => {
  if (!currentReportId.value) return

  try {
    await apiCall('replyPost', {
      reportId: currentReportId.value,
      reply: content
    } as Record<string, unknown>)
    refresh()
    showReplyDialog.value = false
    customContent.value = ''
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
