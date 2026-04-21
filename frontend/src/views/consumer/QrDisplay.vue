<template>
  <div class="qr-page">
    <div class="toast" v-if="showToast">
      {{ toastMessage }}
    </div>

    <div class="header">
      <h1>药品溯源查询</h1>
      <p>扫码验证药品真伪</p>
    </div>

    <div class="content">
      <div v-if="loading" class="loading">
        <p>正在查询溯源信息...</p>
      </div>

      <div v-else-if="error" class="error">
        <p>{{ error }}</p>
        <button @click="handleQuery">重新查询</button>
      </div>

      <div v-else-if="traceData" class="result">
        <div class="verify-result" :class="traceData.isAuthentic ? 'success' : 'error'">
          {{ traceData.isAuthentic ? '药品验证通过' : '药品验证异常' }}
        </div>

        <div class="info-section">
          <h3>药品信息</h3>
          <div class="info-item">
            <span class="label">药品名称</span>
            <span class="value">{{ traceData.medicine?.name || '-' }}</span>
          </div>
          <div class="info-item">
            <span class="label">规格</span>
            <span class="value">{{ traceData.medicine?.specification || '-' }}</span>
          </div>
          <div class="info-item">
            <span class="label">生产厂家</span>
            <span class="value">{{ traceData.medicine?.manufacturer || '-' }}</span>
          </div>
          <div class="info-item" v-if="traceData.medicine?.approvalNumber">
            <span class="label">批准文号</span>
            <span class="value">{{ traceData.medicine.approvalNumber }}</span>
          </div>
          <div class="info-item" v-if="traceData.medicine?.storageCondition">
            <span class="label">存放条件</span>
            <span class="value">{{ traceData.medicine.storageCondition }}</span>
          </div>
          <div class="info-item" v-if="traceData.medicine?.dosage">
            <span class="label">建议用量</span>
            <span class="value">{{ traceData.medicine.dosage }}</span>
          </div>
          <div class="info-item" v-if="traceData.medicine?.shelfLife">
            <span class="label">保质期</span>
            <span class="value">{{ traceData.medicine.shelfLife }}</span>
          </div>
          <div class="info-item" v-if="traceData.medicine?.description">
            <span class="label">描述</span>
            <span class="value">{{ traceData.medicine.description }}</span>
          </div>
        </div>

        <div class="info-section">
          <h3>批次信息</h3>
          <div class="info-item">
            <span class="label">批次号</span>
            <span class="value">{{ traceData.batch?.batchNumber || '-' }}</span>
          </div>
          <div class="info-item">
            <span class="label">追溯码</span>
            <span class="value">{{ traceData.batch?.traceCode || '-' }}</span>
          </div>
          <div class="info-item">
            <span class="label">生产日期</span>
            <span class="value">{{ traceData.batch?.productionDate || '-' }}</span>
          </div>
        </div>

        <div v-if="traceData.flows && traceData.flows.length > 0" class="flow-section">
          <h3>流转轨迹 ({{ traceData.flows.length }} 条)</h3>
          <div v-for="(item, index) in sortedFlows" :key="index" class="flow-item">
            <div class="flow-time">{{ formatDateTime(item.flowTime || item.createTime) }}</div>
            <div class="flow-op">{{ item.operation }}</div>
            <div v-if="item.operator" class="flow-detail">操作人：{{ item.operator }}</div>
            <div v-if="item.fromNodeName" class="flow-detail">流出：{{ item.fromNodeName }}</div>
            <div v-if="item.toNodeName" class="flow-detail">流入：{{ item.toNodeName }}</div>
          </div>
        </div>
      </div>

      <div v-else class="input-area">
        <p>请输入追溯码</p>
        <input 
          v-model="traceCode" 
          placeholder="请输入追溯码"
          @keyup.enter="handleQuery"
        />
        <button @click="handleQuery">查询</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getTraceByCode } from '@/api/trace'

const route = useRoute()
const loading = ref(false)
const error = ref('')
const traceData = ref(null)
const traceCode = ref('')
const toastMessage = ref('')
const showToast = ref(false)

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

const showToastMessage = (msg) => {
  toastMessage.value = msg
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 2000)
}

const handleQuery = async () => {
  const code = traceCode.value || route.query.code
  if (!code) {
    showToastMessage('请输入追溯码')
    return
  }

  loading.value = true
  error.value = ''
  traceData.value = null

  try {
    const res = await getTraceByCode(code)
    if (res.code === 200) {
      traceData.value = res.data
    } else {
      error.value = res.message || '查询失败'
    }
  } catch (err) {
    console.error('查询失败:', err)
    error.value = '查询失败，请稍后重试'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (route.query.code) {
    traceCode.value = route.query.code
    handleQuery()
  }
})
</script>

<style scoped>
.qr-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  position: relative;
}

.toast {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  z-index: 9999;
  font-size: 14px;
}

.header {
  text-align: center;
  color: white;
  margin-bottom: 20px;
}

.header h1 {
  margin: 0 0 8px 0;
  font-size: 24px;
}

.header p {
  margin: 0;
  opacity: 0.9;
}

.content {
  background: white;
  border-radius: 16px;
  padding: 24px;
  max-width: 480px;
  margin: 0 auto;
}

.loading,
.error,
.input-area {
  text-align: center;
  padding: 40px 20px;
}

.verify-result {
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-weight: 600;
  text-align: center;
}

.verify-result.success {
  background: #f0f9ff;
  color: #67C23A;
}

.verify-result.error {
  background: #fef0f0;
  color: #F56C6C;
}

.info-section {
  margin-bottom: 20px;
}

.info-section h3 {
  margin: 0 0 16px 0;
  color: #303133;
  font-size: 16px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 12px 0;
  border-bottom: 1px solid #EBEEF5;
  gap: 16px;
}

.info-item:last-child {
  border-bottom: none;
}

.info-item .label {
  color: #909399;
  font-size: 14px;
  white-space: nowrap;
  flex-shrink: 0;
}

.info-item .value {
  color: #303133;
  font-size: 14px;
  font-weight: 500;
  text-align: right;
  word-break: break-word;
  flex: 1;
}

.flow-section {
  margin-top: 24px;
}

.flow-section h3 {
  margin: 0 0 16px 0;
  color: #303133;
  font-size: 16px;
}

.flow-item {
  background: #f5f7fa;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  border-left: 4px solid #E6A23C;
}

.flow-time {
  color: #909399;
  font-size: 12px;
  margin-bottom: 8px;
}

.flow-op {
  margin-bottom: 4px;
  font-weight: 500;
}

.flow-detail {
  font-size: 14px;
  color: #606266;
  margin-top: 4px;
}

input {
  width: 100%;
  padding: 12px;
  border: 1px solid #DCDFE6;
  border-radius: 8px;
  font-size: 16px;
  box-sizing: border-box;
  margin-bottom: 16px;
}

button {
  width: 100%;
  padding: 14px;
  background: #409EFF;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
}

button:hover {
  background: #66b1ff;
}
</style>
