<template>
  <el-container class="layout-container">
    <el-aside :width="isCollapsed ? '72px' : '240px'" class="sidebar" :class="{ 'mobile-open': isMobileMenuOpen }">
      <div class="sidebar-header">
        <div class="logo-wrapper" v-if="!isCollapsed">
          <svg class="logo-icon" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="18" stroke="url(#logoGrad)" stroke-width="2"/>
            <path d="M20 10 L20 30 M10 20 L30 20" stroke="url(#logoGrad)" stroke-width="3" stroke-linecap="round"/>
            <defs>
              <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#06b6d4"/>
                <stop offset="100%" style="stop-color:#6366f1"/>
              </linearGradient>
            </defs>
          </svg>
          <span class="logo-text">药品追溯</span>
        </div>
        <div class="logo-mini" v-else>
          <svg class="logo-icon-mini" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="18" stroke="url(#logoGrad2)" stroke-width="2"/>
            <path d="M20 12 L20 28 M12 20 L28 20" stroke="url(#logoGrad2)" stroke-width="3" stroke-linecap="round"/>
            <defs>
              <linearGradient id="logoGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#06b6d4"/>
                <stop offset="100%" style="stop-color:#6366f1"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
      <el-menu 
        router 
        :default-active="$route.path"
        :collapse="isCollapsed"
        :collapse-transition="false"
        class="custom-menu"
        @select="handleMenuSelect"
      >
        <el-menu-item index="/dashboard">
          <el-icon><House /></el-icon>
          <template #title>数据概览</template>
        </el-menu-item>
        
        <el-menu-item v-if="role === 'ADMIN' || role === 'ENTERPRISE' || role === 'TERMINAL'" index="/medicine">
          <el-icon><Box /></el-icon>
          <template #title>药品管理</template>
        </el-menu-item>
        
        <el-menu-item v-if="role === 'ADMIN' || role === 'ENTERPRISE' || role === 'TERMINAL'" index="/batch">
          <el-icon><Tickets /></el-icon>
          <template #title>批次管理</template>
        </el-menu-item>
        
        <el-menu-item index="/flow">
          <el-icon><TrendCharts /></el-icon>
          <template #title>流转管理</template>
        </el-menu-item>
        
        <el-menu-item v-if="role === 'ADMIN' || role === 'ENTERPRISE' || role === 'TERMINAL'" index="/inventory">
          <el-icon><Box /></el-icon>
          <template #title>库存管理</template>
        </el-menu-item>
        
        <el-menu-item v-if="role === 'ADMIN'" index="/user">
          <el-icon><User /></el-icon>
          <template #title>用户管理</template>
        </el-menu-item>
        
        <el-menu-item v-if="role === 'ADMIN'" index="/node">
          <el-icon><OfficeBuilding /></el-icon>
          <template #title>节点管理</template>
        </el-menu-item>
        
        <el-menu-item v-if="role === 'ADMIN' || role === 'ENTERPRISE' || role === 'TERMINAL'" index="/consumer-purchase">
          <el-icon><UserFilled /></el-icon>
          <template #title>消费者管理</template>
        </el-menu-item>
        
        <el-menu-item index="/trace">
          <el-icon><Search /></el-icon>
          <template #title>溯源查询</template>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <div class="mobile-overlay" :class="{ 'visible': isMobileMenuOpen }" @click="closeMobileMenu"></div>
    <el-container class="main-container">
      <el-header class="header">
        <div class="header-left">
          <div class="mobile-menu-btn" @click="toggleMobileMenu">
            <el-icon><Menu /></el-icon>
          </div>
          <div class="collapse-btn" @click="toggleCollapse">
            <el-icon v-if="!isCollapsed"><Fold /></el-icon>
            <el-icon v-else><Expand /></el-icon>
          </div>
          <div class="breadcrumb-wrapper">
            <el-breadcrumb separator="/">
              <el-breadcrumb-item :to="{ path: '/dashboard' }">首页</el-breadcrumb-item>
              <el-breadcrumb-item v-if="$route.meta.title">{{ $route.meta.title }}</el-breadcrumb-item>
            </el-breadcrumb>
          </div>
        </div>
        <div class="header-right">
          <div class="user-info">
            <div class="user-avatar">{{ username.charAt(0) }}</div>
            <div class="user-details" v-if="!isCollapsed">
              <span class="user-name">{{ username }}</span>
              <span class="role-badge" :class="role.toLowerCase()">{{ roleText }}</span>
            </div>
          </div>
          <el-button class="logout-btn" @click="logout">
            <el-icon><SwitchButton /></el-icon>
            <span v-if="!isCollapsed">退出</span>
          </el-button>
        </div>
      </el-header>
      <el-main class="main-content">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { House, Box, Tickets, TrendCharts, User, OfficeBuilding, Fold, Expand, UserFilled, SwitchButton, Menu, Search } from '@element-plus/icons-vue'

const router = useRouter()
const username = ref(localStorage.getItem('username') || '管理员')
const role = ref(localStorage.getItem('role') || 'ADMIN')
const isCollapsed = ref(false)
const isMobileMenuOpen = ref(false)
const isMobile = ref(false)

const roleText = computed(() => {
  const roleMap = {
    'ADMIN': '管理员',
    'ENTERPRISE': '药品企业',
    'TERMINAL': '终端用户',
    'CONSUMER': '消费者'
  }
  return roleMap[role.value] || '用户'
})

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
}

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

const handleMenuSelect = () => {
  if (isMobile.value) {
    isMobileMenuOpen.value = false
  }
}

const checkScreenSize = () => {
  isMobile.value = window.innerWidth <= 768
  if (!isMobile.value) {
    isMobileMenuOpen.value = false
  }
}

