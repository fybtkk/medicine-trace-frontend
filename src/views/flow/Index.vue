<template>
  <div class="flow-container">
    <div class="page-header">
      <div class="header-content">
        <div class="header-icon">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99z" fill="currentColor"/>
          </svg>
        </div>
        <div class="header-text">
          <h1>流转管理</h1>
          <p>管理药品流转记录和状态</p>
        </div>
      </div>
      <el-button class="add-btn" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        新增流转
      </el-button>
    </div>

    <div class="content-card">
      <div class="search-section">
        <el-form :inline="true" :model="queryForm" class="search-form">
          <el-form-item>
            <div class="search-input-wrapper">
              <el-icon class="search-icon"><Search /></el-icon>
              <el-input 
                v-model="queryForm.keyword" 
                placeholder="搜索追溯码或操作人" 
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
            :data="flowList" 
            style="width: 100%; min-width: 950px;" 
            v-loading="loading"
            class="custom-table"
            stripe
          >
          <el-table-column prop="id" label="ID" width="100" align="center">
            <template #default="{ row }">
              <span class="id-badge">#{{ row.id }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="traceCode" label="追溯码" min-width="200">
            <template #default="{ row }">
              <span class="trace-code">{{ row.traceCode }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="fromNodeName" label="流出节点" width="150">
            <template #default="{ row }">
              <div class="node-cell from">
                <el-icon><ArrowRight /></el-icon>
                {{ row.fromNodeName }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="toNodeName" label="流入节点" width="150">
            <template #default="{ row }">
              <div class="node-cell to">
                <el-icon><ArrowLeft /></el-icon>
                {{ row.toNodeName }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="flowTime" label="流转时间" width="180">
            <template #default="{ row }">
              <div class="date-cell">
                <el-icon><Calendar /></el-icon>
                {{ row.flowTime }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="operator" label="操作人" width="100">
            <template #default="{ row }">
              <el-tag size="small" type="primary">{{ row.operator }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="100">
            <template #default="{ row }">
              <el-tag 
                :type="getStatusType(row.status)" 
                size="small"
                class="status-tag"
              >
                {{ row.status }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="260" align="center" fixed="right">
            <template #default="scope">
              <div class="action-buttons">
                <el-button class="action-btn edit" size="small" @click="handleEdit(scope.row)">
                  <el-icon><Edit /></el-icon>
                </el-button>
                <el-button class="action-btn delete" size="small" @click="handleDelete(scope.row)">
                  <el-icon><Delete /></el-icon>
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
        </div>
      </div>

      <div class="card-list mobile-only" v-loading="loading">
        <div class="card-item" v-for="item in flowList" :key="item.id">
          <div class="card-header">
            <span class="card-id">#{{ item.id }}</span>
            <el-tag :type="getStatusType(item.status)" size="small" class="card-status">
              {{ item.status }}
            </el-tag>
          </div>
          <div class="card-content">
            <div class="info-row">
              <span class="label">追溯码</span>
              <span class="value trace-code">{{ item.traceCode }}</span>
            </div>
            <div class="info-row">
              <span class="label">流出节点</span>
              <span class="value node-from">
                <el-icon><ArrowRight /></el-icon>
                {{ item.fromNodeName }}
              </span>
            </div>
            <div class="info-row">
              <span class="label">流入节点</span>
              <span class="value node-to">
                <el-icon><ArrowLeft /></el-icon>
                {{ item.toNodeName }}
              </span>
            </div>
            <div class="info-row">
              <span class="label">流转时间</span>
              <span class="value">
                <el-icon><Calendar /></el-icon>
                {{ item.flowTime }}
              </span>
            </div>
            <div class="info-row">
              <span class="label">操作人</span>
              <el-tag size="small" type="primary">{{ item.operator }}</el-tag>
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
        <el-empty v-if="flowList.length === 0 && !loading" description="暂无数据" />
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

    <el-dialog 
      v-model="dialogVisible" 
      :title="dialogTitle" 
      width="600px"
      class="custom-dialog"
      :close-on-click-modal="false"
    >
      <el-form :model="form" label-width="100px" class="dialog-form">
        <el-form-item label="批次ID">
          <el-input-number v-model="form.batchId" :min="1" class="full-width" />
        </el-form-item>
        <el-form-item label="追溯码">
          <el-input v-model="form.traceCode" placeholder="请输入追溯码" />
        </el-form-item>
        <el-form-item label="流出节点ID">
          <el-input-number v-model="form.fromNodeId" :min="1" class="full-width" />
        </el-form-item>
        <el-form-item label="流出节点名称">
          <el-input v-model="form.fromNodeName" placeholder="请输入流出节点名称" />
        </el-form-item>
        <el-form-item label="流入节点ID">
          <el-input-number v-model="form.toNodeId" :min="1" class="full-width" />
        </el-form-item>
        <el-form-item label="流入节点名称">
          <el-input v-model="form.toNodeName" placeholder="请输入流入节点名称" />
        </el-form-item>
        <el-form-item label="流转时间">
          <el-date-picker 
            v-model="form.flowTime" 
            type="datetime" 
            value-format="YYYY-MM-DD HH:mm:ss" 
            placeholder="选择流转时间"
            class="full-width"
          />
        </el-form-item>
        <el-form-item label="操作人">
          <el-input v-model="form.operator" placeholder="请输入操作人" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="form.status" placeholder="选择状态" class="full-width">
            <el-option label="待入库" value="待入库" />
            <el-option label="已完成" value="已完成" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.remark" type="textarea" :rows="3" placeholder="请输入备注" />
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
import { Plus, Edit, Delete, Close, Check, Calendar, ArrowRight, ArrowLeft, Search, RefreshLeft } from '@element-plus/icons-vue'
import { getFlowList, addFlow, updateFlow, deleteFlow } from '@/api/flow'

const loading = ref(false)
const flowList = ref([])
const dialogVisible = ref(false)
const dialogTitle = ref('')
const form = ref({})
const total = ref(0)

const queryForm = reactive({
  current: 1,
  size: 10,
  keyword: ''
})

const getStatusType = (status) => {
  if (status === '已完成') return 'success'
  if (status === '待入库') return 'warning'
  return 'info'
}

const loadData = async () => {
  loading.value = true
  try {
    const res = await getFlowList()
    flowList.value = res.data || []
  } catch (error) {
    ElMessage.error('加载数据失败')
  } finally {
    loading.value = false
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
  dialogTitle.value = '新增流转'
  form.value = {
    batchId: 1,
    traceCode: '',
    fromNodeId: 1,
    fromNodeName: '',
    toNodeId: 2,
    toNodeName: '',
    flowTime: '',
    operator: 'admin',
    status: '待入库',
    remark: ''
  }
  dialogVisible.value = true
}

const handleEdit = (row) => {
  dialogTitle.value = '编辑流转'
  form.value = { ...row }
  dialogVisible.value = true
}

const handleSubmit = async () => {
  try {
    if (form.value.id) {
      await updateFlow(form.value)
      ElMessage.success('更新成功')
    } else {
      await addFlow(form.value)
      ElMessage.success('添加成功')
    }
    dialogVisible.value = false
    loadData()
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm('确定要删除该流转记录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      customClass: 'custom-message-box'
    })
    await deleteFlow(row.id)
    ElMessage.success('删除成功')
    loadData()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.flow-container {
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
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  box-shadow: 0 8px 24px rgba(16, 185, 129, 0.3);
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

.mobile-scroll-hint {
  display: none;
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

.trace-code {
  font-family: 'Monaco', 'Consolas', monospace;
  font-size: 13px;
  color: #475569;
  background: #f8fafc;
  padding: 6px 12px;
  border-radius: 8px;
}

.node-cell {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 500;
}

.node-cell.from {
  color: #f59e0b;
}

.node-cell.to {
  color: #6366f1;
}

.date-cell {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #475569;
}

.status-tag {
  font-weight: 600;
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
  transform: scale(1.05) !important;
}

.action-buttons :deep(.el-button.delete) {
  background: rgba(239, 68, 68, 0.1) !important;
  color: #ef4444 !important;
}

.action-buttons :deep(.el-button.delete:hover) {
  background: rgba(239, 68, 68, 0.2) !important;
  transform: scale(1.05) !important;
}

.full-width {
  width: 100%;
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
  align-items: center;
  margin-bottom: 12px;
  gap: 12px;
}

.card-id {
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
}

.card-status {
  font-weight: 600;
}

.card-content {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.info-row {
  display: flex;
  gap: 12px;
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
  display: flex;
  align-items: center;
  gap: 4px;
}

.value.node-from {
  color: #f59e0b;
}

.value.node-to {
  color: #6366f1;
}

.card-actions {
  display: flex;
  gap: 12px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #f1f5f9;
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
}
</style>
