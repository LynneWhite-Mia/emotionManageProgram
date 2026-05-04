<template>
    <el-aside :width="isCollapsed ? '64px' : '264px'">
      <el-menu
        :collapse="isCollapsed"
        :collapse-transition="false"
        default-active="2"
        @open="handleOpen"
        @close="handleClose"
        @select="selectMenu"
        class="menu-style"
      >
      <div class="brand">
        <el-image style="width:50px;height:50px;margin-right: 10px;":src="iconUrl" alt="logo"/>
        <div v-show="!isCollapsed" class="info-card">
          <h1 class="brand-title">心理健康AI助手</h1>
          <p calss="brand-subtital">管理后台</p>
        </div>
    </div>
        <el-menu-item v-for="item in menuRoutes"
          :key="item.path"
          :index="item.path"
        >
          <el-icon>
            <component :is="ElementPlusIconsVue[item.meta.icon]" />
          </el-icon>
          <span>{{ item.meta.item }}</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  import { useRouter } from 'vue-router'
  import { useAdminStore } from '@/stores/admin'
  import * as ElementPlusIconsVue from '@element-plus/icons-vue'

  const router = useRouter()
  const iconUrl = new URL('@/assets/images/机器人.png', import.meta.url).href
  const isCollapsed = computed(() => useAdminStore().isCollapsed)
  const menuRoutes = router.options.routes.find(r => r.path === '/back')?.children || []

  const handleOpen = () => {}
  const handleClose = () => {}

  const selectMenu = (key) => {
    const currentRoute = router.options.routes.find(r => r.path === '/back')
    router.push(`${currentRoute.path}/${key}`)
  }
</script>
<style lang="scss" scoped>
.menu-style{
    height:100%;
    .el-menu {
      height: 100%;
    }
    .brand{
      display:flex;
      align-items:center;
      padding:8px;
      background-color: #fff;
      border-bottom: 1px solid #e5e7eb;
      .info-card{
        .brand-title{
          font-size:20px;
          font-weight: bold;
          margin-bottom: 5px;
          color:#1f2937;
        }
        .brand-subtitle{
          font-size:14px;
          color:#6b7280;
        }
      }
    }
}

</style>