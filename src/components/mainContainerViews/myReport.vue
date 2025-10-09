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
            <div v-if="item.comment" class="commentRow">
              <span class="commentLabel">我的评价：</span>
              <span class="commentContent">{{ item.comment }}</span>
            </div>
            <div v-else class="commentBtn">
              <button class="commentButton" @click="comment(item)">评价</button>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
  <div v-if="showCommentDialog" class="commentDialogOverlay" >
    <div class="commentDialog">
      <h3 class="dialogTitle">选择回复内容</h3>
      <textarea
        v-model="customContent"
        class="customCommentInput"
        placeholder="输入评价..."
      ></textarea>

      <div class="dialogActions">
        <button type="button" class="cancelBtn" @click="handleCancel">取消</button>
        <button type="button" class="confirmBtn" @click="handleConfirm" :disabled="!hasContent">
          发送
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useLoginStore } from '@/stores/loginStore'
import { fetchReports as fetchReportsApi, type ReportItem, typeText, statusText, statusFromReply, formatTime } from '@/components/function/reportFunctions'
import { apiCall } from '@/components/function/apiCall'

const loginStore = useLoginStore()
const isLogin = computed(() => loginStore.isLogin)

const hasContent = computed(() => customContent.value.trim().length > 0)
const currentReportId = ref<number|string>('')
const showCommentDialog = ref(false)
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

const handleConfirm = async () => {
  const content = customContent.value.trim()
  const reportId = currentReportId.value
  if (!content || !reportId) return

  try {
    await apiCall('studentComment', { reportId: Number(reportId), comment: content } as Record<string, unknown>)
    showCommentDialog.value = false
    customContent.value = ''
    currentReportId.value = ''
    await fetchReports()
  } catch {
  }
}

const handleCancel = () => {
  showCommentDialog.value = false
  customContent.value = ''
  currentReportId.value = ''
}

const customContent = ref('')

const comment = async(item:ReportItem) => {
  const reportId = item.reportId
  if (!reportId) return

  currentReportId.value = reportId
  showCommentDialog.value = true
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


