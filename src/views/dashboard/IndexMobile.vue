<template>
  <div class="dashboard-mobile mobile-optimized">
    <div class="welcome-card-mobile">
      <div class="welcome-icon-mobile">
        <svg viewBox="0 0 48 48" fill="none">
          <path d="M24 4C12.96 4 4 12.96 4 24C4 35.04 12.96 44 24 44C35.04 44 44 35.04 44 24C44 12.96 35.04 4 24 4ZM24 20C26.21 20 28 21.79 28 24C28 26.21 26.21 28 24 28C21.79 28 20 26.21 20 24C20 21.79 21.79 20 24 20ZM14 24C14 21.79 15.79 20 18 20C20.21 20 22 21.79 22 24C22 26.21 20.21 28 18 28C15.79 28 14 26.21 14 24ZM30 24C30 21.79 31.79 20 34 20C36.21 20 38 21.79 38 24C38 26.21 36.21 28 34 28C31.79 28 30 26.21 30 24Z" fill="url(#welcomeGrad)"/>
          <defs>
            <linearGradient id="welcomeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#06b6d4"/>
              <stop offset="100%" style="stop-color:#6366f1"/>
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div class="welcome-text-mobile">
        <h1>欢迎回来，{{ username }}！</h1>
        <p>这是您的药品追溯系统数据概览</p>
      </div>
    </div>

    <div class="mobile-section-title">数据统计</div>
    <div class="mobile-stat-grid">
      <div class="mobile-stat-item" style="border-left: 4px solid #06b6d4;">
        <div class="mobile-stat-value">{{ stats.medicineCount || 0 }}</div>
        <div class="mobile-stat-label">药品总数</div>
      </div>
      <div class="mobile-stat-item" style="border-left: 4px solid #6366f1;">
        <div class="mobile-stat-value">{{ stats.batchCount || 0 }}</div>
        <div class="mobile-stat-label">批次总数</div>
      </div>
      <div class="mobile-stat-item" style="border-left: 4px solid #10b981;">
        <div class="mobile-stat-value">{{ stats.flowCount || 0 }}</div>
        <div class="mobile-stat-label">流转记录</div>
      </div>
      <div class="mobile-stat-item" style="border-left: 4px solid #f59e0b;">
        <div class="mobile-stat-value">{{ stats.userCount || 0 }}</div>
        <div class="mobile-stat-label">用户总数</div>
      </div>
    </div>

    <div class="mobile-section-title">快捷操作</div>
    <div class="mobile-card-list">
      <div v-if="role === 'ADMIN' || role === 'ENTERPRISE' || role === 'TERMINAL'" 
           class="mobile-list-item" 
           @click="$router.push('/medicine')">
        <div class="mobile-list-icon" style="background: linear-gradient(135deg, rgba(6, 182, 212, 0.1), rgba(6, 182, 212, 0.05)); color: #06b6d4;">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-6 10H6v-2h8v2zm4-4H6v-2h12v2z" fill="currentColor"/>
          </svg>
        </div>
        <div class="mobile-list-content">
          <div class="mobile-list-title">药品管理</div>
          <div class="mobile-list-subtitle">管理药品信息</div>
        </div>
        <div class="mobile-list-action">→</div>
      </div>

      <div v-if="role === 'ADMIN' || role === 'ENTERPRISE' || role === 'TERMINAL'" 
           class="mobile-list-item" 
           @click="$router.push('/batch')">
        <div class="mobile-list-icon" style="background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(99, 102, 241, 0.05)); color: #6366f1;">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" fill="currentColor"/>
          </svg>
        </div>
        <div class="mobile-list-content">
          <div class="mobile-list-title">批次管理</div>
          <div class="mobile-list-subtitle">管理药品批次</div>
        </div>
        <div class="mobile-list-action">→</div>
      </div>

      <div class="mobile-list-item" @click="$router.push('/flow')">
        <div class="mobile-list-icon" style="background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05)); color: #10b981;">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99z" fill="currentColor"/>
          </svg>
        </div>
        <div class="mobile-list-content">
          <div class="mobile-list-title">流转管理</div>
          <div class="mobile-list-subtitle">查看流转记录</div>
        </div>
        <div class="mobile-list-action">→</div>
      </div>

      <div v-if="role === 'ADMIN' || role === 'ENTERPRISE' || role === 'TERMINAL'" 
           class="mobile-list-item" 
           @click="$router.push('/inventory')">
        <div class="mobile-list-icon" style="background: linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(245, 158, 11, 0.05)); color: #f59e0b;">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-6 10H6v-2h8v2zm4-4H6v-2h12v2z" fill="currentColor"/>
          </svg>
        </div>
        <div class="mobile-list-content">
          <div class="mobile-list-title">库存管理</div>
          <div class="mobile-list-subtitle">查看库存信息</div>
        </div>
        <div class="mobile-list-action">→</div>
      </div>
    </div>

    <div v-if="roleInventoryStats.length > 0" class="mobile-section-title">库存统计</div>
    <div v-if="roleInventoryStats.length > 0" class="mobile-card-list">
      <div v-for="stat in roleInventoryStats" :key="stat.role" class="mobile-card">
        <div class="mobile-card-header">
          <span class="mobile-card-title">{{ getRoleText(stat.role) }}</span>
          <el-tag :type="getRoleTagType(stat.role)" size="small">{{ stat.userCount }}用户</el-tag>
        </div>
        <div style="display: flex; justify-content: space-between; margin-top: 8px;">
          <div>
            <div style="font-size: 20px; font-weight: 700; color: #6366f1;">{{ stat.totalQuantity }}</div>
            <div style="font-size: 12px; color: #64748b;">库存总量</div>
          </div>
          <div>
            <div style="font-size: 20px; font-weight: 700; color: #1e293b;">{{ stat.inventoryCount }}</div>
            <div style="font-size: 12px; color: #64748b;">库存种类</div>
          </div>
        </div>
      </div>
    </div>

    <div class="mobile-section-title">系统信息</div>
    <div class="mobile-card-list">
      <div class="mobile-card">
        <div class="mobile-list-item" style="margin-bottom: 0; box-shadow: none;">
          <div class="mobile-list-icon" style="background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(99, 102, 241, 0.05)); color: #6366f1;">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M20 18c1.1 0 1.99-.9 1.99-2L22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z" fill="currentColor"/>
            </svg>
          </div>
          <div class="mobile-list-content">
            <div class="mobile-list-title">系统版本</div>
            <div class="mobile-list-subtitle">v2.0.0</div>
          </div>
        </div>
        <div class="mobile-list-item" style="margin-bottom: 0; box-shadow: none;">
          <div class="mobile-list-icon" style="background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05)); color: #10b981;">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M12 3C7.03 3 3 4.79 3 7v10c0 2.21 4.03 4 9 4s9-1.79 9-4V7c0-2.21-4.03-4-9-4zm0 2c4.42 0 7 1.51 7 2s-2.58 2-7 2-7-1.51-7-2 2.58-2 7-2zm0 16c-4.42 0-7-1.51-7-2v-6.17c2.28.72 4.89 1.17 7 1.17s4.72-.45 7-1.17V19c0 .49-2.58 2-7 2z" fill="currentColor"/>
            </svg>
          </div>
          <div class="mobile-list-content">
            <div class="mobile-list-title">数据库状态</div>
            <div class="mobile-list-subtitle" style="color: #10b981; font-weight: 600;">正常</div>
          </div>
        </div>
        <div class="mobile-list-item" style="margin-bottom: 0; box-shadow: none;">
          <div class="mobile-list-icon" style="background: linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(245, 158, 11, 0.05)); color: #f59e0b;">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" fill="currentColor"/>
            </svg>
          </div>
          <div class="mobile-list-content">
            <div class="mobile-list-title">安全状态</div>
            <div class="mobile-list-subtitle" style="color: #10b981; font-weight: 600;">安全</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { getDashboardStats } from '@/api/dashboard'
