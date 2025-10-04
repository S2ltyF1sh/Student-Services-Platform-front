import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useErrorStore = defineStore('error', () => {
  const message = ref<string>('')
  const isError = ref<boolean>(false)

  let hideTimer: number | null = null

  const showError = (msg: string, autoHideMs = 5000) => {
    message.value = msg
    isError.value = true
    console.log('showError', msg);

    if (hideTimer) {
      clearTimeout(hideTimer)
      hideTimer = null
    }

    if (autoHideMs > 0) {
      hideTimer = window.setTimeout(() => {
        clearError()
      }, autoHideMs)
    }
  }

  const clearError = () => {
    message.value = ''
    isError.value = false

    if (hideTimer) {
      clearTimeout(hideTimer)
      hideTimer = null
    }
  }

  const setMessage = (msg: string) => {
    message.value = msg
  }

  const setVisibility = (visible: boolean) => {
    isError.value = visible
  }

  const error = message
  const visible = isError

  return {
    message,
    isError,
    error,
    visible,
    showError,
    clearError,
    setMessage,
    setVisibility
  }
})
