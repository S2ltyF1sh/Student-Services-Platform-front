import { createRouter, createWebHistory } from 'vue-router'
import MainView from '@/main/mainView.vue'

const routes =[
  {
    path:'/',
    name:'main',
    component:MainView
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
