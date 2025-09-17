import { createRouter, createWebHistory } from 'vue-router'
import MainView from '@/views/mainView.vue'
import loginMain from '@/views/loginView.vue'

const routes =[
  {
    path:'/',
    name:'main',
    component:MainView
  },
  {
    path:'/login',
    name:'login',
    component:loginMain
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
