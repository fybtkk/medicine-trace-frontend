<template>
  <div class="login-page">
    <div class="login-background">
      <div class="grid-overlay"></div>
    </div>
    
    <div class="login-content">
      <div class="login-card">
        <div class="login-header">
          <div class="logo-section">
            <div class="logo-icon">
              <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="48" height="48" rx="12" fill="url(#loginGradient)"/>
                <path d="M24 14L24 34" stroke="white" stroke-width="3" stroke-linecap="round"/>
                <path d="M14 24L34 24" stroke="white" stroke-width="3" stroke-linecap="round"/>
                <circle cx="24" cy="24" r="6" fill="white"/>
                <defs>
                  <linearGradient id="loginGradient" x1="0" y1="0" x2="48" y2="48">
                    <stop offset="0%" stop-color="#06b6d4"/>
                    <stop offset="100%" stop-color="#3b82f6"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <h1 class="app-title">药品追溯系统</h1>
          </div>
        </div>

        <div class="form-container">
          <div class="tabs-wrapper">
            <button 
              :class="['tab-button', { active: activeTab === 'login' }]"
              @click="activeTab = 'login'"
            >
              登录
            </button>
            <button 
              :class="['tab-button', { active: activeTab === 'register' }]"
              @click="activeTab = 'register'"
            >
              注册
            </button>
          </div>

          <div v-show="activeTab === 'login'" class="form-content">
            <form @submit.prevent="handleLogin" class="login-form">
              <div class="form-group">
                <div class="input-wrapper">
                  <svg class="input-icon" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 10C12.2091 10 14 8.20914 14 6C14 3.79086 12.2091 2 10 2C7.79086 2 6 3.79086 6 6C6 8.20914 7.79086 10 10 10Z" stroke="#94a3b8" stroke-width="1.5"/>
                    <path d="M3 18C3 14.134 6.13401 11 10 11C13.866 11 17 14.134 17 18" stroke="#94a3b8" stroke-width="1.5"/>
                  </svg>
                  <input 
                    v-model="loginForm.username" 
                    type="text" 
                    class="form-input"
                    placeholder="用户名"
                    autocomplete="username"
                  />
                </div>
              </div>

              <div class="form-group">
                <div class="input-wrapper">
                  <svg class="input-icon" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 8V6C15 3.23858 12.7614 1 10 1C7.23858 1 5 3.23858 5 6V8" stroke="#94a3b8" stroke-width="1.5" stroke-linecap="round"/>
                    <rect x="4" y="8" width="12" height="11" rx="2" stroke="#94a3b8" stroke-width="1.5"/>
                  </svg>
                  <input 
                    v-model="loginForm.password" 
                    :type="showPassword ? 'text' : 'password'" 
                    class="form-input"
                    placeholder="密码"
                    autocomplete="current-password"
                  />
                  <button type="button" class="password-toggle" @click="showPassword = !showPassword">
                    <svg v-if="!showPassword" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 13C11.6569 13 13 11.6569 13 10C13 8.34315 11.6569 7 10 7C8.34315 7 7 8.34315 7 10C7 11.6569 8.34315 13 10 13Z" stroke="#94a3b8" stroke-width="1.5"/>
                      <path d="M2.45799 10C4.02699 5.94299 6.73699 3.33199 10 3.33199C13.263 3.33199 15.973 5.94299 17.542 10C15.973 14.057 13.263 16.668 10 16.668C6.73699 16.668 4.02699 14.057 2.45799 10Z" stroke="#94a3b8" stroke-width="1.5"/>
                    </svg>
                    <svg v-else viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M13.875 6.125L4.125 15.875" stroke="#94a3b8" stroke-width="1.5" stroke-linecap="round"/>
                      <path d="M6.125 4.125L4.125 6.125" stroke="#94a3b8" stroke-width="1.5" stroke-linecap="round"/>
                      <path d="M15.875 13.875L13.875 15.875" stroke="#94a3b8" stroke-width="1.5" stroke-linecap="round"/>
                      <path d="M10 13C11.6569 13 13 11.6569 13 10C13 8.34315 11.6569 7 10 7C8.34315 7 7 8.34315 7 10C7 11.6569 8.34315 13 10 13Z" stroke="#94a3b8" stroke-width="1.5"/>
                      <path d="M2.45799 10C4.02699 5.94299 6.73699 3.33199 10 3.33199C13.263 3.33199 15.973 5.94299 17.542 10C15.973 14.057 13.263 16.668 10 16.668C6.73699 16.668 4.02699 14.057 2.45799 10Z" stroke="#94a3b8" stroke-width="1.5"/>
                    </svg>
                  </button>
                </div>
              </div>

              <div class="form-group">
                <div class="role-select">
                  <div 
                    v-for="role in roleOptions" 
                    :key="role.value"
                    :class="['role-item', { active: loginForm.role === role.value }]"
                    @click="loginForm.role = role.value"
                  >
                    <svg v-if="role.value === 'ADMIN'" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 1.5L3 4.5V9C3 13.6 6.2 17.95 10 19C13.8 17.95 17 13.6 17 9V4.5L10 1.5Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M7.5 9L9 10.5L12.5 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <svg v-else-if="role.value === 'ENTERPRISE'" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="2.5" y="8.5" width="15" height="9" rx="1.5" stroke="currentColor" stroke-width="1.5"/>
                      <path d="M5.5 8.5V5.5C5.5 4.12 6.62 3 8 3H12C13.38 3 14.5 4.12 14.5 5.5V8.5" stroke="currentColor" stroke-width="1.5"/>
                    </svg>
                    <svg v-else-if="role.value === 'TERMINAL'" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="2.5" y="2.5" width="15" height="15" rx="1.5" stroke="currentColor" stroke-width="1.5"/>
                      <path d="M5.5 7H14.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                      <path d="M5.5 12H10.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                    </svg>
                    <svg v-else-if="role.value === 'CONSUMER'" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 10C11.6569 10 13 8.65685 13 7C13 5.34315 11.6569 4 10 4C8.34315 4 7 5.34315 7 7C7 8.65685 8.34315 10 10 10Z" stroke="currentColor" stroke-width="1.5"/>
                      <path d="M3.5 17C3.5 14.08 5.857 11.75 8.771 11.75H11.229C14.143 11.75 16.5 14.08 16.5 17" stroke="currentColor" stroke-width="1.5"/>
                    </svg>
                    <span>{{ role.label }}</span>
                  </div>
                </div>
              </div>

              <button type="submit" class="submit-button" :disabled="loading">
                <span v-if="loading" class="loading-spinner"></span>
                <span v-else>登录</span>
              </button>
            </form>
          </div>

          <div v-show="activeTab === 'register'" class="form-content">
            <form @submit.prevent="handleRegister" class="register-form">
              <div class="form-group">
                <div class="input-wrapper">
                  <svg class="input-icon" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 10C12.2091 10 14 8.20914 14 6C14 3.79086 12.2091 2 10 2C7.79086 2 6 3.79086 6 6C6 8.20914 7.79086 10 10 10Z" stroke="#94a3b8" stroke-width="1.5"/>
                    <path d="M3 18C3 14.134 6.13401 11 10 11C13.866 11 17 14.134 17 18" stroke="#94a3b8" stroke-width="1.5"/>
                  </svg>
                  <input 
                    v-model="registerForm.username" 
                    type="text" 
                    class="form-input"
                    placeholder="用户名"
                  />
                </div>
              </div>

              <div class="form-group">
                <div class="input-wrapper">
                  <svg class="input-icon" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 8V6C15 3.23858 12.7614 1 10 1C7.23858 1 5 3.23858 5 6V8" stroke="#94a3b8" stroke-width="1.5" stroke-linecap="round"/>
                    <rect x="4" y="8" width="12" height="11" rx="2" stroke="#94a3b8" stroke-width="1.5"/>
                  </svg>
                  <input 
                    v-model="registerForm.password" 
                    type="password" 
                    class="form-input"
                    placeholder="密码"
                  />
                </div>
              </div>

              <div class="form-group">
                <div class="input-wrapper">
                  <svg class="input-icon" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 8V6C15 3.23858 12.7614 1 10 1C7.23858 1 5 3.23858 5 6V8" stroke="#94a3b8" stroke-width="1.5" stroke-linecap="round"/>
                    <rect x="4" y="8" width="12" height="11" rx="2" stroke="#94a3b8" stroke-width="1.5"/>
                  </svg>
                  <input 
                    v-model="registerForm.confirmPassword" 
                    type="password" 
                    class="form-input"
                    placeholder="确认密码"
                  />
                </div>
              </div>

              <div class="form-group">
                <div class="input-wrapper">
                  <svg class="input-icon" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 10C12.2091 10 14 8.20914 14 6C14 3.79086 12.2091 2 10 2C7.79086 2 6 3.79086 6 6C6 8.20914 7.79086 10 10 10Z" stroke="#94a3b8" stroke-width="1.5"/>
                    <path d="M3 18C3 14.134 6.13401 11 10 11C13.866 11 17 14.134 17 18" stroke="#94a3b8" stroke-width="1.5"/>
                  </svg>
                  <input 
                    v-model="registerForm.realName" 
                    type="text" 
                    class="form-input"
                    placeholder="真实姓名"
                  />
                </div>
              </div>

              <div class="form-group">
                <div class="input-wrapper">
                  <svg class="input-icon" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5.5 4.5C5.5 3.67 6.17 3 7 3H13C13.83 3 14.5 3.67 14.5 4.5V15.5C14.5 16.33 13.83 17 13 17H7C6.17 17 5.5 16.33 5.5 15.5V4.5Z" stroke="#94a3b8" stroke-width="1.5"/>
                    <path d="M10 13.5H10.0067" stroke="#94a3b8" stroke-width="2.5" stroke-linecap="round"/>
                  </svg>
                  <input 
                    v-model="registerForm.phone" 
                    type="tel" 
                    class="form-input"
                    placeholder="手机号"
                  />
                </div>
              </div>

              <div class="register-notice">
                <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18Z" stroke="#06b6d4" stroke-width="1.5"/>
                  <path d="M10 13V10" stroke="#06b6d4" stroke-width="1.5" stroke-linecap="round"/>
                  <path d="M10 7H10.0083" stroke="#06b6d4" stroke-width="2.5" stroke-linecap="round"/>
                </svg>
                <span>注册成功后默认为消费者身份</span>
              </div>

              <button type="submit" class="submit-button" :disabled="registerLoading">
                <span v-if="registerLoading" class="loading-spinner"></span>
                <span v-else>注册</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { login, register } from '@/api/auth'

