<template>
  <div class="consumer-trace-container">
    <el-card class="trace-card">
      <template #header>
        <div class="trace-header">
          <div class="header-icon">
            <el-icon :size="40" color="#409EFF"><Search /></el-icon>
          </div>
          <div class="header-text">
            <h2>药品溯源查询</h2>
            <p>扫描或输入追溯码，查询药品完整流转信息</p>
          </div>
        </div>
      </template>
      
      <el-form :model="queryForm" :rules="rules" ref="queryFormRef" class="search-form">
        <el-form-item label="追溯码" prop="traceCode">
          <el-input 
            v-model="queryForm.traceCode" 
            placeholder="请输入或扫描药品追溯码" 
            style="width: 100%"
            clearable
            @keyup.enter="handleQuery"
          >
            <template #prefix>
              <el-icon><Document /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery" :loading="loading">
            <el-icon><Search /></el-icon>
            查询
          </el-button>
          <el-button @click="resetForm">
            <el-icon><RefreshLeft /></el-icon>
            重置
          </el-button>
        </el-form-item>
      </el-form>
      
      <div v-if="loading" class="loading-container">
        <el-icon class="is-loading" :size="30"><Loading /></el-icon>
        <span>正在查询中，请稍候...</span>
      </div>
      
      <div v-else-if="traceData" class="trace-result">
        <el-alert
          :title="traceData.isAuthentic ? '药品验证通过' : '药品验证异常'"
          :type="traceData.isAuthentic ? 'success' : 'error'"
          :closable="false"
          :icon="traceData.isAuthentic ? CircleCheck : CircleClose"
          class="verification-alert"
        >
          <template #default>
            <div class="verification-detail">
              <p><strong>验证结果：</strong>{{ traceData.verificationResult || '该药品信息完整，可放心使用' }}</p>
              <p v-if="traceData.batch">
                <strong>当前状态：</strong>
                <el-tag :type="getStatusType(traceData.batch.status)" size="small">{{ getStatusText(traceData.batch.status) }}</el-tag>
              </p>
            </div>
          </template>
        </el-alert>
        
        <el-row :gutter="20" class="info-sections">
          <el-col :span="12">
            <el-card class="info-card" shadow="hover">
              <template #header>
                <div class="card-header-custom">
                  <el-icon color="#67C23A"><Box /></el-icon>
                  <span>药品信息</span>
                </div>
              </template>
              <el-descriptions :column="1" border v-if="traceData.medicine">
                <el-descriptions-item label="药品名称">
                  <span class="highlight-text">{{ traceData.medicine.name }}</span>
                </el-descriptions-item>
                <el-descriptions-item label="规格">{{ traceData.medicine.specification || '-' }}</el-descriptions-item>
                <el-descriptions-item label="生产厂家">{{ traceData.medicine.manufacturer || '-' }}</el-descriptions-item>
                <el-descriptions-item label="批准文号">{{ traceData.medicine.approvalNumber || '-' }}</el-descriptions-item>
                <el-descriptions-item v-if="traceData.medicine.storageCondition" label="存放条件">{{ traceData.medicine.storageCondition }}</el-descriptions-item>
                <el-descriptions-item v-if="traceData.medicine.dosage" label="建议用量">{{ traceData.medicine.dosage }}</el-descriptions-item>
                <el-descriptions-item v-if="traceData.medicine.shelfLife" label="保质期">{{ traceData.medicine.shelfLife }}</el-descriptions-item>
                <el-descriptions-item v-if="traceData.medicine.description" label="描述">{{ traceData.medicine.description }}</el-descriptions-item>
              </el-descriptions>
            </el-card>
          </el-col>
          
          <el-col :span="12">
            <el-card class="info-card" shadow="hover">
              <template #header>
                <div class="card-header-custom">
                  <el-icon color="#E6A23C"><Tickets /></el-icon>
                  <span>批次信息</span>
                </div>
              </template>
              <el-descriptions :column="1" border v-if="traceData.batch">
                <el-descriptions-item label="批次号">
                  <el-tag type="info">{{ traceData.batch.batchNumber }}</el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="追溯码">{{ traceData.batch.traceCode }}</el-descriptions-item>
                <el-descriptions-item label="生产日期">
                  <el-icon><Calendar /></el-icon>
                  {{ traceData.batch.productionDate }}
                </el-descriptions-item>
                <el-descriptions-item label="有效期至">
                  <el-icon><Clock /></el-icon>
                  {{ traceData.batch.expiryDate }}
                </el-descriptions-item>
              </el-descriptions>
            </el-card>
          </el-col>
        </el-row>
        
        <el-card class="timeline-card" shadow="hover">
          <template #header>
            <div class="card-header-custom">
              <el-icon color="#409EFF"><Guide /></el-icon>
              <span>流转轨迹</span>
              <el-tag size="small" type="info">{{ traceData.flows?.length || 0 }} 条记录</el-tag>
            </div>
          </template>
          
          <el-timeline v-if="traceData.flows && traceData.flows.length > 0" class="custom-timeline">
            <el-timeline-item
              v-for="(item, index) in sortedFlows"
              :key="index"
              :timestamp="formatDateTime(item.flowTime || item.createTime)"
              :type="getTimelineType(item.operation)"
              :size="index === 0 ? 'large' : 'normal'"
              :icon="getOperationIcon(item.operation)"
              :hollow="index !== 0"
            >
              <el-card class="timeline-item-card" :shadow="index === 0 ? 'hover' : 'never'">
                <div class="timeline-item-header">
                  <span class="operation-title">{{ item.operation }}</span>
                  <el-tag :type="getTimelineType(item.operation)" size="small">{{ item.operation }}</el-tag>
                </div>
                <div class="timeline-item-content">
                  <p v-if="item.operator">
                    <el-icon><User /></el-icon>
                    <span class="label">操作人：</span>{{ item.operator }}
                  </p>
                  <p v-if="item.fromNodeName">
                    <el-icon><ArrowRight /></el-icon>
                    <span class="label">流出：</span>{{ item.fromNodeName }}
                  </p>
                  <p v-if="item.toNodeName">
                    <el-icon><ArrowLeft /></el-icon>
                    <span class="label">流入：</span>{{ item.toNodeName }}
                  </p>
                  <p v-if="item.remark" class="remark">
                    <el-icon><ChatDotRound /></el-icon>
                    <span class="label">备注：</span>{{ item.remark }}
                  </p>
                </div>
              </el-card>
            </el-timeline-item>
          </el-timeline>
          <el-empty v-else description="暂无流转记录" :image-size="80" />
        </el-card>
      </div>
      
      <div v-else-if="queryForm.traceCode && !traceData" class="no-result">
        <el-empty description="未找到相关追溯信息，请检查追溯码是否正确" :image-size="100">
          <el-button type="primary" @click="resetForm">重新查询</el-button>
        </el-empty>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { 
  Loading, 
  Search, 
  Document, 
  RefreshLeft, 
  CircleCheck, 
  CircleClose, 
  Box, 
  Tickets, 
  Calendar, 
  Clock, 
  Guide, 
  User, 
  ArrowRight, 
  ArrowLeft, 
  ChatDotRound,
  ShoppingCart,
  Van,
  ShoppingBag
} from '@element-plus/icons-vue'
import { getTraceByCode } from '@/api/trace'
import { ElMessage } from 'element-plus'

