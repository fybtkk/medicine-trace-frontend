<template>
  <div class="consumer-purchase-container">
    <div class="page-header">
      <div class="header-content">
        <div class="header-icon">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.5 19.5C4.27857 19.9429 4.42857 20.4429 4.87143 20.6643C5.0894 20.7733 5.34196 20.8307 5.59683 20.8319H18.5C19.3284 20.8319 20 20.1603 20 19.3319C20 19.0689 19.9318 18.8139 19.8028 18.5919L17 13M9 22C9.55228 22 10 21.5523 10 21C10 20.4477 9.55228 20 9 20C8.44772 20 8 20.4477 8 21C8 21.5523 8.44772 22 9 22ZM18 22C18.5523 22 19 21.5523 19 21C19 20.4477 18.5523 20 18 20C17.4477 20 17 20.4477 17 21C17 21.5523 17.4477 22 18 22Z" stroke="url(#consumerGradient1)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <defs>
              <linearGradient id="consumerGradient1" x1="3" y1="3" x2="21" y2="22">
                <stop offset="0%" stop-color="#06b6d4"/>
                <stop offset="100%" stop-color="#3b82f6"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div class="header-text">
          <h1>消费者管理</h1>
          <p>管理消费者购买记录信息</p>
        </div>
      </div>
    </div>

    <div class="content-card">
      <div class="search-section">
        <el-form :inline="true" :model="queryForm" class="search-form">
          <el-form-item>
            <div class="search-input-wrapper">
              <el-icon class="search-icon"><Search /></el-icon>
              <el-input 
                v-model="queryForm.keyword" 
                placeholder="搜索消费者姓名或追溯码" 
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
          <el-table-column prop="traceCode" label="追溯码" min-width="200" show-overflow-tooltip>
            <template #default="{ row }">
              <el-tooltip content="点击复制追溯码" placement="top">
                <span class="copyable" @click="copyTraceCode(row.traceCode)">
                  <el-tag size="small" class="tag-info">{{ row.traceCode }}</el-tag>
                  <el-icon class="copy-icon"><DocumentCopy /></el-icon>
                </span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="consumerName" label="消费者姓名" width="150">
            <template #default="{ row }">
              <span class="consumer-name">{{ row.consumerName }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="medicineName" label="药品名称" min-width="200" />
          <el-table-column prop="quantity" label="数量" width="100">
            <template #default="{ row }">
              <el-tag class="tag-success" size="small">{{ row.quantity }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="purchaseTime" label="购买时间" width="180">
            <template #default="{ row }">
              {{ formatDateTime(row.purchaseTime) }}
            </template>
          </el-table-column>
          <el-table-column prop="operator" label="操作人" width="120" />
          <el-table-column label="操作" width="260" fixed="right">
            <template #default="{ row }">
              <div class="action-buttons">
                <el-button class="action-btn view" size="small" @click="handleView(row)">
                  <el-icon><View /></el-icon>
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

      <div class="card-list-wrapper mobile-only">
        <div v-loading="loading" class="card-list">
          <div v-for="item in tableData" :key="item.id" class="data-card">
            <div class="card-header">
              <div class="card-title">
                <span class="id-badge">#{{ item.id }}</span>
                <span class="consumer-name">{{ item.consumerName }}</span>
              </div>
              <el-tag class="tag-success" size="small">{{ item.quantity }}</el-tag>
            </div>
            <div class="card-body">
              <div class="card-item">
                <span class="card-label">药品名称</span>
                <span class="card-value">{{ item.medicineName || '-' }}</span>
              </div>
              <div class="card-item">
                <span class="card-label">追溯码</span>
                <span class="copyable" @click="copyTraceCode(item.traceCode)">
                  <el-tag size="small" class="tag-info">{{ item.traceCode }}</el-tag>
                  <el-icon class="copy-icon"><DocumentCopy /></el-icon>
                </span>
              </div>
              <div class="card-item">
                <span class="card-label">购买时间</span>
                <span class="card-value">{{ formatDateTime(item.purchaseTime) }}</span>
              </div>
              <div class="card-item">
                <span class="card-label">操作人</span>
                <span class="card-value">{{ item.operator || '-' }}</span>
              </div>
            </div>
            <div class="card-actions">
              <el-button class="action-btn view" size="small" @click="handleView(item)">
                <el-icon><View /></el-icon>
                查看
              </el-button>
              <el-button class="action-btn delete" size="small" @click="handleDelete(item)">
                <el-icon><Delete /></el-icon>
                删除
              </el-button>
            </div>
          </div>
          <div v-if="tableData.length === 0 && !loading" class="empty-state">
            <el-empty description="暂无数据" />
          </div>
        </div>
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
    
    <el-dialog v-model="detailDialogVisible" :title="dialogTitle" width="600px" class="custom-dialog" :close-on-click-modal="false">
      <el-descriptions :column="1" border v-if="currentDetail" class="custom-descriptions">
        <el-descriptions-item label="ID">{{ currentDetail.id }}</el-descriptions-item>
        <el-descriptions-item label="追溯码">
          <el-tag class="tag-info">{{ currentDetail.traceCode }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="消费者姓名">
          {{ currentDetail.consumerName }}
        </el-descriptions-item>
        <el-descriptions-item label="药品名称">
          {{ currentDetail.medicineName }}
        </el-descriptions-item>
        <el-descriptions-item label="数量">
          <el-tag class="tag-success">{{ currentDetail.quantity }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="购买时间">
          {{ formatDateTime(currentDetail.purchaseTime) }}
        </el-descriptions-item>
        <el-descriptions-item label="操作人">
          {{ currentDetail.operator || '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="创建时间">
          {{ formatDateTime(currentDetail.createTime) }}
        </el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <div class="dialog-footer">
          <el-button class="cancel-btn" @click="detailDialogVisible = false">
            <el-icon><Close /></el-icon>
            关闭
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { DocumentCopy, View, Delete, Search, RefreshLeft, Close } from '@element-plus/icons-vue'
import { getConsumerPurchasePage, deleteConsumerPurchase } from '@/api/consumerPurchase'

const tableData = ref([])
const total = ref(0)
const loading = ref(false)
const detailDialogVisible = ref(false)
const dialogTitle = ref('购买详情')
const currentDetail = ref(null)

const queryForm = reactive({
  current: 1,
  size: 10,
  keyword: ''
})

const loadData = async () => {
  loading.value = true
  try {
    const res = await getConsumerPurchasePage(queryForm.current, queryForm.size, queryForm.keyword)
    if (res.code === 200) {
      tableData.value = res.data.records || []
      total.value = res.data.total || 0
    }
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

const handleView = (row) => {
  currentDetail.value = row
  detailDialogVisible.value = true
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm('确定要删除该购买记录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      customClass: 'custom-message-box'
    })
    const res = await deleteConsumerPurchase(row.id)
    if (res.code === 200) {
      ElMessage.success('删除成功')
      loadData()
    } else {
      ElMessage.error(res.message || '删除失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

const copyTraceCode = async (traceCode) => {
  try {
    await navigator.clipboard.writeText(traceCode)
    ElMessage.success('追溯码已复制到剪贴板')
  } catch (error) {
    ElMessage.error('复制失败，请手动复制')
  }
}

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

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.consumer-purchase-container {
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

.consumer-name {
  font-weight: 500;
  color: #1e293b;
}

.copyable {
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.copyable:hover {
  background: rgba(99, 102, 241, 0.1);
}

.copy-icon {
  font-size: 14px;
  opacity: 0;
  transition: opacity 0.3s ease;
  color: #6366f1;
}

.copyable:hover .copy-icon {
  opacity: 1;
}

.tag-success {
  background: linear-gradient(135deg, #d1fae5, #a7f3d0);
  color: #065f46;
  border: none;
  font-weight: 600;
}

.tag-info {
  background: linear-gradient(135deg, #dbeafe, #bfdbfe);
  color: #1e40af;
  border: none;
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

.action-buttons :deep(.el-button.view) {
  background: rgba(99, 102, 241, 0.1) !important;
  color: #6366f1 !important;
}

.action-buttons :deep(.el-button.view:hover) {
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

.custom-descriptions :deep(.el-descriptions__header .el-descriptions__cell) {
  background: #f8fafc;
  font-weight: 600;
  color: #1e293b;
}

.custom-descriptions :deep(.el-descriptions__label) {
  font-weight: 600;
  color: #64748b;
  background: #f8fafc;
}

.custom-descriptions :deep(.el-descriptions__content) {
  color: #1e293b;
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

.card-list-wrapper {
  margin-bottom: 24px;
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

.card-title .id-badge {
  min-width: 40px;
}

.card-title .consumer-name {
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
  gap: 8px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #f1f5f9;
}

.card-actions .action-btn {
  width: auto;
  height: 36px;
  padding: 0 16px;
  font-size: 14px;
}

.empty-state {
  padding: 40px 0;
}

@media (max-width: 768px) {
  .desktop-only {
    display: none !important;
  }

  .mobile-only {
    display: block !important;
  }

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

  .content-card {
    padding: 16px;
    border-radius: 16px;
  }

  .search-form :deep(.el-form-item) {
    width: 100%;
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

  .cancel-btn {
    width: 100%;
    justify-content: center;
  }

  .card-actions {
    flex-wrap: wrap;
  }

  .card-actions .action-btn {
    flex: 1;
    min-width: 80px;
  }

  .custom-descriptions :deep(.el-descriptions__label),
  .custom-descriptions :deep(.el-descriptions__content) {
    padding: 12px;
    font-size: 14px;
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