import { getInventoryList } from '@/api/inventory'
import { getUserList } from '@/api/user'

const router = useRouter()
const username = ref(localStorage.getItem('username') || '管理员')
const role = ref(localStorage.getItem('role') || 'ADMIN')
const stats = ref({})
const inventoryList = ref([])
const userList = ref([])

const getRoleCategory = (role) => {
  const categoryMap = {
    'ADMIN': 'ADMIN',
    'ENTERPRISE': 'ENTERPRISE',
    'MANUFACTURER': 'ENTERPRISE',
    'DISTRIBUTOR': 'ENTERPRISE',
    'PHARMACY': 'ENTERPRISE',
    'HOSPITAL': 'ENTERPRISE',
    'TERMINAL': 'TERMINAL',
    'USER': 'TERMINAL',
    'CONSUMER': 'CONSUMER'
  }
  return categoryMap[role] || 'ENTERPRISE'
}

const getRoleText = (role) => {
  const roleMap = {
    'ADMIN': '管理员',
    'ENTERPRISE': '药品企业',
    'TERMINAL': '终端用户',
    'CONSUMER': '消费者'
  }
  return roleMap[role] || role
}

const getRoleTagType = (role) => {
  const typeMap = {
    'ADMIN': 'danger',
    'ENTERPRISE': 'primary',
    'TERMINAL': 'success',
    'CONSUMER': 'info'
  }
  return typeMap[role] || 'info'
}

