<template>
  <div class="dashboardContainer">
    <!-- 头部标题 -->
    <div class="dashboardHeader">
      <h1>超级管理员控制台</h1>
      <div class="headerActions">
        <button @click="refreshAllData" :disabled="loading" class="refreshBtn">
          {{ loading ? '刷新中...' : '刷新数据' }}
        </button>
      </div>
    </div>
    <div class="dashboardContent">
      <!-- 左侧边栏 - 反馈统计 -->
      <div class="leftSidebar">
        <div class="sidebarSection">
          <h3>反馈统计</h3>
          <div class="chartContainer largeChart">
            <h4>类型分布</h4>
            <v-chart class="chart" :option="typeChartOption" />
          </div>
          <div class="chartContainer largeChart">
            <h4>紧急分布</h4>
            <v-chart class="chart" :option="urgentChartOption" />
          </div>
          <div class="feedbackList">
            <h4>最新反馈</h4>
            <div v-if="feedbacks.length === 0" class="empty">暂无反馈数据</div>
            <div v-else class="feedbackItems">
              <div v-for="feedback in feedbacks.slice(0, 5)" :key="feedback.id" class="feedbackItem">
                <div class="feedbackTitle">{{ feedback.title }}</div>
                <div class="feedbackMeta">{{ feedback.type }} | {{ feedback.area }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 主要区域 - 用户管理 -->
      <div class="mainArea">
        <div class="mainSection">
          <div class="sectionHeader">
            <h3>用户管理</h3>
            <div class="actionButtons">
              <button @click="showAddUserModal = true" class="addBtn">添加用户</button>
              <button @click="showSearchModal = true" class="searchBtn">查询用户</button>
            </div>
          </div>

          <!-- 用户列表 -->
          <div class="userManagement">
            <div v-if="users.length === 0" class="empty">暂无用户数据</div>
            <div v-else class="userTable">
              <div class="tableHeader">
                <div class="headerCell">用户ID</div>
                <div class="headerCell">账户名</div>
                <div class="headerCell">用户名</div>
                <div class="headerCell">邮箱</div>
                <div class="headerCell">用户类型</div>
                <div class="headerCell">操作</div>
              </div>
              <div class="tableBody">
                <div v-for="user in users" :key="user.userId" class="userRow">
                  <div class="cell">{{ user.userId }}</div>
                  <div class="cell">{{ user.accountName || '-' }}</div>
                  <div class="cell">{{ user.username || '-' }}</div>
                  <div class="cell">{{ user.email || '-' }}</div>
                  <div class="cell">{{ getUserTypeText(user.userType) }}</div>
                  <div class="cell actionCell">
                    <button @click="editUser(user)" class="editBtn">编辑</button>
                    <button
                      v-if="user.userType !== 3"
                      @click="deleteUser(user)"
                      class="deleteBtn"
                    >
                      删除
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧边栏 - 标记管理 -->
      <div class="rightSidebar">
        <div class="sidebarSection">
          <h3>标记管理</h3>
          <div class="markList">
            <div v-if="marks.length === 0" class="empty">暂无标记数据</div>
            <div v-else class="markItems">
              <div v-for="mark in marks" :key="mark.reportId" class="markItem">
                <div class="markHeader">
                  <div class="markTitle">{{ mark.title }}</div>
                  <button @click="showMarkDetails(mark)" class="detailBtn">详情</button>
                </div>
                <div class="markMeta">
                  <span>类型：{{ mark.reportType }}</span>
                  <span v-if="mark.accountName">上报人：{{ mark.accountName }}</span>
                </div>
                <div class="markActions">
                  <button @click="reviewMark(mark, 'approve')" class="approveBtn">取消标记</button>
                  <button @click="reviewMark(mark, 'reject')" class="rejectBtn">设为垃圾</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 添加用户模态框 -->
    <div v-if="showAddUserModal" class="modal" @click.self="showAddUserModal = false">
      <div class="modalContent">
        <h3>添加用户</h3>
        <form @submit.prevent="addUser">
          <div class="formGroup">
            <label>账户名:</label>
            <input v-model="newUser.accountName" type="text" required>
          </div>
          <div class="formGroup">
            <label>用户名:</label>
            <input v-model="newUser.username" type="text" required>
          </div>
          <div class="formGroup">
            <label>邮箱:</label>
            <input v-model="newUser.email" type="email" required>
          </div>
          <div class="formGroup">
            <label>密码:</label>
            <input v-model="newUser.password" type="password" required>
          </div>
          <div class="formGroup">
            <label>用户类型:</label>
            <select v-model="newUser.userType" required>
              <option value="1">学生</option>
              <option value="2">普通管理员</option>
            </select>
          </div>
          <div class="modalActions">
            <button type="submit" class="confirmBtn">添加</button>
            <button type="button" @click="showAddUserModal = false" class="cancelBtn">取消</button>
          </div>
        </form>
      </div>
    </div>

    <!-- 编辑用户模态框 -->
    <div v-if="showEditUserModal" class="modal" @click.self="showEditUserModal = false">
      <div class="modalContent">
        <h3>编辑用户</h3>
        <form @submit.prevent="updateUser">
          <div class="formGroup">
            <label>账户名:</label>
            <input v-model="editingUser.accountName" type="text" readonly>
          </div>
          <div class="formGroup">
            <label>用户名:</label>
            <input v-model="editingUser.username" type="text">
          </div>
          <div class="formGroup">
            <label>邮箱:</label>
            <input v-model="editingUser.email" type="email">
          </div>
          <div class="formGroup">
            <label>密码:</label>
            <input v-model="editingUser.password" type="password" placeholder="留空则不修改">
          </div>
          <div class="formGroup" v-if="editingUser.userType !== 3">
            <label>用户类型:</label>
            <select v-model="editingUser.userType">
              <option value="1">学生</option>
              <option value="2">普通管理员</option>
            </select>
          </div>
          <div class="modalActions">
            <button type="submit" class="confirmBtn">更新</button>
            <button type="button" @click="showEditUserModal = false" class="cancelBtn">取消</button>
          </div>
        </form>
      </div>
    </div>

    <!-- 查询用户模态框 -->
    <div v-if="showSearchModal" class="modal" @click.self="showSearchModal = false">
      <div class="modalContent">
        <h3>查询用户</h3>
        <form @submit.prevent="searchUser">
          <div class="formGroup">
            <label>账户名:</label>
            <input v-model="searchAccountName" type="text" required>
          </div>
          <div class="modalActions">
            <button type="submit" class="confirmBtn">查询</button>
            <button type="button" @click="showSearchModal = false" class="cancelBtn">取消</button>
          </div>
        </form>
        <div v-if="searchResult" class="searchResult">
          <h4>查询结果:</h4>
          <div class="userInfo">
            <p>用户ID: {{ searchResult.userId }}</p>
            <p>账户名: {{ searchResult.accountName }}</p>
            <p>用户名: {{ searchResult.username }}</p>
            <p>邮箱: {{ searchResult.email }}</p>
            <p>用户类型: {{ getUserTypeText(searchResult.userType) }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 标记详情模态框 -->
    <div v-if="showMarkDetailModal" class="modal" @click.self="showMarkDetailModal = false">
      <div class="modalContent">
        <h3>标记详情</h3>
        <div v-if="selectedMark" class="markDetailInfo">
          <div class="detailGroup">
            <label>报告ID:</label>
            <span>{{ selectedMark.reportId }}</span>
          </div>
          <div class="detailGroup">
            <label>标题:</label>
            <span>{{ selectedMark.title || '未命名' }}</span>
          </div>
          <div class="detailGroup">
            <label>类型:</label>
            <span>{{ selectedMark.reportType || '未知' }}</span>
          </div>
          <div class="detailGroup">
            <label>回复:</label>
            <span>{{ selectedMark.reply || '未知' }}</span>
          </div>
          <div v-if="selectedMark.accountName" class="detailGroup">
            <label>上报人:</label>
            <span>{{ selectedMark.accountName }}</span>
          </div>
          <div v-if="selectedMark.postTime" class="detailGroup">
            <label>上报时间:</label>
            <span>{{ formatTime(selectedMark.postTime) }}</span>
          </div>
          <div v-if="selectedMark.content" class="detailGroup">
            <label>内容:</label>
            <div class="contentText">{{ selectedMark.content }}</div>
          </div>
        </div>
        <div class="modalActions">
          <button @click="showMarkDetailModal = false" class="cancelBtn">关闭</button>
          <button v-if="selectedMark" @click="reviewMark(selectedMark, 'approve')" class="confirmBtn">取消标记</button>
          <button v-if="selectedMark" @click="reviewMark(selectedMark, 'reject')" class="deleteBtn">设为垃圾</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart, PieChart } from 'echarts/charts'
import { TitleComponent, TooltipComponent, LegendComponent, GridComponent } from 'echarts/components'
import VChart from 'vue-echarts'
import { apiCall } from '@/components/function/apiCall'

use([
  CanvasRenderer,
  BarChart,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
])

interface User {
  userId: number;
  accountName: string;
  username: string;
  email: string;
  userType: number;
  password?: string;
}

interface Feedback {
  id: number;
  title: string;
  type: string;
  area: string;
  content?: string;
}

interface Mark {
  id?: number;
  reportId: number;
  title: string;
  reportType: string;
  content?: string;
  accountName?: string;
  postTime?: string;
  reply?: string
}

interface ReportItem {
  reportId?: number;
  id?: number;
  title?: string;
  reportType?: number;
  isUrgent?: number;
  [key: string]: unknown;
}

interface ModifyUserData {
  operationType: number;
  accountName: string;
  username?: string;
  email?: string;
  password?: string;
  userType?: number;
  [key: string]: unknown;
}

interface BarSeriesParams {
  dataIndex: number;
  seriesIndex: number;
  seriesName: string;
  name: string;
  value: number | number[];
  [key: string]: unknown;
}

const loading = ref(false)
const users = ref<User[]>([])
const feedbacks = ref<Feedback[]>([])
const marks = ref<Mark[]>([])
const showAddUserModal = ref(false)
const showEditUserModal = ref(false)
const showSearchModal = ref(false)
const showMarkDetailModal = ref(false)

const newUser = ref<User>({
  userId: 0,
  accountName: '',
  username: '',
  email: '',
  userType: 1,
  password: ''
})

const editingUser = ref<User>({
  userId: 0,
  accountName: '',
  username: '',
  email: '',
  userType: 1,
  password: ''
})

const searchAccountName = ref('')
const searchResult = ref<User | null>(null)
const selectedMark = ref<Mark | null>(null)

const urgentStats = ref({
  urgent: 0,
  normal: 0
})

const typeStats = ref({
  dormitory: 0,
  teaching: 0,
  public: 0,
  network: 0,
  other: 0
})

// 工具函数
const getUserTypeText = (type: number): string => {
  switch (type) {
    case 1: return '学生'
    case 2: return '普通管理员'
    case 3: return '超级管理员'
    default: return '未知'
  }
}

const formatTime = (time: string | number | Date): string => {
  if (!time) return '-'
  const date = new Date(time)
  return date.toLocaleString('zh-CN')
}

// 图表配置
const typeChartOption = computed(() => {
  const { dormitory, teaching, public: publicArea, network, other } = typeStats.value
  const total = dormitory + teaching + publicArea + network + other

  return {
    title: {
      text: `类型分布 (总计: ${total})`,
      textStyle: { fontSize: 16 },
      left: 'center'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: '{b}: {c}'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['宿舍设施', '教学设备', '公共区域', '网络与设备', '其他'],
      axisLabel: {
        interval: 0,
        rotate: 0
      }
    },
    yAxis: {
      type: 'value',
      name: '数量'
    },
    series: [{
      data: [dormitory, teaching, publicArea, network, other],
      type: 'bar',
      itemStyle: {
        color: function(params: BarSeriesParams) {
          const colors = ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de']
          return colors[params.dataIndex] || '#5470c6'
        }
      },
      label: {
        show: true,
        position: 'top',
        formatter: '{c}'
      }
    }]
  }
})

const urgentChartOption = computed(() => {
  const { urgent, normal } = urgentStats.value
  const total = urgent + normal

  return {
    title: {
      text: `紧急分布 (总计: ${total})`,
      textStyle: { fontSize: 16 },
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      top: 'middle'
    },
    series: [{
      name: '紧急程度',
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 2
      },
      label: {
        show: true,
        formatter: '{b}: {c} ({d}%)'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: '16',
          fontWeight: 'bold'
        }
      },
      labelLine: {
        show: true
      },
      data: [
        { value: urgent, name: '紧急', itemStyle: { color: '#ff4d4f' } },
        { value: normal, name: '不紧急', itemStyle: { color: '#52c41a' } }
      ]
    }]
  }
})

