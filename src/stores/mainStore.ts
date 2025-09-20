import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useViewStore = defineStore('view', () => {
  // 状态state
  const currentView = ref('home')

  // 操作action
  const changeView = (newView: string) => {
    currentView.value = newView
  }
  return {
    currentView,
    changeView,
  }
})