const router = useRouter()
const activeTab = ref('login')
const loading = ref(false)
const registerLoading = ref(false)
const showPassword = ref(false)

const roleOptions = [
  { label: '系统管理员', value: 'ADMIN', color: '#ef4444' },
  { label: '药品企业', value: 'ENTERPRISE', color: '#06b6d4' },
  { label: '终端用户', value: 'TERMINAL', color: '#10b981' },
  { label: '消费者', value: 'CONSUMER', color: '#f59e0b' }
]

const loginForm = ref({
  username: '',
  password: '',
  role: ''
})

const registerForm = reactive({
  username: '',
  password: '',
  confirmPassword: '',
  realName: '',
  phone: ''
})

const handleLogin = async () => {
  if (!loginForm.value.username || !loginForm.value.password) {
    ElMessage.warning('请输入用户名和密码')
    return
  }
  if (!loginForm.value.role) {
    ElMessage.warning('请选择身份')
    return
  }
  
  loading.value = true
  try {
    const res = await login(loginForm.value)
    if (res.data && res.data.token) {
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('username', res.data.username)
      localStorage.setItem('role', loginForm.value.role)
      
      ElMessage.success('登录成功')
      
      const selectedRole = loginForm.value.role
      setTimeout(() => {
        if (selectedRole === 'CONSUMER') {
          router.push('/consumer/trace')
        } else {
          router.push('/dashboard')
        }
      }, 300)
    } else {
      ElMessage.error('登录失败，请检查用户名和密码')
    }
  } catch (error) {
    ElMessage.error(error.message || '登录失败')
  } finally {
    loading.value = false
  }
}

