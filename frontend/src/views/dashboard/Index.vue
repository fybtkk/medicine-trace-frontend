<template>
  <div>
    <div v-if="!isMobile" class="dashboard">
      <div class="welcome-section">
        <div class="welcome-card">
          <div class="welcome-content">
            <div class="welcome-icon">
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
            <div class="welcome-text">
              <h1>欢迎回来，{{ username }}！</h1>
              <p>这是您的药品追溯系统数据概览</p>
            </div>
          </div>
          <div class="welcome-decoration">
            <div class="deco-circle deco-1"></div>
            <div class="deco-circle deco-2"></div>
            <div class="deco-circle deco-3"></div>
          </div>
        </div>
      </div>

      <div class="stats-section">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :md="6">
            <div class="stat-card medicine">
              <div class="stat-icon">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-6 10H6v-2h8v2zm4-4H6v-2h12v2z" fill="currentColor"/>
                </svg>
              </div>
              <div class="stat-content">
                <div class="stat-value">{{ stats.medicineCount || 0 }}</div>
                <div class="stat-label">药品总数</div>
              </div>
              <div class="stat-trend">
                <span class="trend-up">+12%</span>
              </div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6">
            <div class="stat-card batch">
              <div class="stat-icon">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" fill="currentColor"/>
                </svg>
              </div>
              <div class="stat-content">
                <div class="stat-value">{{ stats.batchCount || 0 }}</div>
                <div class="stat-label">批次总数</div>
              </div>
              <div class="stat-trend">
                <span class="trend-up">+8%</span>
              </div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6">
            <div class="stat-card flow">
              <div class="stat-icon">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99z" fill="currentColor"/>
                </svg>
              </div>
              <div class="stat-content">
                <div class="stat-value">{{ stats.flowCount || 0 }}</div>
                <div class="stat-label">流转记录</div>
              </div>
              <div class="stat-trend">
                <span class="trend-up">+23%</span>
              </div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6">
            <div class="stat-card user">
              <div class="stat-icon">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" fill="currentColor"/>
                </svg>
              </div>
              <div class="stat-content">
                <div class="stat-value">{{ stats.userCount || 0 }}</div>
                <div class="stat-label">用户总数</div>
              </div>
              <div class="stat-trend">
                <span class="trend-up">+5%</span>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>

      <div class="quick-section">
        <div class="section-header">
          <h3>快捷操作</h3>
        </div>
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :md="8" :lg="6" v-if="role === 'ADMIN' || role === 'ENTERPRISE' || role === 'TERMINAL'">
            <div class="quick-card" @click="$router.push('/medicine')">
              <div class="quick-icon" style="background: linear-gradient(135deg, rgba(6, 182, 212, 0.1), rgba(6, 182, 212, 0.05)); color: #06b6d4;">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-6 10H6v-2h8v2zm4-4H6v-2h12v2z" fill="currentColor"/>
                </svg>
              </div>
              <div class="quick-content">
                <div class="quick-title">药品管理</div>
                <div class="quick-desc">管理药品信息</div>
              </div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6" v-if="role === 'ADMIN' || role === 'ENTERPRISE' || role === 'TERMINAL'">
            <div class="quick-card" @click="$router.push('/batch')">
              <div class="quick-icon" style="background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(99, 102, 241, 0.05)); color: #6366f1;">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" fill="currentColor"/>
                </svg>
              </div>
              <div class="quick-content">
                <div class="quick-title">批次管理</div>
                <div class="quick-desc">管理药品批次</div>
              </div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <div class="quick-card" @click="$router.push('/flow')">
              <div class="quick-icon" style="background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05)); color: #10b981;">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99z" fill="currentColor"/>
                </svg>
              </div>
              <div class="quick-content">
                <div class="quick-title">流转管理</div>
                <div class="quick-desc">查看流转记录</div>
              </div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6" v-if="role === 'ADMIN' || role === 'ENTERPRISE' || role === 'TERMINAL'">
            <div class="quick-card" @click="$router.push('/inventory')">
              <div class="quick-icon" style="background: linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(245, 158, 11, 0.05)); color: #f59e0b;">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-6 10H6v-2h8v2zm4-4H6v-2h12v2z" fill="currentColor"/>
                </svg>
              </div>
              <div class="quick-content">
                <div class="quick-title">库存管理</div>
                <div class="quick-desc">查看库存信息</div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>

      <div class="content-section">
        <el-row :gutter="20">
          <el-col :xs="24" :lg="12">
            <div class="info-card">
              <div class="card-header">
                <h3>系统信息</h3>
              </div>
              <div class="info-list">
                <div class="info-item">
                  <div class="info-icon system">
                    <svg viewBox="0 0 24 24" fill="none">
                      <path d="M20 18c1.1 0 1.99-.9 1.99-2L22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z" fill="currentColor"/>
                    </svg>
                  </div>
                  <div class="info-content">
                    <div class="info-label">系统版本</div>
                    <div class="info-value">v2.0.0</div>
                  </div>
                </div>
                <div class="info-item">
                  <div class="info-icon database">
                    <svg viewBox="0 0 24 24" fill="none">
                      <path d="M12 3C7.03 3 3 4.79 3 7v10c0 2.21 4.03 4 9 4s9-1.79 9-4V7c0-2.21-4.03-4-9-4zm0 2c4.42 0 7 1.51 7 2s-2.58 2-7 2-7-1.51-7-2 2.58-2 7-2zm0 16c-4.42 0-7-1.51-7-2v-6.17c2.28.72 4.89 1.17 7 1.17s4.72-.45 7-1.17V19c0 .49-2.58 2-7 2z" fill="currentColor"/>
                    </svg>
                  </div>
                  <div class="info-content">
                    <div class="info-label">数据库状态</div>
                    <div class="info-value status-good">正常</div>
                  </div>
                </div>
                <div class="info-item">
                  <div class="info-icon security">
                    <svg viewBox="0 0 24 24" fill="none">
                      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" fill="currentColor"/>
                    </svg>
                  </div>
                  <div class="info-content">
                    <div class="info-label">安全状态</div>
                    <div class="info-value status-good">安全</div>
                  </div>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :xs="24" :lg="12" v-if="role === 'ADMIN' || role === 'ENTERPRISE' || role === 'TERMINAL'">
            <div class="info-card warning-card">
              <div class="card-header">
                <h3>库存预警</h3>
                <span class="warning-badge" v-if="lowStockList.length > 0">{{ lowStockList.length }}</span>
              </div>
              <div class="warning-list" v-if="lowStockList.length > 0">
                <div v-for="item in lowStockList.slice(0, 5)" :key="item.id" class="warning-item">
                  <div class="warning-info">
                    <div class="warning-name">{{ item.medicineName }}</div>
                    <div class="warning-desc">库存: {{ item.quantity }} / 预警: {{ item.threshold }}</div>
                  </div>
                  <el-tag type="danger" size="small">预警</el-tag>
                </div>
              </div>
              <div v-else class="empty-warning">
                <div class="empty-icon">✅</div>
                <div class="empty-text">暂无库存预警</div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>

      <div class="content-section" v-if="recentFlows.length > 0">
        <div class="info-card">
          <div class="card-header">
            <h3>最近流转记录</h3>
            <el-link type="primary" @click="$router.push('/flow')" style="font-size: 13px;">查看全部 →</el-link>
          </div>
          <div class="recent-list">
            <div v-for="item in recentFlows.slice(0, 5)" :key="item.id" class="recent-item">
              <div class="recent-icon" :style="{ background: getFlowIconBg(item.operation) }">
                {{ getFlowIcon(item.operation) }}
              </div>
              <div class="recent-content">
                <div class="recent-title">{{ getOperationText(item.operation) }}</div>
                <div class="recent-desc">{{ item.traceCode }} · {{ item.operator }}</div>
              </div>
              <div class="recent-time">{{ formatTime(item.createTime) }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="dashboard-mobile mobile-optimized">
      <div class="welcome-card-mobile">
        <div class="welcome-icon-mobile">
          <svg viewBox="0 0 48 48" fill="none">
            <path d="M24 4C12.96 4 4 12.96 4 24C4 35.04 12.96 44 24 44C35.04 44 44 35.04 44 24C44 12.96 35.04 4 24 4ZM24 20C26.21 20 28 21.79 28 24C28 26.21 26.21 28 24 28C21.79 28 20 26.21 20 24C20 21.79 21.79 20 24 20ZM14 24C14 21.79 15.79 20 18 20C20.21 20 22 21.79 22 24C22 26.21 20.21 28 18 28C15.79 28 14 26.21 14 24ZM30 24C30 21.79 31.79 20 34 20C36.21 20 38 21.79 38 24C38 26.21 36.21 28 34 28C31.79 28 30 26.21 30 24Z" fill="url(#welcomeGradMobile)"/>
            <defs>
              <linearGradient id="welcomeGradMobile" x1="0%" y1="0%" x2="100%" y2="100%">
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
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { getDashboardStats } from '@/api/dashboard'
import { getInventoryList, getInventoryWarnings } from '@/api/inventory'
import { getFlowPageAdvanced } from '@/api/flow'
import { getMedicinePage } from '@/api/medicine'

const username = ref(localStorage.getItem('username') || '管理员')
const role = ref(localStorage.getItem('role') || 'ADMIN')
const stats = ref({})
const isMobile = ref(false)
const lowStockList = ref([])
const recentFlows = ref([])

const checkScreenSize = () => {
  isMobile.value = window.innerWidth <= 768
}

const getFlowIcon = (operation) => {
  const icons = { 'INBOUND': '入', 'OUTBOUND': '出', 'SALE': '售' }
  return icons[operation] || '流'
}

const getFlowIconBg = (operation) => {
  const colors = {
    'INBOUND': 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05))',
    'OUTBOUND': 'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(245, 158, 11, 0.05))',
    'SALE': 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(239, 68, 68, 0.05))'
  }
  return colors[operation] || colors['INBOUND']
}