const fetchAllUsers = async () => {
  try {
    const response = await apiCall('superAdminGetAllUsers')
    users.value = response.data || []
  } catch  {
    users.value = []
  }
}

const fetchAllMarks = async () => {
  try {
    const response = await apiCall('superAdminGetAllMark')
    marks.value = response.data || []
  } catch  {
    marks.value = []
  }
}

const fetchFeedbacks = async () => {
  try {
    const response = await apiCall('normalAdminGet')
    const feedbacksData = response.data || []

    // 重置统计
    const urgentStatsTemp = {
      urgent: 0,
      normal: 0
    }

    const typeStatsTemp = {
      dormitory: 0,
      teaching: 0,
      public: 0,
      network: 0,
      other: 0
    }

    feedbacksData.forEach((item: ReportItem) => {
      const isUrgent = item.isUrgent ?? 0
      if (isUrgent === 1) {
        urgentStatsTemp.urgent++
      } else {
        urgentStatsTemp.normal++
      }

      const reportType = item.reportType || 5
      switch (reportType) {
        case 1:
          typeStatsTemp.dormitory++
          break
        case 2:
          typeStatsTemp.teaching++
          break
        case 3:
          typeStatsTemp.public++
          break
        case 4:
          typeStatsTemp.network++
          break
        case 5:
        default:
          typeStatsTemp.other++
          break
      }
    })

    urgentStats.value = urgentStatsTemp
    typeStats.value = typeStatsTemp

    const getTypeText = (type: number): string => {
      switch (type) {
        case 1: return '宿舍设施'
        case 2: return '教学设备'
        case 3: return '公共区域'
        case 4: return '网络与设备'
        case 5: return '其他'
        default: return '其他'
      }
    }

    feedbacks.value = feedbacksData.map((item: ReportItem) => ({
      id: item.reportId || item.id || 0,
      title: item.title || '未命名反馈',
      type: getTypeText(item.reportType || 5),
      area: '教学楼A'
    }))
  } catch  {
    feedbacks.value = []
    urgentStats.value = { urgent: 0, normal: 0 }
    typeStats.value = { dormitory: 0, teaching: 0, public: 0, network: 0, other: 0 }
  }
}