const handleRegister = async () => {
  if (!registerForm.username) {
    ElMessage.warning('请输入用户名')
    return
  }
  if (!registerForm.password) {
    ElMessage.warning('请输入密码')
    return
  }
  if (registerForm.password !== registerForm.confirmPassword) {
    ElMessage.warning('两次输入的密码不一致')
    return
  }
  if (!registerForm.realName) {
    ElMessage.warning('请输入真实姓名')
    return
  }
  if (!registerForm.phone) {
    ElMessage.warning('请输入手机号')
    return
  }
  
  try {
    registerLoading.value = true
    
    const registerData = {
      username: registerForm.username,
      password: registerForm.password,
      realName: registerForm.realName,
      phone: registerForm.phone
    }
    
    const res = await register(registerData)
    if (res.code === 200) {
      ElMessage.success('注册成功，请登录')
      activeTab.value = 'login'
      Object.assign(registerForm, {
        username: '',
        password: '',
        confirmPassword: '',
        realName: '',
        phone: ''
      })
    } else {
      ElMessage.error(res.message || '注册失败')
    }
  } catch (error) {
    if (error !== false) {
      ElMessage.error(error.message || '注册失败')
    }
  } finally {
    registerLoading.value = false
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%);
}

.login-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  pointer-events: none;
}

