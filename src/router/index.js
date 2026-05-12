import { createRouter, createWebHistory } from 'vue-router'
import BackendLayout from '@/components/BackendLayout.vue'
import AuthLayout from '@/components/AuthLayout.vue'
import FrontendLayout from '@/components/FrontendLayout.vue'
// 路由配置
const routes = [
  {
    path: '/back',
    redirect: '/back/dashboard',
    component: BackendLayout,
    children: [
      {
        path: 'dashboard',
        component:()=>import('@/views/dashboard.vue'),
        meta:{
          item:'数据分析',
          icon:'PieChart'
        }
      },
      {
        path: 'knowledge',
        component:()=>import('@/views/knowledge.vue'),
        meta:{
          item:'知识文章',
          icon:'ChatLineSquare'
        }
      },
      {
        path: 'consultations',
        component:()=>import('@/views/consultations.vue'),
        meta:{
          item:'咨询记录',
          icon:'Message'
        }
      },
      {
        path: 'emotional',
        component:()=>import('@/views/emotional.vue'),
        meta:{
          item:'情绪日志',
          icon:'User'
        }
      }
    ],
  },
  {
    path: '/auth',
    component: AuthLayout,
    children: [
      {
        path: 'login',
        component: () => import('@/views/login.vue'),
        meta: {
          title: '登录'
        }
      },
      {
        path: 'register',
        component: () => import('@/views/register.vue'),
        meta: {
          title: '注册'
        }
      }
    ]
  }
]

const frontendRoutes =[
  {
    path:'/',
    component : FrontendLayout,
    children: [
      {
        path: '',
        component: () => import('@/views/home.vue')
      },
      {
        path: 'consultation',
        component: () => import('@/views/consultation.vue')
      },
      {
        path: 'emotion-diary',
        component: () => import('@/views/emotionDiary.vue')
      },
      {
        path: 'knowledge',
        component: () => import('@/views/frontendKnowledge.vue')
      },
      {
        path: 'knowledge/article/:id',
        component: () => import('@/views/articleDetail.vue'),
        props: true
      }
    ]
  }
]
const router = createRouter({
  history: createWebHistory(),
  routes:[ ...routes,...frontendRoutes,]
})

//路由前置守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  // 当前用户是否登录
  if (token) {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'))
    // 如果是后台用户
    if (userInfo.userType == 2) {
      if (to.path.startsWith('/back')|| to.path.startsWith('/auth')) {
        next()
      } else {
        next('/back/dashboard')
      }
    } else if (userInfo.userType == 1){
      // 用户端账号只能访问前台路由
      if (to.path.startsWith('/back') || to.path.startsWith('/auth')) {
        next('/')
      } else {
        next()
      }
    }
    else {
      // userType 异常，清除缓存并跳转登录页
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
      next('/auth/login')
    }
  } else {
    if (to.path.startsWith('/back')) {
      // 如果是访问后台页面，那么跳转到登录页
      next('/auth/login')
    } else {
      next()
    }
  }
})
export default router