// 用户管理函数
const addUser = async () => {
  try {
    const addData: ModifyUserData = {
      operationType: 1,
      accountName: newUser.value.accountName,
      username: newUser.value.username,
      email: newUser.value.email,
      password: newUser.value.password,
      userType: newUser.value.userType
    }

    await apiCall('superAdminModify', addData)
    showAddUserModal.value = false
    resetNewUser()
    await fetchAllUsers()
    alert('用户添加成功')
  } catch  {
  }
}

const editUser = (user: User) => {
  editingUser.value = { ...user }
  showEditUserModal.value = true
}

const updateUser = async () => {
  try {
    const updateData: ModifyUserData = {
      operationType: 3,
      accountName: editingUser.value.accountName
    }

    if (editingUser.value.username) updateData.username = editingUser.value.username
    if (editingUser.value.email) updateData.email = editingUser.value.email
    if (editingUser.value.password) updateData.password = editingUser.value.password
    if (editingUser.value.userType !== undefined) updateData.userType = editingUser.value.userType

    await apiCall('superAdminModify', updateData)
    showEditUserModal.value = false
    await fetchAllUsers()
    alert('用户更新成功')
  } catch  {
  }
}

const deleteUser = async (user: User) => {
  if (user.userType === 3) {
    alert('不能删除超级管理员')
    return
  }

  if (confirm(`确定要删除用户 ${user.accountName} 吗？`)) {
    try {
      const deleteData: ModifyUserData = {
        operationType: 2,
        accountName: user.accountName
      }

      await apiCall('superAdminModify', deleteData)
      await fetchAllUsers()
      alert('用户删除成功')
    } catch  {

    }
  }
}