const getOperationText = (operation) => {
  const texts = { 'INBOUND': '入库', 'OUTBOUND': '出库', 'SALE': '销售' }
  return texts[operation] || '流转'
}

const formatTime = (time) => {
  if (!time) return ''
  const date = new Date(time)
  const now = new Date()
  const diff = now - date
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days < 7) return `${days}天前`
  return date.toLocaleDateString()
}

onMounted(() => {
  checkScreenSize()
  window.addEventListener('resize', checkScreenSize)
  loadStats()
  loadLowStock()
  loadRecentFlows()
})

onUnmounted(() => {
  window.removeEventListener('resize', checkScreenSize)
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

const loadLowStock = async () => {
  try {
    const res = await getInventoryWarnings()
    if (res.code === 200) {
      lowStockList.value = res.data || []
    }
  } catch (error) {
    console.error('加载库存预警失败:', error)
    try {
      const res2 = await getInventoryList()
      if (res2.code === 200) {
        const list = res2.data || []
        lowStockList.value = list.filter(item => item.quantity <= item.threshold)
      }
    } catch (error2) {
      console.error('加载库存列表失败:', error2)
    }
  }
}

const loadRecentFlows = async () => {
  try {
    const res = await getFlowPageAdvanced({ current: 1, size: 10 })
    if (res.code === 200) {
      recentFlows.value = res.data.records || []
    }
  } catch (error) {
    console.error('加载最近流转记录失败:', error)
  }
}
</script>

<style scoped>
.dashboard {
  padding: 0;
  animation: fadeIn 0.6s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.welcome-section {
  margin-bottom: 24px;
}

.welcome-card {
  background: linear-gradient(135deg, #06b6d4 0%, #6366f1 100%);
  border-radius: 20px;
  padding: 32px 40px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(99, 102, 241, 0.3);
}

.welcome-content {
  display: flex;
  align-items: center;
  gap: 20px;
  position: relative;
  z-index: 1;
}

.welcome-icon {
  width: 64px;
  height: 64px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
}

.welcome-icon svg {
  width: 40px;
  height: 40px;
}

.welcome-text h1 {
  font-size: 28px;
  font-weight: 700;
  color: #fff;
  margin: 0 0 6px 0;
}

.welcome-text p {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.85);
  margin: 0;
}

.welcome-decoration {
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.deco-circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
}

.deco-1 {
  width: 200px;
  height: 200px;
  top: -100px;
  right: -50px;
}

.deco-2 {
  width: 120px;
  height: 120px;
  bottom: -40px;
  right: 80px;
}

.deco-3 {
  width: 80px;
  height: 80px;
  top: 40px;
  right: 200px;
}

.stats-section {
  margin-bottom: 24px;
}

.stat-card {
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  min-height: 120px;
  height: 120px;
  box-sizing: border-box;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
}

.stat-card:hover::before {
  opacity: 1;
}

.stat-card.medicine::before {
  background: linear-gradient(90deg, #06b6d4, #0891b2);
}

.stat-card.batch::before {
  background: linear-gradient(90deg, #6366f1, #4f46e5);
}

.stat-card.flow::before {
  background: linear-gradient(90deg, #10b981, #059669);
}

.stat-card.user::before {
  background: linear-gradient(90deg, #f59e0b, #d97706);
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
}

.stat-card.medicine .stat-icon {
  background: linear-gradient(135deg, rgba(6, 182, 212, 0.1), rgba(6, 182, 212, 0.05));
  color: #06b6d4;
}

.stat-card.batch .stat-icon {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(99, 102, 241, 0.05));
  color: #6366f1;
}

.stat-card.flow .stat-icon {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05));
  color: #10b981;
}

.stat-card.user .stat-icon {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(245, 158, 11, 0.05));
  color: #f59e0b;
}

.stat-icon svg {
  width: 28px;
  height: 28px;
}

.stat-content {
  flex: 1;
  padding: 0 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 0;
}

.stat-value {
  font-size: 32px;
  font-weight: 800;
  color: #1e293b;
  line-height: 1.2;
  white-space: nowrap;
}

.stat-label {
  font-size: 13px;
  color: #64748b;
  font-weight: 500;
  margin-top: 4px;
  white-space: nowrap;
}

.stat-trend {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.trend-up {
  font-size: 12px;
  font-weight: 600;
  color: #10b981;
  background: rgba(16, 185, 129, 0.1);
  padding: 4px 10px;
  border-radius: 6px;
}

.content-section {
  margin-bottom: 24px;
}

.quick-section {
  margin-bottom: 24px;
}

.section-header {
  margin-bottom: 16px;
}

.section-header h3 {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.quick-card {
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 14px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  margin-bottom: 20px;
}

.quick-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
}

.quick-icon {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.quick-icon svg {
  width: 26px;
  height: 26px;
}

.quick-content {
  flex: 1;
  min-width: 0;
}

.quick-title {
  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 4px;
}

.quick-desc {
  font-size: 13px;
  color: #64748b;
  margin: 0;
}

.info-card {
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
}

.card-header {
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.warning-badge {
  background: #ef4444;
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 10px;
}

.warning-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.warning-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #fef2f2;
  border-radius: 10px;
  border-left: 3px solid #ef4444;
}

.warning-info {
  flex: 1;
  min-width: 0;
}

.warning-name {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 2px;
}

.warning-desc {
  font-size: 12px;
  color: #64748b;
  margin: 0;
}

.empty-warning {
  text-align: center;
  padding: 30px 0;
}

.empty-icon {
  font-size: 40px;
  margin-bottom: 8px;
}

.empty-text {
  font-size: 14px;
  color: #64748b;
}

.recent-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.recent-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f8fafc;
  border-radius: 10px;
  transition: all 0.2s ease;
}

.recent-item:hover {
  background: #f1f5f9;
}

.recent-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 700;
  flex-shrink: 0;
}

.recent-content {
  flex: 1;
  min-width: 0;
}

.recent-title {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 2px;
}

.recent-desc {
  font-size: 12px;
  color: #64748b;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.recent-time {
  font-size: 12px;
  color: #94a3b8;
  flex-shrink: 0;
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px;
  background: #f8fafc;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.info-item:hover {
  background: #f1f5f9;
  transform: translateX(4px);
}

.info-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.info-icon.system {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(99, 102, 241, 0.05));
  color: #6366f1;
}

.info-icon.database {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05));
  color: #10b981;
}

.info-icon.security {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(245, 158, 11, 0.05));
  color: #f59e0b;
}

.info-icon svg {
  width: 22px;
  height: 22px;
}

.info-content {
  flex: 1;
}

.info-label {
  font-size: 12px;
  color: #64748b;
  margin-bottom: 2px;
}

.info-value {
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
}

.info-value.status-good {
  color: #10b981;
}

.dashboard-mobile {
  padding: 0;
  animation: fadeInMobile 0.4s ease-out;
}

@keyframes fadeInMobile {
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