const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('username')
  localStorage.removeItem('role')
  router.push('/login')
}

onMounted(() => {
  checkScreenSize()
  window.addEventListener('resize', checkScreenSize)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkScreenSize)
})
</script>

<style scoped>
.layout-container {
  height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
}

.sidebar {
  background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%);
  color: #fff;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  box-shadow: 4px 0 24px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 100;
}

.sidebar::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 1px;
  height: 100%;
  background: linear-gradient(180deg, transparent 0%, rgba(99, 102, 241, 0.3) 50%, transparent 100%);
}

.sidebar-header {
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(0, 0, 0, 0.2);
}

.logo-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  width: 40px;
  height: 40px;
  animation: pulse 3s ease-in-out infinite;
}

.logo-text {
  font-size: 18px;
  font-weight: 700;
  background: linear-gradient(135deg, #06b6d4 0%, #6366f1 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 1px;
}

.logo-mini {
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-icon-mini {
  width: 44px;
  height: 44px;
  animation: pulse 3s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}

.custom-menu {
  border-right: none;
  background: transparent;
  padding: 16px 12px;
}

.custom-menu:not(.el-menu--collapse) {
  width: 240px;
}

.custom-menu.el-menu--collapse {
  width: 72px;
}

.custom-menu .el-menu-item {
  height: 48px;
  line-height: 48px;
  margin: 4px 0;
  border-radius: 12px;
  color: #94a3b8;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.custom-menu .el-menu-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 0;
  background: linear-gradient(180deg, #06b6d4 0%, #6366f1 100%);
  border-radius: 0 3px 3px 0;
  transition: height 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.custom-menu .el-menu-item:hover {
  background: rgba(99, 102, 241, 0.1);
  color: #e2e8f0;
}

.custom-menu .el-menu-item:hover::before {
  height: 24px;
}

.custom-menu .el-menu-item.is-active {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(6, 182, 212, 0.1) 100%);
  color: #fff;
}

.custom-menu .el-menu-item.is-active::before {
  height: 32px;
}

.custom-menu .el-menu-item .el-icon {
  width: 20px;
  height: 20px;
  font-size: 20px;
}

.main-container {
  display: flex;
  flex-direction: column;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(12px);
  box-shadow: 0 1px 20px rgba(0, 0, 0, 0.06);
  padding: 0 32px;
  height: 72px;
  border-bottom: 1px solid rgba(148, 163, 184, 0.1);
  position: sticky;
  top: 0;
  z-index: 50;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.collapse-btn {
  cursor: pointer;
  font-size: 20px;
  padding: 12px;
  border-radius: 12px;
  color: #64748b;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.collapse-btn:hover {
  background: #f1f5f9;
  color: #6366f1;
  transform: scale(1.05);
}

.breadcrumb-wrapper {
  display: flex;
  align-items: center;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  border-radius: 12px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.user-info:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: linear-gradient(135deg, #06b6d4 0%, #6366f1 100%);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 700;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.user-name {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
}

.role-badge {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 6px;
  font-weight: 600;
  display: inline-block;
}

.role-badge.admin {
  background: #fee2e2;
  color: #dc2626;
}

.role-badge.enterprise {
  background: #dbeafe;
  color: #2563eb;
}

.role-badge.terminal {
  background: #dcfce7;
  color: #16a34a;
}

.role-badge.consumer {
  background: #fef3c7;
  color: #d97706;
}

.logout-btn {
  padding: 10px 20px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  background: #fff;
  color: #64748b;
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  gap: 8px;
}

.logout-btn:hover {
  background: #fee2e2;
  border-color: #fecaca;
  color: #dc2626;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.15);
}

.main-content {
  padding: 24px 32px;
  overflow-y: auto;
  overflow-x: auto;
  background: transparent;
  -webkit-overflow-scrolling: touch;
}

.main-content::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.main-content::-webkit-scrollbar-track {
  background: transparent;
}

.main-content::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

.main-content::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

.mobile-menu-btn {
  display: none;
}

.mobile-overlay {
  display: none;
}

@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    left: 0;
    top: 0;
    height: 100vh;
    width: 260px;
    transform: translateX(-100%);
    z-index: 1000;
  }

  .sidebar.mobile-open {
    transform: translateX(0);
  }

  .sidebar:not(.el-menu--collapse) {
    width: 260px;
  }

  .mobile-menu-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px;
    border-radius: 10px;
    background: #f1f5f9;
    color: #64748b;
    cursor: pointer;
    transition: all 0.3s ease;
    flex-shrink: 0;
  }

  .mobile-menu-btn:hover {
    background: #e2e8f0;
    color: #6366f1;
  }

  .mobile-overlay {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
  }

  .mobile-overlay.visible {
    opacity: 1;
    visibility: visible;
  }

  .header {
    padding: 0 12px;
    height: 56px;
  }

  .header-left {
    gap: 10px;
  }

  .breadcrumb-wrapper {
    display: none;
  }

  .collapse-btn {
    display: none;
  }

  .user-details {
    display: none;
  }

  .user-info {
    padding: 6px 8px;
  }

  .user-avatar {
    width: 36px;
    height: 36px;
    font-size: 14px;
  }

  .logout-btn span {
    display: none;
  }

  .logout-btn {
    padding: 10px;
  }

  .main-content {
    padding: 12px;
  }
}

@media (max-width: 480px) {
  .header {
    padding: 0 10px;
    height: 52px;
  }
  
  .header-left {
    gap: 8px;
  }
  
  .mobile-menu-btn {
    padding: 8px;
  }
  
  .user-info {
    padding: 4px 6px;
  }
  
  .user-avatar {
    width: 32px;
    height: 32px;
    font-size: 13px;
  }
  
  .main-content {
    padding: 10px;
  }
}
</style>