const route = useRoute()
const queryFormRef = ref(null)
const loading = ref(false)
const traceData = ref(null)

const queryForm = reactive({
  traceCode: ''
})

const rules = {
  traceCode: [{ required: true, message: '请输入追溯码', trigger: 'blur' }]
}

const sortedFlows = computed(() => {
  if (!traceData.value?.flows) return []
  return [...traceData.value.flows].sort((a, b) => {
    const timeA = new Date(a.flowTime || a.createTime)
    const timeB = new Date(b.flowTime || b.createTime)
    return timeB - timeA
  })
})

const formatDateTime = (dateStr) => {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getStatusType = (status) => {
  const typeMap = {
    'ACTIVE': 'success',
    'INACTIVE': 'info'
  }
  return typeMap[status] || 'info'
}

const getStatusText = (status) => {
  const textMap = {
    'ACTIVE': '正常',
    'INACTIVE': '停用'
  }
  return textMap[status] || status
}

const getTimelineType = (operation) => {
  const typeMap = {
    '入库': 'success',
    '出库': 'warning',
    '销售': 'primary'
  }
  return typeMap[operation] || 'info'
}

const getOperationIcon = (operation) => {
  const iconMap = {
    '入库': ShoppingCart,
    '出库': Van,
    '销售': ShoppingBag
  }
  return iconMap[operation] || Guide
}

const handleQuery = async () => {
  if (!queryFormRef.value) return
  try {
    await queryFormRef.value.validate()
    loading.value = true
    traceData.value = null
    
    const res = await getTraceByCode(queryForm.traceCode)
    if (res.code === 200) {
      traceData.value = res.data
      ElMessage.success('查询成功')
    } else {
      ElMessage.error(res.message || '查询失败')
    }
  } catch (error) {
    console.error('查询失败:', error)
    ElMessage.error('查询失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  if (queryFormRef.value) {
    queryFormRef.value.resetFields()
  }
  traceData.value = null
}

onMounted(() => {
  const code = route.query.code
  if (code) {
    queryForm.traceCode = code
    handleQuery()
  }
})
</script>

<style scoped>
.consumer-trace-container {
  display: flex;
  justify-content: center;
  padding: 30px 20px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: calc(100vh - 60px);
}

.trace-card {
  width: 100%;
  max-width: 1000px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
}

.trace-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
}

.header-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
}

