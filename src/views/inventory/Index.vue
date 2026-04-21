<template>
  <div class="inventory-container">
    <div class="page-header">
      <div class="header-content">
        <div class="header-icon">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z" stroke="url(#inventoryGradient1)" stroke-width="2"/>
            <path d="M16 21V5C16 3.89543 15.1046 3 14 3H10C8.89543 3 8 3.89543 8 5V21" stroke="url(#inventoryGradient1)" stroke-width="2"/>
            <defs>
              <linearGradient id="inventoryGradient1" x1="2" y1="3" x2="22" y2="21">
                <stop offset="0%" stop-color="#06b6d4"/>
                <stop offset="100%" stop-color="#3b82f6"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div class="header-text">
          <h1>库存管理</h1>
          <p>管理药品库存信息，实时监控库存状态</p>
        </div>
      </div>
      <el-button class="add-btn" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        新增库存
      </el-button>
    </div>

    <el-tabs v-model="activeTab" class="custom-tabs">
      <el-tab-pane label="库存明细" name="detail">
        <div class="content-card">
          <div class="search-section">
            <el-form :inline="true" :model="queryForm" class="search-form">
              <el-form-item>
                <div class="search-input-wrapper">
                  <el-icon class="search-icon"><Search /></el-icon>
                  <el-input 
                    v-model="queryForm.keyword" 
                    placeholder="搜索追溯码" 
                    clearable 
                    class="search-input"
                    @keyup.enter="handleQuery"
                  />
                </div>
              </el-form-item>
              <el-form-item>
                <el-button class="search-btn" type="primary" @click="handleQuery">
                  <el-icon><Search /></el-icon>
                  查询
                </el-button>
                <el-button class="reset-btn" @click="resetQuery">
                  <el-icon><RefreshLeft /></el-icon>
                  重置
                </el-button>
              </el-form-item>
            </el-form>
          </div>

          <div class="table-wrapper desktop-only">
            <div class="table-responsive">
              <el-table 
                :data="tableData" 
                style="width: 100%; min-width: 900px;" 
                v-loading="loading"
                class="custom-table"
                stripe
              >
                <el-table-column prop="id" label="ID" width="100" align="center">
                  <template #default="{ row }">
                    <span class="id-badge">#{{ row.id }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="nodeName" label="所在节点" min-width="150">
                  <template #default="{ row }">
                    <el-tag v-if="row.nodeName" size="small" type="warning">{{ row.nodeName }}</el-tag>
                    <span v-else>-</span>
                  </template>
                </el-table-column>
                <el-table-column prop="medicineName" label="药品名称" min-width="150">
                  <template #default="{ row }">
                    <span class="medicine-name">{{ row.medicineName || '-' }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="batchNumber" label="批次号" min-width="150">
                  <template #default="{ row }">
                    <el-tag size="small" type="info">{{ row.batchNumber || '-' }}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="batchTraceCode" label="追溯码" min-width="200">
                  <template #default="{ row }">
                    <span class="trace-code">{{ row.batchTraceCode || row.traceCode || '-' }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="quantity" label="库存数量" width="120">
                  <template #default="{ row }">
                    <el-tag :class="row.quantity <= row.warningThreshold ? 'tag-danger' : 'tag-success'" size="small">
                      {{ row.quantity }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="warningThreshold" label="预警阈值" width="100" />
                <el-table-column prop="createTime" label="创建时间" width="180" />
                <el-table-column label="操作" width="260" fixed="right">
                  <template #default="{ row }">
                    <div class="action-buttons">
                      <el-button class="action-btn edit" size="small" @click="handleEdit(row)">
                        <el-icon><Edit /></el-icon>
                      </el-button>
                      <el-button class="action-btn delete" size="small" @click="handleDelete(row)">
                        <el-icon><Delete /></el-icon>
                      </el-button>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
              </div>
            </div>

          <div class="card-list mobile-only" v-loading="loading">
            <div class="card-item" v-for="item in tableData" :key="item.id">
              <div class="card-header">
                <div class="card-title">
                  <div class="name-icon">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z" stroke="url(#inventoryGradient2)" stroke-width="2"/>
                      <path d="M16 21V5C16 3.89543 15.1046 3 14 3H10C8.89543 3 8 3.89543 8 5V21" stroke="url(#inventoryGradient2)" stroke-width="2"/>
                      <defs>
                        <linearGradient id="inventoryGradient2" x1="2" y1="3" x2="22" y2="21">
                          <stop offset="0%" stop-color="#06b6d4"/>
                          <stop offset="100%" stop-color="#3b82f6"/>
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                  <div class="title-text">
                    <span class="medicine-name-text">{{ item.medicineName || '未知药品' }}</span>
                    <span class="id-badge">#{{ item.id }}</span>
                  </div>
                </div>
                <el-tag :class="item.quantity <= item.warningThreshold ? 'tag-danger' : 'tag-success'" size="small">
                  {{ item.quantity }}
                </el-tag>
              </div>
              <div class="card-content">
                <div class="info-row">
                  <span class="label">所在节点</span>
                  <span class="value">
                    <el-tag v-if="item.nodeName" size="small" type="warning">{{ item.nodeName }}</el-tag>
                    <span v-else>-</span>
                  </span>
                </div>
                <div class="info-row">
                  <span class="label">批次号</span>
                  <span class="value">{{ item.batchNumber || '-' }}</span>
                </div>
                <div class="info-row">
                  <span class="label">追溯码</span>
                  <span class="value trace-code">{{ item.batchTraceCode || item.traceCode || '-' }}</span>
                </div>
                <div class="info-row">
                  <span class="label">预警阈值</span>
                  <span class="value">{{ item.warningThreshold }}</span>
                </div>
                <div class="info-row">
                  <span class="label">创建时间</span>
                  <span class="value">{{ item.createTime }}</span>
                </div>
              </div>
              <div class="card-actions">
                <el-button class="action-btn edit" size="small" @click="handleEdit(item)">
                  <el-icon><Edit /></el-icon>
                  编辑
                </el-button>
                <el-button class="action-btn delete" size="small" @click="handleDelete(item)">
                  <el-icon><Delete /></el-icon>
                  删除
                </el-button>
              </div>
            </div>
            <el-empty v-if="tableData.length === 0 && !loading" description="暂无数据" />
          </div>

          <div class="pagination-wrapper">
            <el-pagination
              v-model:current-page="queryForm.current"
              v-model:page-size="queryForm.size"
              :total="total"
              :page-sizes="[10, 20, 50, 100]"
              layout="total, sizes, prev, pager, next, jumper"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </div>
        </div>
      </el-tab-pane>
      
      <el-tab-pane label="库存汇总" name="summary">
        <div class="content-card">
          <div class="summary-header">
            <h3 class="summary-title">药品库存汇总</h3>
            <el-button class="search-btn" type="primary" @click="loadSummary">
              <el-icon><Refresh /></el-icon>
              刷新
            </el-button>
          </div>
          
          <div class="table-wrapper desktop-only">
            <div class="table-responsive">
              <el-table :data="summaryData" style="width: 100%; min-width: 800px;" class="custom-table" stripe>
                <el-table-column prop="medicineName" label="药品名称" min-width="200" />
                <el-table-column prop="specification" label="规格" min-width="200" />
                <el-table-column prop="manufacturer" label="生产厂家" min-width="250" />
                <el-table-column prop="totalQuantity" label="总库存" width="150">
                  <template #default="{ row }">
                    <el-tag class="tag-success" size="small">
                      {{ row.totalQuantity }}
                    </el-tag>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>

          <div class="card-list mobile-only">
            <div class="card-item" v-for="(item, index) in summaryData" :key="index">
              <div class="card-header">
                <div class="card-title">
                  <div class="title-text">
                    <span class="medicine-name-text">{{ item.medicineName }}</span>
                  </div>
                </div>
                <el-tag class="tag-success" size="small">{{ item.totalQuantity }}</el-tag>
              </div>
              <div class="card-content">
                <div class="info-row">
                  <span class="label">规格</span>
                  <span class="value">{{ item.specification || '-' }}</span>
                </div>
                <div class="info-row">
                  <span class="label">生产厂家</span>
                  <span class="value">{{ item.manufacturer || '-' }}</span>
                </div>
              </div>
            </div>
            <el-empty v-if="summaryData.length === 0" description="暂无库存数据" />
          </div>
          
          <div v-if="summaryData.length === 0" class="empty-state desktop-only">
            <el-empty description="暂无库存数据" />
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px" class="custom-dialog" :close-on-click-modal="false">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="100px" class="dialog-form">
        <el-form-item label="药品ID" prop="medicineId">
          <el-input v-model="form.medicineId" placeholder="请输入药品ID" />
        </el-form-item>
        <el-form-item label="批次ID" prop="batchId">
          <el-input v-model="form.batchId" placeholder="请输入批次ID" />
        </el-form-item>
        <el-form-item label="追溯码" prop="traceCode">
          <el-input v-model="form.traceCode" placeholder="请输入追溯码" />
        </el-form-item>
        <el-form-item label="库存数量" prop="quantity">
          <el-input-number v-model="form.quantity" :min="0" style="width: 100%" />
        </el-form-item>
        <el-form-item label="预警阈值" prop="warningThreshold">
          <el-input-number v-model="form.warningThreshold" :min="0" style="width: 100%" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button class="cancel-btn" @click="dialogVisible = false">
            <el-icon><Close /></el-icon>
            取消
          </el-button>
          <el-button class="submit-btn" type="primary" @click="handleSubmit">
            <el-icon><Check /></el-icon>
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Search, RefreshLeft, Edit, Delete, Close, Check, Refresh } from '@element-plus/icons-vue'
import { getInventoryPage, getInventorySummary, addInventory, updateInventory, deleteInventory } from '@/api/inventory'

const tableData = ref([])
const summaryData = ref([])
const total = ref(0)
const loading = ref(false)
const dialogVisible = ref(false)
const dialogTitle = ref('新增库存')
const formRef = ref(null)
const activeTab = ref('detail')

const queryForm = reactive({
  current: 1,
  size: 10,
  keyword: ''
})

const form = reactive({
  id: null,
  medicineId: null,
  batchId: null,
  traceCode: '',
  quantity: 0,
  warningThreshold: 10
})

const rules = {
  medicineId: [{ required: true, message: '请输入药品ID', trigger: 'blur' }],
  batchId: [{ required: true, message: '请输入批次ID', trigger: 'blur' }],
  traceCode: [{ required: true, message: '请输入追溯码', trigger: 'blur' }],
  quantity: [{ required: true, message: '请输入库存数量', trigger: 'blur' }],
  warningThreshold: [{ required: true, message: '请输入预警阈值', trigger: 'blur' }]
}

const loadData = async () => {
  loading.value = true
  try {
    const res = await getInventoryPage(queryForm)
    if (res.code === 200) {
      tableData.value = res.data.records
      total.value = res.data.total
    }
  } catch (error) {
    ElMessage.error('加载数据失败')
  } finally {
    loading.value = false
  }
}

const loadSummary = async () => {
  try {
    const res = await getInventorySummary()
    if (res.code === 200) {
      summaryData.value = res.data
    }
  } catch (error) {
    ElMessage.error('加载汇总数据失败')
  }
}

const handleQuery = () => {
  queryForm.current = 1
  loadData()
}

const handleSizeChange = (size) => {
  queryForm.size = size
  loadData()
}

const handleCurrentChange = (current) => {
  queryForm.current = current
  loadData()
}

const resetQuery = () => {
  queryForm.keyword = ''
  handleQuery()
}

const handleAdd = () => {
  dialogTitle.value = '新增库存'
  Object.assign(form, {
    id: null,
    medicineId: null,
    batchId: null,
    traceCode: '',
    quantity: 0,
    warningThreshold: 10
  })
  dialogVisible.value = true
}

const handleEdit = (row) => {
  dialogTitle.value = '编辑库存'
  Object.assign(form, row)
  dialogVisible.value = true
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm('确定要删除该库存记录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      customClass: 'custom-message-box'
    })
    const res = await deleteInventory(row.id)
    if (res.code === 200) {
      ElMessage.success('删除成功')
      loadData()
      if (activeTab.value === 'summary') {
        loadSummary()
      }
    } else {
      ElMessage.error(res.message || '删除失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

const handleSubmit = async () => {
  if (!formRef.value) return
  try {
    await formRef.value.validate()
    let res
    if (form.id) {
      res = await updateInventory(form)
    } else {
      res = await addInventory(form)
    }
    if (res.code === 200) {
      ElMessage.success(form.id ? '更新成功' : '添加成功')
      dialogVisible.value = false
      loadData()
      if (activeTab.value === 'summary') {
        loadSummary()
      }
    } else {
      ElMessage.error(res.message || '操作失败')
    }
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

onMounted(() => {
  loadData()
  loadSummary()
})
</script>

<style scoped>
.inventory-container {
  padding: 0;
  animation: fadeIn 0.5s ease-out;
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

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-icon {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  box-shadow: 0 8px 24px rgba(6, 182, 212, 0.3);
}

.header-icon svg {
  width: 28px;
  height: 28px;
}

.header-text h1 {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 4px 0;
}

.header-text p {
  font-size: 14px;
  color: #64748b;
  margin: 0;
}

.add-btn {
  padding: 12px 24px;
  border-radius: 12px;
  background: linear-gradient(135deg, #06b6d4 0%, #6366f1 100%);
  border: none;
  font-weight: 600;
  box-shadow: 0 4px 16px rgba(99, 102, 241, 0.3);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.add-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(99, 102, 241, 0.4);
}

.custom-tabs {
  margin-bottom: 24px;
}

.custom-tabs :deep(.el-tabs__header) {
  margin: 0;
  border-bottom: 2px solid #f1f5f9;
}

.custom-tabs :deep(.el-tabs__nav-wrap::after) {
  display: none;
}

.custom-tabs :deep(.el-tabs__item) {
  font-size: 14px;
  font-weight: 500;
  padding: 12px 24px;
  color: #64748b;
  transition: all 0.3s ease;
}

.custom-tabs :deep(.el-tabs__item:hover) {
  color: #6366f1;
}

.custom-tabs :deep(.el-tabs__item.is-active) {
  color: #6366f1;
  font-weight: 600;
}

.custom-tabs :deep(.el-tabs__active-bar) {
  background: linear-gradient(90deg, #06b6d4, #6366f1);
  height: 3px;
  border-radius: 3px 3px 0 0;
}

.content-card {
  background: #fff;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
}

.search-section {
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid #f1f5f9;
}

.search-form {
  margin: 0;
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 14px;
  color: #94a3b8;
  font-size: 18px;
  z-index: 1;
}

.search-input {
  padding-left: 44px;
}

.search-input :deep(.el-input__wrapper) {
  border-radius: 12px;
  box-shadow: 0 0 0 1px #e2e8f0 inset;
  transition: all 0.3s ease;
}

.search-input :deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px #cbd5e1 inset;
}

.search-input :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2) inset;
}

.search-btn {
  padding: 10px 20px;
  border-radius: 10px;
  background: linear-gradient(135deg, #06b6d4 0%, #6366f1 100%);
  border: none;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
}

.reset-btn {
  padding: 10px 20px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  background: #fff;
  color: #64748b;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.3s ease;
}

.reset-btn:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
  color: #475569;
}

.table-wrapper {
  margin-bottom: 24px;
}

.table-responsive {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  border-radius: 12px;
}

.custom-table {
  border-radius: 12px;
  overflow: hidden;
}

.custom-table :deep(.el-table__header-wrapper) {
  background: #f8fafc;
}

.custom-table :deep(.el-table__header th) {
  background: #f8fafc;
  color: #64748b;
  font-weight: 600;
  font-size: 13px;
  border: none;
  padding: 16px 20px;
}

.custom-table :deep(.el-table__body td) {
  border: none;
  padding: 16px 20px;
}

.custom-table :deep(.el-table__row) {
  transition: all 0.2s ease;
}

.custom-table :deep(.el-table__row:hover) {
  background: #f8fafc;
}

.id-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 44px;
  height: 28px;
  padding: 0 10px;
  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
  color: #475569;
  border-radius: 8px;
  font-weight: 600;
  font-size: 13px;
  white-space: nowrap;
  flex-shrink: 0;
  box-sizing: border-box;
  width: auto;
  max-width: 100%;
}

.medicine-name {
  font-weight: 500;
  color: #1e293b;
}

.trace-code {
  font-family: 'Monaco', 'Consolas', monospace;
  font-size: 13px;
  color: #475569;
  background: #f8fafc;
  padding: 4px 10px;
  border-radius: 6px;
}

.tag-success {
  background: linear-gradient(135deg, #d1fae5, #a7f3d0);
  color: #065f46;
  border: none;
  font-weight: 600;
}

.tag-danger {
  background: linear-gradient(135deg, #fee2e2, #fecaca);
  color: #991b1b;
  border: none;
  font-weight: 600;
}

.summary-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid #f1f5f9;
}

.summary-title {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.empty-state {
  text-align: center;
  padding: 48px;
}

.action-buttons {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.action-buttons :deep(.el-button),
.action-buttons :deep(.el-button--small) {
  padding: 8px 12px !important;
  border-radius: 10px !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 6px !important;
  transition: all 0.3s ease !important;
  border: none !important;
  font-weight: 500 !important;
  white-space: nowrap !important;
  flex-shrink: 0 !important;
  min-width: 40px !important;
  width: auto !important;
  height: 32px !important;
  box-sizing: border-box !important;
  line-height: 1 !important;
  font-size: 14px !important;
}

.action-buttons :deep(.el-button .el-icon),
.action-buttons :deep(.el-button--small .el-icon) {
  font-size: 16px !important;
}

.action-buttons :deep(.el-button.edit) {
  background: rgba(99, 102, 241, 0.1) !important;
  color: #6366f1 !important;
}

.action-buttons :deep(.el-button.edit:hover) {
  background: rgba(99, 102, 241, 0.2) !important;
  transform: scale(1.02) !important;
}

.action-buttons :deep(.el-button.delete) {
  background: rgba(239, 68, 68, 0.1) !important;
  color: #ef4444 !important;
}

.action-buttons :deep(.el-button.delete:hover) {
  background: rgba(239, 68, 68, 0.2) !important;
  transform: scale(1.02) !important;
}

.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  padding-top: 8px;
}

.pagination-wrapper :deep(.el-pagination) {
  display: flex;
  align-items: center;
}

.pagination-wrapper :deep(.el-pager li) {
  border-radius: 8px;
  font-weight: 500;
}

.pagination-wrapper :deep(.el-pager li.is-active) {
  background: linear-gradient(135deg, #06b6d4 0%, #6366f1 100%);
  color: #fff;
}

.pagination-wrapper :deep(.btn-prev),
.pagination-wrapper :deep(.btn-next) {
  border-radius: 8px;
}

.custom-dialog :deep(.el-dialog__header) {
  padding: 24px 24px 16px;
  border-bottom: 1px solid #f1f5f9;
}

.custom-dialog :deep(.el-dialog__title) {
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
}

.custom-dialog :deep(.el-dialog__body) {
  padding: 24px;
}

.dialog-form :deep(.el-form-item__label) {
  font-weight: 600;
  color: #475569;
}

.dialog-form :deep(.el-input__wrapper),
.dialog-form :deep(.el-textarea__inner) {
  border-radius: 10px;
  box-shadow: 0 0 0 1px #e2e8f0 inset;
  transition: all 0.3s ease;
}

.dialog-form :deep(.el-input__wrapper:hover),
.dialog-form :deep(.el-textarea__inner:hover) {
  box-shadow: 0 0 0 1px #cbd5e1 inset;
}

.dialog-form :deep(.el-input__wrapper.is-focus),
.dialog-form :deep(.el-textarea__inner:focus) {
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2) inset;
}

.custom-dialog :deep(.el-dialog__footer) {
  padding: 16px 24px 24px;
  border-top: 1px solid #f1f5f9;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.cancel-btn {
  padding: 10px 24px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  background: #fff;
  color: #64748b;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.3s ease;
}

.cancel-btn:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
  color: #475569;
}

.submit-btn {
  padding: 10px 24px;
  border-radius: 10px;
  background: linear-gradient(135deg, #06b6d4 0%, #6366f1 100%);
  border: none;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
  transition: all 0.3s ease;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(99, 102, 241, 0.4);
}

.desktop-only {
  display: block;
}

.mobile-only {
  display: none;
}

.card-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
}

.card-item {
  background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 16px;
  transition: all 0.3s ease;
}

.card-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  border-color: #cbd5e1;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
  gap: 12px;
}

.card-title {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 0;
}

.title-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  min-width: 0;
}

.medicine-name-text {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.name-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3b82f6;
  flex-shrink: 0;
}

.card-content {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.info-row {
  display: flex;
  gap: 12px;
  align-items: center;
}

.info-row .label {
  font-size: 13px;
  color: #94a3b8;
  font-weight: 500;
  min-width: 80px;
  flex-shrink: 0;
}

.info-row .value {
  font-size: 14px;
  color: #475569;
  flex: 1;
  word-break: break-word;
}

.card-actions {
  display: flex;
  gap: 12px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #f1f5f9;
}

.card-actions .action-btn {
  flex: 1;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    flex-wrap: wrap;
    gap: 16px;
  }

  .header-icon {
    width: 48px;
    height: 48px;
  }

  .header-icon svg {
    width: 24px;
    height: 24px;
  }

  .header-text h1 {
    font-size: 20px;
  }

  .add-btn {
    width: 100%;
    justify-content: center;
  }

  .content-card {
    padding: 16px;
    border-radius: 16px;
  }

  .search-form :deep(.el-form-item) {
    width: 100%;
  }

  .desktop-only {
    display: none;
  }

  .mobile-only {
    display: flex;
  }

  .pagination-wrapper {
    justify-content: center;
  }

  .pagination-wrapper :deep(.el-pagination) {
    justify-content: center;
    flex-wrap: wrap;
  }

  .custom-dialog :deep(.el-dialog) {
    width: 90% !important;
    margin: 5vh auto !important;
  }

  .dialog-footer {
    flex-direction: column-reverse;
  }

  .cancel-btn,
  .submit-btn {
    width: 100%;
    justify-content: center;
  }

  .custom-tabs :deep(.el-tabs__item) {
    padding: 12px 16px;
    font-size: 13px;
  }

  .summary-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .search-btn {
    width: 100%;
    justify-content: center;
  }

  .empty-state {
    padding: 32px 16px;
  }
}
</style>