const searchUser = async () => {
  try {
    const queryData: ModifyUserData = {
      operationType: 4,
      accountName: searchAccountName.value
    }

    const response = await apiCall('superAdminModify', queryData)
    searchResult.value = response.data
  } catch  {
    searchResult.value = null
  }
}

const reviewMark = async (mark: Mark, action: 'approve' | 'reject') => {
  try {
    const body = {
      reportId: mark.reportId,
      spam: action === 'approve' ? 0 : 2
    }

    await apiCall('superAdminReviewPost', body)
    await fetchAllMarks()
    alert(`标记${action === 'approve' ? '取消标记' : '设为垃圾信息'}成功`)
  } catch  {
  }
}

const showMarkDetails = (mark: Mark) => {
  selectedMark.value = mark
  showMarkDetailModal.value = true
}

// 工具函数
const resetNewUser = () => {
  newUser.value = {
    userId: 0,
    accountName: '',
    username: '',
    email: '',
    userType: 1,
    password: ''
  }
}

const refreshAllData = async () => {
  loading.value = true
  try {
    await Promise.all([
      fetchAllUsers(),
      fetchAllMarks(),
      fetchFeedbacks()
    ])
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  refreshAllData()
})
</script>

<style scoped>
@import url('@/viewsStyle/superAdmin.css');
</style>