const roleInventoryStats = computed(() => {
  const stats = {}
  
  userList.value.forEach(user => {
    const category = getRoleCategory(user.role)
    if (!stats[category]) {
      stats[category] = {
        role: category,
        userCount: 0,
        inventoryCount: 0,
        totalQuantity: 0
      }
    }
    stats[category].userCount++
  })
  
  inventoryList.value.forEach(inventory => {
    const user = userList.value.find(u => u.id === inventory.userId)
    if (user) {
      const category = getRoleCategory(user.role)
      if (stats[category]) {
        stats[category].inventoryCount++
        stats[category].totalQuantity += inventory.quantity
      }
    }
  })
  
  return Object.values(stats)
})

onMounted(() => {
  loadStats()
  loadInventoryList()
  loadUserList()
})

const loadStats = async () => {
  try {
    const res = await getDashboardStats()
    if (res.code === 200) {
      stats.value = res.data
    }
  } catch (error) {
    console.error('加载统计数据失败:', error)
  }
}

const loadInventoryList = async () => {
  try {
    const res = await getInventoryList()
    if (res.code === 200) {
      inventoryList.value = res.data || []
    }
  } catch (error) {
    console.error('加载库存列表失败:', error)
  }
}

const loadUserList = async () => {
  try {
    const res = await getUserList()
    if (res.code === 200) {
      userList.value = res.data || []
    }
  } catch (error) {
    console.error('加载用户列表失败:', error)
  }
}
</script>

<style scoped>
.dashboard-mobile {
  padding: 0;
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.welcome-card-mobile {
  background: linear-gradient(135deg, #06b6d4 0%, #6366f1 100%);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  position: relative;
  overflow: hidden;
}

.welcome-card-mobile::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -20%;
  width: 200px;
  height: 200px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
}

.welcome-icon-mobile {
  width: 56px;
  height: 56px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  position: relative;
  z-index: 1;
}

.welcome-icon-mobile svg {
  width: 36px;
  height: 36px;
}

.welcome-text-mobile {
  position: relative;
  z-index: 1;
}

.welcome-text-mobile h1 {
  font-size: 20px;
  font-weight: 700;
  color: #fff;
  margin: 0 0 4px 0;
}

.welcome-text-mobile p {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
}

@media (max-width: 480px) {
  .welcome-card-mobile {
    padding: 16px;
    margin-bottom: 16px;
  }
  
  .welcome-icon-mobile {
    width: 48px;
    height: 48px;
    border-radius: 12px;
  }
  
  .welcome-icon-mobile svg {
    width: 30px;
    height: 30px;
  }
  
  .welcome-text-mobile h1 {
    font-size: 18px;
  }
  
  .welcome-text-mobile p {
    font-size: 12px;
  }
}
</style>