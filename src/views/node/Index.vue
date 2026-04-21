<template>
  <div class="node-container">
    <div class="page-header">
      <div class="header-content">
        <div class="header-icon">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 12L12 16L22 6" stroke="url(#nodeGradient1)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M3 21H21" stroke="url(#nodeGradient1)" stroke-width="2" stroke-linecap="round"/>
            <defs>
              <linearGradient id="nodeGradient1" x1="3" y1="6" x2="22" y2="21">
                <stop offset="0%" stop-color="#06b6d4"/>
                <stop offset="100%" stop-color="#3b82f6"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div class="header-text">
          <h1>节点管理</h1>
          <p>管理药品流转节点信息</p>
        </div>
      </div>
      <el-button class="add-btn" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        新增节点
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
                placeholder="搜索节点名称" 
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
          <el-table-column prop="name" label="节点名称" min-width="200">
            <template #default="{ row }">
              <span class="node-name">{{ row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="type" label="节点类型" width="120">
            <template #default="{ row }">
              <el-tag :class="getTypeClass(row.type)" size="small">
                {{ getTypeText(row.type) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="关联用户(管理员)" width="180">
            <template #default="{ row }">
              <span v-if="row.contactUserName">
                <span style="font-weight: 600;">{{ row.contactUserName }}</span>
                <span v-if="row.contactUserRole" style="font-size: 12px; color: #909399; margin-left: 8px;">({{ getRoleText(row.contactUserRole) }})</span>
              </span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="地址" min-width="200" />
          <el-table-column prop="contactPerson" label="联系人" width="100" />
          <el-table-column prop="contactPhone" label="联系电话" width="120" />
          <el-table-column prop="status" label="状态" width="100">
            <template #default="{ row }">
              <el-tag :class="row.status === 'ACTIVE' ? 'tag-success' : 'tag-secondary'" size="small">
                {{ row.status === 'ACTIVE' ? '启用' : '停用' }}
              </el-tag>
            </template>
          </el-table-column>
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

      <div class="card-list-wrapper mobile-only">
        <div v-loading="loading" class="card-list">
          <div v-for="item in tableData" :key="item.id" class="data-card">
            <div class="card-header">
              <div class="card-title">
                <span class="id-badge">#{{ item.id }}</span>
                <span class="node-name">{{ item.name }}</span>
              </div>
              <div class="card-status">
                <el-tag :class="item.status === 'ACTIVE' ? 'tag-success' : 'tag-secondary'" size="small">
                  {{ item.status === 'ACTIVE' ? '启用' : '停用' }}
                </el-tag>
              </div>
            </div>
            <div class="card-body">
              <div class="card-item">
                <span class="card-label">节点类型</span>
                <el-tag :class="getTypeClass(item.type)" size="small">
                  {{ getTypeText(item.type) }}
                </el-tag>
              </div>
              <div class="card-item">
                <span class="card-label">关联用户</span>
                <span class="card-value">
                  <span v-if="item.contactUserName">
                    <span style="font-weight: 600;">{{ item.contactUserName }}</span>
                    <span v-if="item.contactUserRole" style="font-size: 12px; color: #909399; margin-left: 8px;">({{ getRoleText(item.contactUserRole) }})</span>
                  </span>
                  <span v-else>-</span>
                </span>
              </div>
              <div class="card-item">
                <span class="card-label">地址</span>
                <span class="card-value">{{ item.address || '-' }}</span>
              </div>
              <div class="card-item">
                <span class="card-label">联系人</span>
                <span class="card-value">{{ item.contactPerson || '-' }}</span>
              </div>
              <div class="card-item">
                <span class="card-label">联系电话</span>
                <span class="card-value">{{ item.contactPhone || '-' }}</span>
              </div>
              <div class="card-item">
                <span class="card-label">创建时间</span>
                <span class="card-value">{{ item.createTime || '-' }}</span>
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
    
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="600px" class="custom-dialog" :close-on-click-modal="false">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="100px" class="dialog-form">
        <el-form-item label="节点名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入节点名称" />
        </el-form-item>
        <el-form-item label="节点类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择节点类型" style="width: 100%">
            <el-option label="生产厂家" value="MANUFACTURER" />
            <el-option label="经销商" value="DISTRIBUTOR" />
            <el-option label="医院" value="HOSPITAL" />
            <el-option label="药店" value="PHARMACY" />
          </el-select>
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="form.address" placeholder="请输入地址" />
        </el-form-item>
        <el-form-item label="关联用户" prop="contactUserId">
          <el-select 
            v-model="form.contactUserId" 
            placeholder="请选择关联用户" 
            filterable 
            style="width: 100%;"
            popper-class="node-user-select"
            @change="onUserSelect"
            clearable>
            <el-option
              v-for="user in userList"
              :key="user.id"
              :label="user.realName || user.username"
              :value="user.id">
              <div class="node-user-option">
                <div class="node-user-info">
                  <span class="node-user-name">{{ user.realName || user.username }}</span>
                  <span class="node-user-username">{{ user.username }}</span>
                </div>
                <el-tag size="small" :type="getRoleTagType(user.role)">{{ getRoleText(user.role) }}</el-tag>
              </div>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="联系人" prop="contactPerson">
          <el-input v-model="form.contactPerson" placeholder="请输入联系人" />
        </el-form-item>
        <el-form-item label="联系电话" prop="contactPhone">
          <el-input v-model="form.contactPhone" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status" placeholder="请选择状态" style="width: 100%">
            <el-option label="启用" value="ACTIVE" />
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
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Search, RefreshLeft, Edit, Delete, Close, Check } from '@element-plus/icons-vue'
import { getNodePage, addNode, updateNode, deleteNode } from '@/api/node'
import { getUserList } from '@/api/user'

const tableData = ref([])
const total = ref(0)
const loading = ref(false)
const dialogVisible = ref(false)
const dialogTitle = ref('新增节点')
const formRef = ref(null)
const userList = ref([])

const queryForm = reactive({
  current: 1,
  size: 10,
  keyword: ''
})

const form = reactive({
  id: null,
  name: '',
  type: '',
  address: '',
  contactPerson: '',
  contactUserId: null,
  contactPhone: '',
  status: 'ACTIVE'
})

const rules = {
  name: [{ required: true, message: '请输入节点名称', trigger: 'blur' }],
  type: [{ required: true, message: '请选择节点类型', trigger: 'change' }]
}

const getTypeClass = (type) => {
  const classMap = {
    'MANUFACTURER': 'tag-success',
    'DISTRIBUTOR': 'tag-warning',
    'HOSPITAL': 'tag-info',
    'PHARMACY': 'tag-danger'
  }
  return classMap[type] || 'tag-secondary'
}

const getTypeText = (type) => {
  const textMap = {
    'MANUFACTURER': '生产厂家',
    'DISTRIBUTOR': '经销商',
    'HOSPITAL': '医院',
    'PHARMACY': '药店'
  }
  return textMap[type] || type
}

const getRoleText = (role) => {
  const roleMap = {
    'ADMIN': '管理员',
    'ENTERPRISE': '药品企业',
    'TERMINAL': '终端用户',
    'CONSUMER': '消费者'
  }
  return roleMap[role] || role
}

const getRoleTagType = (role) => {
  const typeMap = {
    'ADMIN': 'danger',
    'ENTERPRISE': 'warning',
    'TERMINAL': 'success',
    'CONSUMER': 'info'
  }
  return typeMap[role] || 'info'
}

const loadUserList = async () => {
  try {
    const res = await getUserList()
    if (res.code === 200) {
      userList.value = res.data || []
    }
  } catch (error) {
    console.error('加载用户列表失败:', error)
  }
}

const loadData = async () => {
  loading.value = true
  try {
    const res = await getNodePage(queryForm)
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

const onUserSelect = (userId) => {
  if (userId) {
    const selectedUser = userList.value.find(u => u.id === userId)
    if (selectedUser) {
      form.contactPerson = selectedUser.name || selectedUser.username
      form.contactPhone = selectedUser.phone || ''
    }
  }
}

const handleAdd = () => {
  dialogTitle.value = '新增节点'
  Object.assign(form, {
    id: null,
    name: '',
    type: '',
    address: '',
    contactPerson: '',
    contactUserId: null,
    contactPhone: '',
    status: 'ACTIVE'
  })
  dialogVisible.value = true
}

const handleEdit = (row) => {
  dialogTitle.value = '编辑节点'
  Object.assign(form, row)
  dialogVisible.value = true
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm('确定要删除该节点吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      customClass: 'custom-message-box'
    })
    const res = await deleteNode(row.id)
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

const handleSubmit = async () => {
  if (!formRef.value) return
  try {
    await formRef.value.validate()
    let res
    if (form.id) {
      res = await updateNode(form)
    } else {
      res = await addNode(form)
    }
    if (res.code === 200) {
      ElMessage.success(form.id ? '更新成功' : '添加成功')
      dialogVisible.value = false
      loadData()
    } else {
      ElMessage.error(res.message || '操作失败')
    }
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

onMounted(() => {
  loadData()
  loadUserList()
})
</script>

<style>
.node-user-select .node-user-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  min-width: 0;
}

.node-user-select .node-user-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex: 1;
  min-width: 0;
  margin-right: 12px;
}

.node-user-select .node-user-name {
  font-weight: 600;
  color: #303133;
  font-size: 14px;
  line-height: 1.4;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.node-user-select .node-user-username {
  font-size: 12px;
  color: #909399;
  line-height: 1.4;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>

<style scoped>
.node-container {
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

.node-name {
  font-weight: 500;
  color: #1e293b;
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

.tag-warning {
  background: linear-gradient(135deg, #fef3c7, #fde68a);
  color: #92400e;
  border: none;
  font-weight: 600;
}

.tag-info {
  background: linear-gradient(135deg, #dbeafe, #bfdbfe);
  color: #1e40af;
  border: none;
  font-weight: 600;
}

.tag-secondary {
  background: linear-gradient(135deg, #e2e8f0, #cbd5e1);
  color: #334155;
  border: none;
  font-weight: 500;
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

.card-title .node-name {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
}

.card-status {
  display: flex;
  align-items: center;
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

  .card-actions {
    flex-wrap: wrap;
  }

  .card-actions .action-btn {
    flex: 1;
    min-width: 80px;
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
