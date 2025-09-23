import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useLoginStore = defineStore('login', () => {
  // 状态state
  const header = ref('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwcml2YXRlX21lc3NhZ2UiOnsiYWNjb3VudE5hbWUiOiIxIiwidXNlcklkIjo0fSwiZXhwIjoxNzU4Mjc4NDA3fQ.knxtX-_LNrv0uBL8JzAjhBXN3olubsrsXUGKone4JOk')
  const userName =ref('')
  const accountName = ref('')
  const isLogin =ref(false)
  // 操作action
  const currentHeader = (newHeader: string) => {
    header.value = newHeader
  }
  const currentUser = (username : string) => {
    userName.value =username
  }
  const currentAccount = (account : string) => {
    accountName.value = account
  }
  const changeIsLogin = (islogin : boolean) => {
    isLogin.value = islogin;
  }
  return {
    header,
    userName,
    accountName,
    isLogin,
    currentHeader,
    currentUser,
    currentAccount,
    changeIsLogin
  }
})