.header-text {
  text-align: left;
}

.header-text h2 {
  margin: 0;
  color: #303133;
  font-size: 24px;
  font-weight: 600;
}

.header-text p {
  margin: 4px 0 0 0;
  color: #909399;
  font-size: 14px;
}

.search-form {
  padding: 20px 0;
}

.search-form :deep(.el-form-item) {
  margin-bottom: 16px;
}

.loading-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 60px 20px;
  gap: 16px;
  color: #606266;
}

.trace-result {
  margin-top: 10px;
}

.verification-alert {
  margin-bottom: 24px;
  border-radius: 8px;
}

.verification-detail {
  margin-top: 8px;
}

.verification-detail p {
  margin: 8px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.info-sections {
  margin-bottom: 24px;
}

.info-card {
  margin-bottom: 0;
}

.card-header-custom {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #303133;
}

.highlight-text {
  font-weight: 600;
  color: #409EFF;
  font-size: 16px;
}

.timeline-card {
  margin-top: 0;
}

.custom-timeline {
  padding: 20px 10px;
}

.timeline-item-card {
  margin-bottom: 12px;
  transition: all 0.3s;
}

.timeline-item-card:hover {
  transform: translateX(4px);
}

.timeline-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #EBEEF5;
}

.operation-title {
  font-weight: 600;
  font-size: 15px;
  color: #303133;
}

.timeline-item-content p {
  margin: 8px 0;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #606266;
  font-size: 14px;
}

.timeline-item-content .label {
  color: #909399;
  min-width: 60px;
}

.timeline-item-content .remark {
  color: #909399;
  font-style: italic;
}

.no-result {
  padding: 60px 20px;
  text-align: center;
}

@media (max-width: 768px) {
  .consumer-trace-container {
    padding: 15px 10px;
  }
  
  .info-sections .el-col {
    margin-bottom: 16px;
  }
  
  .trace-header {
    flex-direction: column;
    text-align: center;
  }
  
  .header-text {
    text-align: center;
  }
}
</style>
