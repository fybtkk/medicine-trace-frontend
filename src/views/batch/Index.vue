<template>
  <div class="batch-container">
    <div class="page-header">
      <div class="header-content">
        <div class="header-icon">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" fill="currentColor"/>
          </svg>
        </div>
        <div class="header-text">
          <h1>批次管理</h1>
          <p>管理药品批次信息和追溯码</p>
        </div>
      </div>
      <el-button class="add-btn" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        新增批次
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
                placeholder="搜索批次号或追溯码" 
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
            :data="batchList" 
            style="width: 100%; min-width: 1000px;" 
            v-loading="loading"
            class="custom-table"
            stripe
          >
            <el-table-column prop="id" label="ID" width="100" align="center">
              <template #default="{ row }">
                <span class="id-badge">#{{ row.id }}</span>
              </template>
            </el-table-column>
            <el-table-column label="药品列表" min-width="250">
              <template #default="scope">
                <div v-if="scope.row.batchMedicines && scope.row.batchMedicines.length > 0" class="medicine-tags">
                  <el-tag v-for="(bm, index) in scope.row.batchMedicines" :key="index" type="info" size="small" class="medicine-tag">
                    {{ getMedicineName(bm.medicineId) }} × {{ bm.quantity }}
                  </el-tag>
                </div>
                <span v-else class="text-gray">-</span>
              </template>
            </el-table-column>
            <el-table-column prop="batchNumber" label="批次号" width="140">
              <template #default="scope">
                <el-tag type="primary" size="small" class="batch-tag">{{ scope.row.batchNumber }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="traceCode" label="追溯码" width="200">
              <template #default="scope">
                <el-tooltip content="点击复制追溯码" placement="top">
                  <span class="copyable" @click="copyTraceCode(scope.row.traceCode)">
                    {{ scope.row.traceCode }}
                    <el-icon class="copy-icon"><DocumentCopy /></el-icon>
                  </span>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column label="生产日期" width="120">
              <template #default="scope">
                <div class="date-cell">
                  <el-icon><Calendar /></el-icon>
                  {{ scope.row.productionDate }}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="有效期至" width="120">
              <template #default="scope">
                <div class="date-cell">
                  <el-icon><Clock /></el-icon>
                  {{ scope.row.expiryDate }}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" width="90">
              <template #default="scope">
                <el-tag :type="scope.row.status === 'ACTIVE' ? 'success' : 'info'" size="small" class="status-tag">
                  {{ scope.row.status === 'ACTIVE' ? '正常' : '停用' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="260" align="center" fixed="right">
              <template #default="scope">
                <div class="action-buttons">
                  <el-button class="action-btn qr" size="small" @click="showQrCode(scope.row)">
                    <el-icon><Picture /></el-icon>
                  </el-button>
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
        <div class="card-item" v-for="item in batchList" :key="item.id">
          <div class="card-header">
            <div class="card-title">
              <div class="name-icon">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" fill="currentColor"/>
                </svg>
              </div>
              <div class="title-text">
                <span class="batch-number-text">批次 {{ item.batchNumber }}</span>
                <span class="id-badge">#{{ item.id }}</span>
              </div>
            </div>
            <el-tag :type="item.status === 'ACTIVE' ? 'success' : 'info'" size="small" class="status-tag">
              {{ item.status === 'ACTIVE' ? '正常' : '停用' }}
            </el-tag>
          </div>
          <div class="card-content">
            <div class="medicine-section" v-if="item.batchMedicines && item.batchMedicines.length > 0">
              <div class="section-label">药品列表</div>
              <div class="medicine-tags">
                <el-tag v-for="(bm, index) in item.batchMedicines" :key="index" type="info" size="small" class="medicine-tag">
                  {{ getMedicineName(bm.medicineId) }} × {{ bm.quantity }}
                </el-tag>
              </div>
            </div>
            <div class="info-row">
              <span class="label">追溯码</span>
              <span class="value copyable" @click="copyTraceCode(item.traceCode)">
                {{ item.traceCode }}
                <el-icon class="copy-icon"><DocumentCopy /></el-icon>
              </span>
            </div>
            <div class="info-row">
              <span class="label">生产日期</span>
              <span class="value">{{ item.productionDate }}</span>
            </div>
            <div class="info-row">
              <span class="label">有效期至</span>
              <span class="value">{{ item.expiryDate }}</span>
            </div>
          </div>
          <div class="card-actions">
            <el-button class="action-btn qr" size="small" @click="showQrCode(item)">
              <el-icon><Picture /></el-icon>
              二维码
            </el-button>
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
        <el-empty v-if="batchList.length === 0 && !loading" description="暂无数据" />
      </div>

      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="queryForm.current"
          v-model:page-size="queryForm.size"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>

    <el-dialog 
      v-model="dialogVisible" 
      :title="dialogTitle" 
      width="800px"
      class="custom-dialog"
      :close-on-click-modal="false"
    >
      <el-form :model="form" label-width="100px" class="dialog-form">
        <el-form-item label="药品列表">
          <div class="medicine-list">
            <div v-for="(item, index) in form.batchMedicines" :key="index" class="medicine-item">
              <el-select v-model="item.medicineId" placeholder="选择药品" filterable class="medicine-select">
                <el-option 
                  v-for="medicine in getAvailableMedicines(index)" 
                  :key="medicine.id" 
                  :label="`${medicine.name} (${medicine.specification || '无规格'})`" 
                  :value="medicine.id" 
                />
              </el-select>
              <el-input-number v-model="item.quantity" placeholder="数量" :min="1" class="quantity-input" />
              <el-button class="remove-btn" type="danger" size="small" @click="removeMedicine(index)" :disabled="form.batchMedicines.length <= 1">
                <el-icon><Delete /></el-icon>
              </el-button>
            </div>
            <el-button class="add-medicine-btn" type="primary" size="small" @click="addMedicine" :disabled="getAvailableMedicines(-1).length === 0">
              <el-icon><Plus /></el-icon>
              添加药品
            </el-button>
          </div>
        </el-form-item>
        <el-form-item label="批次号">
          <el-input v-model="form.batchNumber" placeholder="请输入批次号" />
        </el-form-item>
        <el-form-item label="追溯码">
          <el-input v-model="form.traceCode" placeholder="请输入追溯码" />
        </el-form-item>
        <el-form-item label="生产日期">
          <el-date-picker v-model="form.productionDate" type="date" value-format="YYYY-MM-DD" placeholder="选择生产日期" />
        </el-form-item>
        <el-form-item label="有效期至">
          <el-date-picker v-model="form.expiryDate" type="date" value-format="YYYY-MM-DD" placeholder="选择有效期" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="form.status" placeholder="选择状态">
            <el-option label="正常" value="ACTIVE" />
            <el-option label="停用" value="INACTIVE" />
          </el-select>
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
    
    <el-dialog
      v-model="qrCodeDialogVisible"
      title="追溯码二维码"
      width="500px"
      class="custom-dialog qr-dialog"
      :close-on-click-modal="false"
    >
      <div v-if="currentBatch" class="qr-code-container">
        <div class="batch-info">
          <el-descriptions :column="1" border class="batch-desc">
            <el-descriptions-item label="批次号">
              <el-tag type="primary">{{ currentBatch.batchNumber }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="追溯码">
              {{ currentBatch.traceCode }}
            </el-descriptions-item>
            <el-descriptions-item label="生产日期">
              {{ currentBatch.productionDate }}
            </el-descriptions-item>
            <el-descriptions-item label="有效期至">
              {{ currentBatch.expiryDate }}
            </el-descriptions-item>
          </el-descriptions>
        </div>
        
        <div class="qr-code-wrapper">
          <div class="qr-code-box">
            <img 
              :src="qrCodeImageUrl" 
              alt="追溯码二维码"
              class="qr-image"
            />
            <p class="qr-tip">扫描二维码查询药品溯源信息</p>
          </div>
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button class="copy-btn" @click="copyTraceCode(currentBatch?.traceCode)">
            <el-icon><DocumentCopy /></el-icon>
            复制追溯码
          </el-button>
          <el-button class="download-btn" type="primary" @click="downloadQrCode">
            <el-icon><Download /></el-icon>
            下载二维码
          </el-button>
          <el-button class="cancel-btn" @click="qrCodeDialogVisible = false">关闭</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  Plus, 
  DocumentCopy, 
  Calendar, 
  Clock, 
  Picture, 
  Edit, 
  Delete,
  Download,
  Search,
  RefreshLeft,
  Close,
  Check
} from '@element-plus/icons-vue'
import { getBatchList, getBatchPage, addBatch, updateBatch, deleteBatch } from '@/api/batch'
import { getMedicineList } from '@/api/medicine'

const loading = ref(false)
const medicineList = ref([])
const batchList = ref([])
const dialogVisible = ref(false)
const dialogTitle = ref('')
const form = ref({})
const total = ref(0)

const queryForm = reactive({
  current: 1,
  size: 10,
  keyword: ''
})

const qrCodeDialogVisible = ref(false)
const currentBatch = ref(null)

const qrCodeImageUrl = computed(() => {
  if (!currentBatch.value) return ''
  const apiBaseUrl = 'http://localhost:8080'
  const webBaseUrl = window.location.origin
  return `${apiBaseUrl}/api/qrcode/batch?traceCode=${currentBatch.value.traceCode}&baseUrl=${webBaseUrl}&width=300&height=300`
})

const loadData = async () => {
  loading.value = true
  try {
    const [batchRes, medicineRes] = await Promise.all([
      getBatchPage(queryForm.current, queryForm.size, queryForm.keyword),
      getMedicineList()
    ])
    
    if (batchRes.code === 200) {
      batchList.value = batchRes.data.records || []
      total.value = batchRes.data.total || 0
    }
    
    if (medicineRes.code === 200) {
      medicineList.value = medicineRes.data || []
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

const resetQuery = () => {
  queryForm.keyword = ''
  handleQuery()
}

const handleSizeChange = (val) => {
  queryForm.size = val
  loadData()
}

const handleCurrentChange = (val) => {
  queryForm.current = val
  loadData()
}

const getMedicineName = (medicineId) => {
  const medicine = medicineList.value.find(m => m.id === medicineId)
  return medicine ? medicine.name : '未知药品'
}

const handleAdd = () => {
  dialogTitle.value = '新增批次'
  form.value = {
    batchNumber: '',
    traceCode: '',
    productionDate: '',
    expiryDate: '',
    status: 'ACTIVE',
    batchMedicines: [{ medicineId: null, quantity: 100 }]
  }
  dialogVisible.value = true
}

const handleEdit = (row) => {
  dialogTitle.value = '编辑批次'
  form.value = { ...row }
  if (!form.value.batchMedicines) {
    form.value.batchMedicines = []
  }
  dialogVisible.value = true
}

const addMedicine = () => {
  if (!form.value.batchMedicines) {
    form.value.batchMedicines = []
  }
  form.value.batchMedicines.push({ medicineId: null, quantity: 100 })
}

const removeMedicine = (index) => {
  form.value.batchMedicines.splice(index, 1)
}

const getAvailableMedicines = (currentIndex) => {
  if (!form.value.batchMedicines) return medicineList.value
  const usedMedicineIds = form.value.batchMedicines
    .filter((_, index) => index !== currentIndex)
    .map(item => item.medicineId)
    .filter(id => id !== null)
  return medicineList.value.filter(m => !usedMedicineIds.includes(m.id))
}

const handleSubmit = async () => {
  try {
    if (form.value.batchMedicines) {
      for (let i = 0; i < form.value.batchMedicines.length; i++) {
        if (!form.value.batchMedicines[i].medicineId) {
          ElMessage.warning(`请选择第 ${i + 1} 个药品`)
          return
        }
      }
    }
    
    if (form.value.id) {
      await updateBatch(form.value)
      ElMessage.success('更新成功')
    } else {
      await addBatch(form.value)
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
    await ElMessageBox.confirm('确定要删除该批次吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      customClass: 'custom-message-box'
    })
    await deleteBatch(row.id)
    ElMessage.success('删除成功')
    loadData()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

const copyTraceCode = async (traceCode) => {
  if (!traceCode) return
  try {
    await navigator.clipboard.writeText(traceCode)
    ElMessage.success('追溯码已复制到剪贴板')
  } catch (error) {
    ElMessage.error('复制失败，请手动复制')
  }
}

const showQrCode = (batch) => {
  currentBatch.value = batch
  qrCodeDialogVisible.value = true
}

const downloadQrCode = () => {
  if (!currentBatch.value) return
  
  const link = document.createElement('a')
  link.download = `追溯码_${currentBatch.value.traceCode}.jpg`
  link.href = qrCodeImageUrl.value
  link.click()
  
  ElMessage.success('二维码下载成功')
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.batch-container {
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
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  box-shadow: 0 8px 24px rgba(99, 102, 241, 0.3);
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

.medicine-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.medicine-tag {
  margin: 0;
}

.batch-tag {
  font-weight: 600;
}

.text-gray {
  color: #94a3b8;
}

.copyable {
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 10px;
  border-radius: 8px;
  transition: all 0.3s ease;
  background: #f8fafc;
  font-family: 'Monaco', 'Consolas', monospace;
  font-size: 13px;
}

.copyable:hover {
  background: rgba(99, 102, 241, 0.1);
  color: #6366f1;
}

.copy-icon {
  font-size: 14px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.copyable:hover .copy-icon {
  opacity: 1;
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

.action-buttons :deep(.el-button.qr) {
  background: rgba(6, 182, 212, 0.1) !important;
  color: #06b6d4 !important;
}

.action-buttons :deep(.el-button.qr:hover) {
  background: rgba(6, 182, 212, 0.2) !important;
  transform: scale(1.02) !important;
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

.medicine-list {
  width: 100%;
}

.medicine-item {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.medicine-select {
  flex: 1;
  min-width: 300px;
}

.quantity-input {
  width: 180px;
}

.remove-btn {
  border-radius: 10px;
}

.add-medicine-btn {
  margin-top: 8px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 6px;
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
.dialog-form :deep(.el-select__wrapper) {
  border-radius: 10px;
  box-shadow: 0 0 0 1px #e2e8f0 inset;
  transition: all 0.3s ease;
}

.dialog-form :deep(.el-input__wrapper:hover),
.dialog-form :deep(.el-select__wrapper:hover) {
  box-shadow: 0 0 0 1px #cbd5e1 inset;
}

.dialog-form :deep(.el-input__wrapper.is-focus),
.dialog-form :deep(.el-select__wrapper.is-focus) {
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

.submit-btn,
.download-btn {
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

.submit-btn:hover,
.download-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(99, 102, 241, 0.4);
}

.copy-btn {
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

.copy-btn:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
  color: #475569;
}

.qr-code-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.batch-info {
  margin-bottom: 10px;
}

.batch-desc :deep(.el-descriptions__label) {
  font-weight: 600;
  color: #475569;
}

.qr-code-wrapper {
  display: flex;
  justify-content: center;
  padding: 20px;
}

.qr-code-box {
  text-align: center;
  padding: 24px;
  background: #fff;
  border: 2px dashed #e2e8f0;
  border-radius: 16px;
}

.qr-image {
  width: 200px;
  height: 200px;
  border-radius: 8px;
}

.qr-tip {
  margin-top: 16px;
  color: #64748b;
  font-size: 14px;
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

.batch-number-text {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.medicine-section {
  margin-bottom: 10px;
}

.section-label {
  font-size: 13px;
  color: #94a3b8;
  font-weight: 500;
  margin-bottom: 8px;
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
    width: 92% !important;
    margin: 3vh auto !important;
    max-height: 90vh !important;
  }

  .custom-dialog :deep(.el-dialog__body) {
    padding: 16px;
    max-height: 70vh;
    overflow-y: auto;
  }

  .dialog-footer {
    flex-direction: column-reverse;
    gap: 8px;
  }

  .cancel-btn,
  .submit-btn,
  .copy-btn,
  .download-btn {
    width: 100%;
    justify-content: center;
  }

  .medicine-item {
    flex-direction: column;
    align-items: stretch;
  }

  .medicine-select,
  .quantity-input {
    width: 100%;
    min-width: auto;
  }

  .qr-code-container {
    gap: 16px;
  }

  .batch-info {
    margin-bottom: 8px;
  }

  .batch-desc :deep(.el-descriptions__label),
  .batch-desc :deep(.el-descriptions__content) {
    padding: 8px 10px;
    font-size: 13px;
  }

  .qr-code-wrapper {
    padding: 12px;
  }

  .qr-code-box {
    padding: 16px 12px;
  }

  .qr-image {
    width: 180px;
    height: 180px;
  }

  .qr-tip {
    margin-top: 12px;
    font-size: 13px;
  }
}
</style>
