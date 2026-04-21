<template>
  <div class="outbound-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>出库管理</span>
          <el-button type="primary" @click="loadData" :icon="Refresh">刷新</el-button>
        </div>
      </template>
      
      <el-form :model="form" :rules="rules" ref="formRef" label-width="120px" class="outbound-form">
        <el-form-item label="收货方" prop="toNodeName">
          <el-select v-model="form.toNodeName" placeholder="请选择收货方" style="width: 100%" filterable>
            <el-option
              v-for="user in userList"
              :key="user.username"
              :label="`${user.realName} (${user.username})`"
              :value="user.username"
            />
          </el-select>
        </el-form-item>
      </el-form>
      
      <el-divider />
      
      <h4>选择要发货的药品（可多选）</h4>
      
      <div class="table-wrapper desktop-only">
        <el-table 
          :data="inventoryList" 
          style="width: 100%; margin-top: 16px" 
          @selection-change="handleSelectionChange"
          stripe
        >
          <el-table-column type="selection" width="55" />
          <el-table-column prop="medicineName" label="药品名称" width="150" />
          <el-table-column label="追溯码" width="200">
            <template #default="{ row }">
              {{ row.traceCode || row.batchTraceCode }}
            </template>
          </el-table-column>
          <el-table-column prop="batchNumber" label="批次号" width="150" />
          <el-table-column prop="quantity" label="当前库存" width="120" />
          <el-table-column label="发货数量" width="180">
            <template #default="scope">
              <el-input-number
                v-model="scope.row.sendQuantity"
                :min="1"
                :max="scope.row.quantity"
                size="small"
                style="width: 100%"
                :disabled="!selectedInventoryList.some(item => item.batchId === scope.row.batchId)"
              />
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="card-list-wrapper mobile-only">
        <div class="card-list">
          <div v-for="item in inventoryList" :key="item.batchId" class="data-card">
            <div class="card-header">
              <div class="card-title">
                <el-checkbox 
                  v-model="item.selected" 
                  @change="handleItemSelectionChange(item)"
                />
                <span class="medicine-name">{{ item.medicineName }}</span>
              </div>
            </div>
            <div class="card-body">
              <div class="card-item">
                <span class="card-label">追溯码</span>
                <span class="card-value">{{ item.traceCode || item.batchTraceCode }}</span>
              </div>
              <div class="card-item">
                <span class="card-label">批次号</span>
                <span class="card-value">{{ item.batchNumber }}</span>
              </div>
              <div class="card-item">
                <span class="card-label">当前库存</span>
                <span class="card-value">{{ item.quantity }}</span>
              </div>
              <div class="card-item" v-if="item.selected">
                <span class="card-label">发货数量</span>
                <el-input-number
                  v-model="item.sendQuantity"
                  :min="1"
                  :max="item.quantity"
                  size="small"
                  style="width: 100%"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="action-wrapper">
        <el-button @click="resetForm">重置</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="loading" :disabled="selectedInventoryList.length === 0">
          确认发货
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Refresh } from '@element-plus/icons-vue'
import { getInventoryList } from '@/api/inventory'
import { getUserList } from '@/api/user'
import { sendBatchFlow } from '@/api/flow'

const formRef = ref(null)
const loading = ref(false)
const inventoryList = ref([])
const userList = ref([])
const selectedInventoryList = ref([])

const form = reactive({
  toNodeName: ''
})

const rules = {
  toNodeName: [{ required: true, message: '请选择收货方', trigger: 'change' }]
}

const loadData = async () => {
  loading.value = true
  try {
    const [inventoryRes, userRes] = await Promise.all([
      getInventoryList(),
      getUserList()
    ])
    
    if (inventoryRes.code === 200) {
      inventoryList.value = (inventoryRes.data || [])
        .filter(item => item.quantity > 0)
        .map(item => ({
          ...item,
          sendQuantity: 1,
          selected: false
        }))
    }
    
    if (userRes.code === 200) {
      userList.value = userRes.data || []
    }
  } catch (error) {
    console.error('加载数据失败:', error)
    ElMessage.error('加载数据失败')
  } finally {
    loading.value = false
  }
}

const handleSelectionChange = (selection) => {
  selectedInventoryList.value = selection
}

const handleItemSelectionChange = (item) => {
  if (item.selected) {
    if (!selectedInventoryList.value.find(i => i.batchId === item.batchId)) {
      selectedInventoryList.value.push(item)
    }
  } else {
    selectedInventoryList.value = selectedInventoryList.value.filter(i => i.batchId !== item.batchId)
  }
}

const handleSubmit = async () => {
  if (!formRef.value) return
  try {
    await formRef.value.validate()
    
    if (selectedInventoryList.value.length === 0) {
      ElMessage.warning('请选择要发货的药品')
      return
    }
    
    for (const item of selectedInventoryList.value) {
      if (!item.sendQuantity || item.sendQuantity < 1) {
        ElMessage.warning('请设置正确的发货数量')
        return
      }
      if (item.sendQuantity > item.quantity) {
        ElMessage.warning('发货数量不能超过当前库存')
        return
      }
    }
    
    await ElMessageBox.confirm(
      `确认向 ${form.toNodeName} 发送 ${selectedInventoryList.value.length} 种药品？`,
      '确认发货',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    loading.value = true
    
    const flows = selectedInventoryList.value.map(item => ({
      batchId: item.batchId,
      quantity: item.sendQuantity,
      toNodeName: form.toNodeName
    }))
    
    const res = await sendBatchFlow(flows)
    if (res.code === 200) {
      ElMessage.success('发货成功')
      resetForm()
      loadData()
    } else {
      ElMessage.error(res.message || '发货失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('发货失败:', error)
      ElMessage.error('发货失败')
    }
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetFields()
  }
  form.toNodeName = ''
  selectedInventoryList.value = []
  inventoryList.value = inventoryList.value.map(item => ({
    ...item,
    selected: false,
    sendQuantity: 1
  }))
  loadData()
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.outbound-container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.outbound-form {
  max-width: 600px;
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
  gap: 12px;
}

.card-title .medicine-name {
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

.action-wrapper {
  margin-top: 20px;
  text-align: right;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

@media (max-width: 768px) {
  .desktop-only {
    display: none !important;
  }

  .mobile-only {
    display: block !important;
  }

  .outbound-container {
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

  .outbound-form {
    max-width: 100%;
  }

  .action-wrapper {
    flex-direction: column-reverse;
  }

  .action-wrapper .el-button {
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
