<template>
  <div class="inbound-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>入库管理</span>
          <el-button type="primary" @click="loadPendingList" :icon="Refresh">刷新</el-button>
        </div>
      </template>
      
      <el-alert
        v-if="pendingList.length === 0"
        title="暂无待入库药品"
        type="info"
        :closable="false"
        style="margin-bottom: 20px"
      />
      
      <div class="table-wrapper desktop-only">
        <el-table :data="pendingList" v-loading="loading" stripe style="width: 100%">
          <el-table-column prop="fromNodeName" label="发货方" width="150" />
          <el-table-column prop="traceCode" label="追溯码" width="200" />
          <el-table-column prop="quantity" label="数量" width="100" />
          <el-table-column prop="status" label="状态" width="100">
            <template #default="{ row }">
              <el-tag type="warning">{{ row.status }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="flowTime" label="发货时间" width="180" />
          <el-table-column label="操作" width="120">
            <template #default="{ row }">
              <el-button type="primary" size="small" @click="handleReceive(row)" :loading="row.receiving">
                确认入库
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="card-list-wrapper mobile-only">
        <div v-loading="loading" class="card-list">
          <div v-for="item in pendingList" :key="item.id" class="data-card">
            <div class="card-header">
              <div class="card-title">
                <span class="from-node">{{ item.fromNodeName }}</span>
              </div>
              <el-tag type="warning" size="small">{{ item.status }}</el-tag>
            </div>
            <div class="card-body">
              <div class="card-item">
                <span class="card-label">追溯码</span>
                <span class="card-value">{{ item.traceCode }}</span>
              </div>
              <div class="card-item">
                <span class="card-label">数量</span>
                <span class="card-value">{{ item.quantity }}</span>
              </div>
              <div class="card-item">
                <span class="card-label">发货时间</span>
                <span class="card-value">{{ item.flowTime }}</span>
              </div>
            </div>
            <div class="card-actions">
              <el-button type="primary" size="small" @click="handleReceive(item)" :loading="item.receiving">
                确认入库
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Refresh } from '@element-plus/icons-vue'
import { getPendingInbound, receiveFlow } from '@/api/flow'

const loading = ref(false)
const pendingList = ref([])

const loadPendingList = async () => {
  loading.value = true
  try {
    const res = await getPendingInbound()
    if (res.code === 200) {
      pendingList.value = res.data || []
    } else {
      ElMessage.error(res.message || '获取待入库列表失败')
    }
  } catch (error) {
    console.error('获取待入库列表失败:', error)
    ElMessage.error('获取待入库列表失败')
  } finally {
    loading.value = false
  }
}

const handleReceive = async (row) => {
  try {
    await ElMessageBox.confirm(
      `确认入库 ${row.quantity} 件药品？`,
      '确认入库',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    row.receiving = true
    const res = await receiveFlow(row.id)
    if (res.code === 200) {
      ElMessage.success('入库成功')
      loadPendingList()
    } else {
      ElMessage.error(res.message || '入库失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('入库失败:', error)
      ElMessage.error('入库失败')
    }
  } finally {
    row.receiving = false
  }
}

onMounted(() => {
  loadPendingList()
})
</script>

<style scoped>
.inbound-container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.table-wrapper {
  margin-top: 16px;
}

.card-list-wrapper {
  margin-top: 16px;
}

.card-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.data-card {
  background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 20px;
  transition: all 0.3s ease;
}

.data-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f1f5f9;
}

.card-title {
  display: flex;
  align-items: center;
}

.card-title .from-node {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
}

.card-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.card-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-label {
  font-size: 14px;
  color: #64748b;
  font-weight: 500;
}

.card-value {
  font-size: 14px;
  color: #1e293b;
  font-weight: 500;
}

.card-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #f1f5f9;
}

.card-actions .el-button {
  width: 100%;
}

@media (max-width: 768px) {
  .desktop-only {
    display: none !important;
  }

  .mobile-only {
    display: block !important;
  }

  .inbound-container {
    padding: 16px;
  }

  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .card-header .el-button {
    width: 100%;
  }
}

@media (min-width: 769px) {
  .desktop-only {
    display: block !important;
  }

  .mobile-only {
    display: none !important;
  }
}
</style>