.grid-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    linear-gradient(rgba(6, 182, 212, 0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(6, 182, 212, 0.02) 1px, transparent 1px);
  background-size: 40px 40px;
}

.login-content {
  position: relative;
  z-index: 10;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.login-card {
  width: 100%;
  max-width: 400px;
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  animation: slideUp 0.5s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.login-header {
  background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%);
  padding: 32px 24px;
  text-align: center;
}

.logo-section {
  animation: fadeIn 0.6s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.logo-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 12px;
  filter: drop-shadow(0 4px 12px rgba(6, 182, 212, 0.3));
  animation: scaleIn 0.4s ease-out 0.15s both;
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.app-title {
  font-size: 22px;
  font-weight: 700;
  color: white;
  margin: 0;
  letter-spacing: -0.01em;
}

.form-container {
  padding: 24px;
}

.tabs-wrapper {
  display: flex;
  background: #f1f5f9;
  border-radius: 10px;
  padding: 4px;
  margin-bottom: 24px;
}

.tab-button {
  flex: 1;
  padding: 10px;
  background: transparent;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tab-button:hover {
  color: #475569;
}

.tab-button.active {
  background: #fff;
  color: #06b6d4;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
}

.form-content {
  animation: fadeIn 0.25s ease-out;
}

.form-group {
  margin-bottom: 16px;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 14px;
  width: 18px;
  height: 18px;
  pointer-events: none;
}

.form-input {
  width: 100%;
  padding: 12px 14px 12px 42px;
  font-size: 14px;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  background: #fff;
  color: #1e293b;
  transition: all 0.2s ease;
  outline: none;
}

.form-input:focus {
  border-color: #06b6d4;
  box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.1);
}

.form-input::placeholder {
  color: #94a3b8;
}

.password-toggle {
  position: absolute;
  right: 12px;
  width: 18px;
  height: 18px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.password-toggle svg {
  width: 18px;
  height: 18px;
  transition: color 0.2s ease;
}

.password-toggle:hover svg {
  color: #06b6d4;
}

.role-select {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.role-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 12px 8px;
  background: #f8fafc;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #64748b;
}

.role-item:hover {
  border-color: #cbd5e1;
  background: #f1f5f9;
}

.role-item.active {
  border-color: #06b6d4;
  background: rgba(6, 182, 212, 0.1);
  color: #06b6d4;
}

.role-item svg {
  width: 20px;
  height: 20px;
}

.role-item span {
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
}

.register-notice {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  background: rgba(6, 182, 212, 0.08);
  border-radius: 10px;
  margin-bottom: 16px;
}

.register-notice svg {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.register-notice span {
  font-size: 12px;
  color: #0e7490;
  line-height: 1.4;
}

.submit-button {
  width: 100%;
  padding: 12px;
  font-size: 15px;
  font-weight: 600;
  color: white;
  background: linear-gradient(135deg, #06b6d4 0%, #6366f1 100%);
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  position: relative;
  overflow: hidden;
}

.submit-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.35);
}

.submit-button:active {
  transform: translateY(0);
}

.submit-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.loading-spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 480px) {
  .login-content {
    padding: 12px;
  }
  
  .login-card {
    border-radius: 16px;
  }
  
  .login-header {
    padding: 24px 20px;
  }
  
  .logo-icon {
    width: 56px;
    height: 56px;
  }
  
  .app-title {
    font-size: 20px;
  }
  
  .form-container {
    padding: 20px;
  }
  
  .role-select {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
  
  .role-item {
    padding: 14px 10px;
  }
  
  .role-item svg {
    width: 22px;
    height: 22px;
  }
  
  .role-item span {
    font-size: 12px;
  }
}

@media (max-width: 360px) {
  .login-content {
    padding: 10px;
  }
  
  .login-header {
    padding: 20px 16px;
  }
  
  .logo-icon {
    width: 52px;
    height: 52px;
  }
  
  .app-title {
    font-size: 18px;
  }
  
  .form-container {
    padding: 16px;
  }
  
  .role-select {
    gap: 8px;
  }
  
  .role-item {
    padding: 12px 8px;
  }
  
  .tabs-wrapper {
    margin-bottom: 20px;
  }
  
  .tab-button {
    padding: 9px;
    font-size: 13px;
  }
}
</style>
