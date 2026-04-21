<template>
  <div class="flow-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>流转管理</span>
        </div>
      </template>
      
      <el-tabs v-model="activeTab" type="card">
        <el-tab-pane label="流转记录" name="record">
          <div class="tab-content">
            <el-form :inline="true" :model="searchForm" class="search-bar">
              <el-form-item label="追溯码">
                <el-input v-model="searchForm.traceCode" placeholder="请输入追溯码" clearable style="width: 200px" />
              </el-form-item>
              <el-form-item label="操作类型">
                <el-select v-model="searchForm.operation" placeholder="请选择操作类型" clearable style="width: 150px">
                  <el-option label="全部" value="" />
                  <el-option label="入库" value="入库" />
                  <el-option label="出库" value="出库" />
                  <el-option label="销售" value="销售" />
                </el-select>
              </el-form-item>
              <el-form-item label="状态">
                <el-select v-model="searchForm.status" placeholder="请选择状态" clearable style="width: 150px">
                  <el-option label="全部" value="" />
                  <el-option label="完成" value="完成" />
                  <el-option label="处理中" value="处理中" />
                </el-select>
              </el-form-item>
              <el-form-item label="时间范围">
                <el-date-picker
                  v-model="searchForm.dateRange"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  value-format="YYYY-MM-DD"
                  style="width: 300px"
                />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="handleSearch" :icon="Search">搜索</el-button>
                <el-button @click="handleResetSearch" :icon="RefreshLeft">重置</el-button>
              </el-form-item>
            </el-form>
            
            <div class="desktop-only">
              <el-table :data="flowList" style="width: 100%" v-loading="loading">
                <el-table-column prop="id" label="ID" width="100" align="center">
                  <template #default="{ row }">
                    <span class="id-badge">#{{ row.id }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="traceCode" label="追溯码" min-width="200">
                  <template #default="scope">
                    <el-tooltip content="点击复制追溯码" placement="top">
                      <span class="copyable" @click="copyTraceCode(scope.row.traceCode)">
                        {{ scope.row.traceCode }}
                        <el-icon class="copy-icon"><DocumentCopy /></el-icon>
                      </span>
                    </el-tooltip>
                  </template>
                </el-table-column>
                <el-table-column prop="operation" label="操作类型" width="100">
                  <template #default="scope">
                    <el-tag :type="getOperationType(scope.row.operation)" :icon="getOperationIcon(scope.row.operation)">
                      {{ scope.row.operation }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="fromNodeName" label="流出节点" width="120">
                  <template #default="scope">
                    <span v-if="scope.row.fromNodeName">{{ scope.row.fromNodeName }}</span>
                    <span v-else class="text-gray">-</span>
                  </template>
                </el-table-column>
                <el-table-column prop="toNodeName" label="流入节点" width="120">
                  <template #default="scope">
                    <span v-if="scope.row.toNodeName">{{ scope.row.toNodeName }}</span>
                    <span v-else class="text-gray">-</span>
                  </template>
                </el-table-column>
                <el-table-column prop="flowTime" label="流转时间" width="180">
                  <template #default="scope">
                    {{ formatDateTime(scope.row.flowTime) }}
                  </template>
                </el-table-column>
                <el-table-column prop="operator" label="操作人" width="100" />
                <el-table-column prop="status" label="状态" width="100">
                  <template #default="scope">
                    <el-tag :type="getStatusType(scope.row.status)" size="small">
                      {{ scope.row.status }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="remark" label="备注" show-overflow-tooltip>
                  <template #default="scope">
                    <el-tooltip v-if="scope.row.remark" :content="scope.row.remark" placement="top">
                      <span class="remark-text">{{ scope.row.remark }}</span>
                    </el-tooltip>
                    <span v-else class="text-gray">-</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="260" fixed="right">
                  <template #default="scope">
                    <div class="action-buttons">
                      <el-button type="primary" size="small" link @click="viewDetail(scope.row)">
                        <el-icon><View /></el-icon>
                        详情
                      </el-button>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
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
                    <span class="value copyable" @click="copyTraceCode(item.traceCode)">
                      {{ item.traceCode }}
                      <el-icon class="copy-icon"><DocumentCopy /></el-icon>
                    </span>
                  </div>
                  <div class="info-row">
                    <span class="label">操作类型</span>
                    <el-tag :type="getOperationType(item.operation)" :icon="getOperationIcon(item.operation)">
                      {{ item.operation }}
                    </el-tag>
                  </div>
                  <div class="info-row">
                    <span class="label">流出节点</span>
                    <span class="value">{{ item.fromNodeName || '-' }}</span>
                  </div>
                  <div class="info-row">
                    <span class="label">流入节点</span>
                    <span class="value">{{ item.toNodeName || '-' }}</span>
                  </div>
                  <div class="info-row">
                    <span class="label">流转时间</span>
                    <span class="value">{{ formatDateTime(item.flowTime) }}</span>
                  </div>
                  <div class="info-row">
                    <span class="label">操作人</span>
                    <span class="value">{{ item.operator }}</span>
                  </div>
                  <div class="info-row" v-if="item.remark">
                    <span class="label">备注</span>
                    <span class="value">{{ item.remark }}</span>
                  </div>
                </div>
                <div class="card-actions">
                  <el-button type="primary" size="small" @click="viewDetail(item)">
                    <el-icon><View /></el-icon>
                    详情
                  </el-button>
                </div>
              </div>
              <el-empty v-if="flowList.length === 0 && !loading" description="暂无数据" />
            </div>
            
            <div class="pagination-container">
              <el-pagination
                v-model:current-page="searchForm.current"
                v-model:page-size="searchForm.size"
                :page-sizes="[10, 20, 50, 100]"
                :total="total"
                layout="total, sizes, prev, pager, next, jumper"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
              />
            </div>
          </div>
        </el-tab-pane>
        
        <el-tab-pane label="入库管理" name="inbound">
          <div class="tab-content">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
              <span>待入库药品列表</span>
              <el-button type="primary" @click="loadPendingList" :icon="RefreshLeft">刷新</el-button>
            </div>
            
            <el-alert
              v-if="pendingList.length === 0"
              title="暂无待入库药品"
              type="info"
              :closable="false"
              style="margin-bottom: 20px"
            />
            
            <div class="desktop-only">
              <el-table :data="pendingList" v-loading="pendingLoading" stripe style="width: 100%">
                <el-table-column prop="fromNodeName" label="发货方" width="150" />
                <el-table-column prop="traceCode" label="追溯码" width="200" />
                <el-table-column prop="quantity" label="入库数量" width="120" />
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
            
            <div class="card-list mobile-only" v-loading="pendingLoading">
              <div class="card-item" v-for="item in pendingList" :key="item.id">
                <div class="card-header">
                  <span class="card-id">#{{ item.id }}</span>
                  <el-tag type="warning" size="small">{{ item.status }}</el-tag>
                </div>
                <div class="card-content">
                  <div class="info-row">
                    <span class="label">发货方</span>
                    <span class="value">{{ item.fromNodeName }}</span>
                  </div>
                  <div class="info-row">
                    <span class="label">追溯码</span>
                    <span class="value">{{ item.traceCode }}</span>
                  </div>
                  <div class="info-row">
                    <span class="label">入库数量</span>
                    <span class="value">{{ item.quantity }}</span>
                  </div>
                  <div class="info-row">
                    <span class="label">发货时间</span>
                    <span class="value">{{ item.flowTime }}</span>
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
        </el-tab-pane>
        
        <el-tab-pane label="出库管理" name="outbound">
          <div class="tab-content">
            <el-form :model="outboundForm" :rules="outboundRules" ref="outboundFormRef" label-width="120px" style="max-width: 600px">
              <el-form-item label="追溯码" prop="traceCode">
                <el-select v-model="outboundForm.traceCode" placeholder="请选择追溯码" @change="onTraceCodeChange" filterable :filter-method="filterInventory" style="width: 100%;">
                  <el-option
                    v-for="item in filteredInventoryList"
                    :key="item.id"
                    :label="item.traceCode"
                    :value="item.traceCode">
                    <div style="display: flex; flex-direction: column; min-height: 60px; padding: 8px 0;">
                      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                        <div style="display: flex; align-items: center; gap: 12px;">
                          <span style="font-weight: bold; color: #303133; font-size: 14px;">{{ item.traceCode }}</span>
                          <el-tag size="small" type="primary">{{ item.medicineName || '未命名药品' }}</el-tag>
                        </div>
                        <div style="display: flex; align-items: center;">
                          <span style="color: #909399; font-size: 13px; margin-right: 6px;">库存:</span>
                          <el-tag :type="item.quantity > 0 ? 'success' : 'danger'" size="small">{{ item.quantity }}</el-tag>
                        </div>
                      </div>
                      <div v-if="item.batchNumber" style="font-size: 12px; color: #c0c4cc;">
                        批次号: {{ item.batchNumber }}
                      </div>
                    </div>
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="当前库存" prop="currentQuantity">
                <el-tag :type="outboundForm.currentQuantity > 0 ? 'success' : 'danger'">{{ outboundForm.currentQuantity || 0 }}</el-tag>
              </el-form-item>
              <el-form-item label="出库数量" prop="quantity">
                <el-input-number v-model="outboundForm.quantity" :min="1" :max="outboundForm.currentQuantity || 1" />
              </el-form-item>
              <el-form-item label="收货节点" prop="receiver">
                <el-select v-model="outboundForm.receiverNodeId" placeholder="请选择收货节点" filterable style="width: 100%;" @change="onReceiverNodeChange">
                  <el-option
                    v-for="node in nodeList"
                    :key="node.id"
                    :label="node.name"
                    :value="node.id">
                    <span>{{ node.name }}</span>
                    <el-tag v-if="node.type" size="small" :type="getNodeTagType(node.type)" style="margin-left: 8px;">{{ getNodeTypeText(node.type) }}</el-tag>
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="备注" prop="remark">
                <el-input v-model="outboundForm.remark" type="textarea" :rows="3" placeholder="请输入备注" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="handleOutbound" :loading="outboundLoading" :disabled="!outboundForm.traceCode" :icon="Van">确认出库</el-button>
                <el-button @click="resetOutboundForm" :icon="RefreshLeft">重置</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>
        
        <el-tab-pane label="销售登记" name="sale">
          <div class="tab-content">
            <el-form :model="saleForm" :rules="saleRules" ref="saleFormRef" label-width="120px" style="max-width: 600px">
              <el-form-item label="追溯码" prop="traceCode">
                <el-select 
                  v-model="saleForm.traceCode" 
                  placeholder="请选择追溯码" 
                  filterable 
                  @change="onSaleTraceCodeChange"
                  :filter-method="filterInventory"
                  style="width: 100%"
                >
                  <el-option
                    v-for="item in filteredInventoryList"
                    :key="item.id"
                    :label="item.traceCode"
                    :value="item.traceCode"
                  >
                    <div style="display: flex; flex-direction: column; min-height: 60px; padding: 8px 0;">
                      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                        <div style="display: flex; align-items: center; gap: 12px;">
                          <span style="font-weight: bold; color: #303133; font-size: 14px;">{{ item.traceCode }}</span>
                          <el-tag size="small" type="primary">{{ item.medicineName || '未命名药品' }}</el-tag>
                        </div>
                        <div style="display: flex; align-items: center;">
                          <span style="color: #909399; font-size: 13px; margin-right: 6px;">库存:</span>
                          <el-tag :type="item.quantity > 0 ? 'success' : 'danger'" size="small">{{ item.quantity }}</el-tag>
                        </div>
                      </div>
                      <div v-if="item.batchNumber" style="font-size: 12px; color: #c0c4cc;">
                        批次号: {{ item.batchNumber }}
                      </div>
                    </div>
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="当前库存" prop="currentQuantity">
                <el-tag :type="saleForm.currentQuantity > 0 ? 'success' : 'danger'">{{ saleForm.currentQuantity || 0 }}</el-tag>
              </el-form-item>
              <el-form-item label="销售数量" prop="quantity">
                <el-input-number v-model="saleForm.quantity" :min="1" :max="saleForm.currentQuantity || 1" />
              </el-form-item>
              <el-form-item label="购买方" prop="buyer">
                <el-input v-model="saleForm.buyer" placeholder="请输入购买方" />
              </el-form-item>
              <el-form-item label="备注" prop="remark">
                <el-input v-model="saleForm.remark" type="textarea" :rows="3" placeholder="请输入备注" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="handleSale" :loading="saleLoading" :icon="ShoppingBag">确认销售</el-button>
                <el-button @click="resetSaleForm" :icon="RefreshLeft">重置</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    
    <el-dialog
      v-model="detailDialogVisible"
      title="流转详情"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-descriptions :column="1" border v-if="currentDetail">
        <el-descriptions-item label="ID">{{ currentDetail.id }}</el-descriptions-item>
        <el-descriptions-item label="追溯码">
          <el-tag type="info">{{ currentDetail.traceCode }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="操作类型">
          <el-tag :type="getOperationType(currentDetail.operation)">
            {{ currentDetail.operation }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="流出节点">
          {{ currentDetail.fromNodeName || '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="流入节点">
          {{ currentDetail.toNodeName || '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="流转时间">
          {{ formatDateTime(currentDetail.flowTime) }}
        </el-descriptions-item>
        <el-descriptions-item label="操作人">
          {{ currentDetail.operator || '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="getStatusType(currentDetail.status)" size="small">
            {{ currentDetail.status }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="备注">
          {{ currentDetail.remark || '-' }}
        </el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <el-button @click="detailDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  Search, 
  RefreshLeft, 
  DocumentCopy, 
  View,
  ShoppingCart,
  Van,
  ShoppingBag
} from '@element-plus/icons-vue'
import { getFlowList, getFlowPage, getFlowPageAdvanced, getPendingInbound, receiveFlow } from '@/api/flow'
import { getInventoryList } from '@/api/inventory'
import { getUserList } from '@/api/user'
import { getBatchList } from '@/api/batch'
import { getNodeList } from '@/api/node'
import request from '@/utils/request'

const activeTab = ref('record')
const loading = ref(false)
const flowList = ref([])
const total = ref(0)
const inventoryList = ref([])
const userList = ref([])
const batchList = ref([])
const nodeList = ref([])
const inventoryLoading = ref(false)
const batchLoading = ref(false)
const pendingList = ref([])
const pendingLoading = ref(false)

const searchForm = reactive({
  current: 1,
  size: 10,
  keyword: '',
  traceCode: '',
  operation: '',
  status: '',
  dateRange: null
})

const detailDialogVisible = ref(false)
const currentDetail = ref(null)

const inboundFormRef = ref(null)
const inboundLoading = ref(false)
const inboundForm = reactive({
  traceCode: '',
  quantity: 1,
  sender: '',
  remark: ''
})
const inboundRules = {
  traceCode: [{ required: true, message: '请输入追溯码', trigger: 'blur' }],
  quantity: [{ required: true, message: '请输入入库数量', trigger: 'blur' }],
  sender: [{ required: true, message: '请输入发货方', trigger: 'blur' }]
}

const outboundFormRef = ref(null)
const outboundLoading = ref(false)
const outboundForm = reactive({
  batchId: null,
  medicineId: null,
  traceCode: '',
  currentQuantity: 0,
  quantity: 1,
  receiver: '',
  receiverNodeId: null,
  remark: ''
})
const outboundRules = {
  traceCode: [{ required: true, message: '请选择追溯码', trigger: 'change' }],
  quantity: [{ required: true, message: '请输入出库数量', trigger: 'blur' }],
  receiver: [{ required: true, message: '请输入收货方', trigger: 'blur' }]
}

const saleFormRef = ref(null)
const saleLoading = ref(false)
const saleForm = reactive({
  traceCode: '',
  medicineId: null,
  medicineName: '',
  currentQuantity: 0,
  quantity: 1,
  buyer: '',
  remark: ''
})
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

const getNodeTypeText = (type) => {
  const typeMap = {
    'MANUFACTURER': '生产厂家',
    'DISTRIBUTOR': '经销商',
    'HOSPITAL': '医院',
    'PHARMACY': '药店'
  }
  return typeMap[type] || type
}

const getNodeTagType = (type) => {
  const typeMap = {
    'MANUFACTURER': 'success',
    'DISTRIBUTOR': 'warning',
    'HOSPITAL': 'info',
    'PHARMACY': 'danger'
  }
  return typeMap[type] || 'info'
}

const filteredInventoryList = ref([])
const filteredBatchList = ref([])

const filterInventory = (query) => {
  if (query) {
    filteredInventoryList.value = inventoryList.value.filter(item => {
      return item.traceCode.toLowerCase().includes(query.toLowerCase()) ||
             (item.medicineName && item.medicineName.toLowerCase().includes(query.toLowerCase()))
    })
  } else {
    filteredInventoryList.value = inventoryList.value
  }
}

const filterBatch = (query) => {
  if (query) {
    filteredBatchList.value = batchList.value.filter(item => {
      return item.traceCode.toLowerCase().includes(query.toLowerCase()) ||
             (item.batchNumber && item.batchNumber.toLowerCase().includes(query.toLowerCase()))
    })
  } else {
    filteredBatchList.value = batchList.value
  }
}

watch(inventoryList, (newList) => {
  filteredInventoryList.value = newList
}, { immediate: true })

watch(batchList, (newList) => {
  filteredBatchList.value = newList
}, { immediate: true })

const saleRules = {
  traceCode: [{ required: true, message: '请输入追溯码', trigger: 'blur' }],
  quantity: [{ required: true, message: '请输入销售数量', trigger: 'blur' }],
  buyer: [{ required: true, message: '请输入购买方', trigger: 'blur' }]
}

const loadFlowList = async () => {
  loading.value = true
  try {
    const params = {
      current: searchForm.current,
      size: searchForm.size
    }
    if (searchForm.traceCode) params.traceCode = searchForm.traceCode
    if (searchForm.operation) params.operation = searchForm.operation
    if (searchForm.status) params.status = searchForm.status
    if (searchForm.dateRange && searchForm.dateRange.length === 2) {
      params.startDate = searchForm.dateRange[0]
      params.endDate = searchForm.dateRange[1]
    }
    const res = await getFlowPageAdvanced(params)
    if (res.code === 200) {
      flowList.value = res.data.records || []
      total.value = res.data.total || 0
    }
  } catch (error) {
    ElMessage.error('加载数据失败')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  searchForm.current = 1
  loadFlowList()
  ElMessage.success('搜索已应用')
}

const handleResetSearch = () => {
  searchForm.traceCode = ''
  searchForm.keyword = ''
  searchForm.operation = ''
  searchForm.status = ''
  searchForm.dateRange = null
  searchForm.current = 1
  loadFlowList()
  ElMessage.info('搜索条件已重置')
}

const handleSizeChange = (size) => {
  searchForm.size = size
  loadFlowList()
}

const handleCurrentChange = (current) => {
  searchForm.current = current
  loadFlowList()
}

const loadInventoryList = async () => {
  inventoryLoading.value = true
  try {
    const res = await getInventoryList()
    inventoryList.value = res.data || []
  } catch (error) {
    ElMessage.error('加载库存失败')
  } finally {
    inventoryLoading.value = false
  }
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

const loadBatchList = async () => {
  batchLoading.value = true
  try {
    const res = await getBatchList()
    batchList.value = res.data || []
  } catch (error) {
    console.error('加载批次列表失败:', error)
  } finally {
    batchLoading.value = false
  }
}

const loadNodeList = async () => {
  try {
    const res = await getNodeList()
    if (res.code === 200) {
      nodeList.value = res.data || []
    }
  } catch (error) {
    console.error('加载节点列表失败:', error)
  }
}

const onReceiverNodeChange = (nodeId) => {
  const selectedNode = nodeList.value.find(n => n.id === nodeId)
  if (selectedNode) {
    outboundForm.receiver = selectedNode.name
  } else {
    outboundForm.receiver = ''
  }
}

const loadPendingList = async () => {
  pendingLoading.value = true
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
    pendingLoading.value = false
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
      loadFlowList()
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

const onTraceCodeChange = (traceCode) => {
  const selectedInventory = inventoryList.value.find(item => item.traceCode === traceCode)
  if (selectedInventory) {
    outboundForm.batchId = selectedInventory.batchId
    outboundForm.medicineId = selectedInventory.medicineId
    outboundForm.currentQuantity = selectedInventory.quantity
    outboundForm.quantity = 1
  }
}

const onInboundTraceCodeChange = (traceCode) => {
  if (traceCode) {
    const selectedBatch = batchList.value.find(item => item.traceCode === traceCode)
    if (selectedBatch) {
      inboundForm.traceCode = selectedBatch.traceCode
    }
  }
}

const onSaleTraceCodeChange = (traceCode) => {
  const selectedInventory = inventoryList.value.find(item => item.traceCode === traceCode)
  if (selectedInventory) {
    saleForm.medicineId = selectedInventory.medicineId
    saleForm.medicineName = selectedInventory.medicineName
    saleForm.currentQuantity = selectedInventory.quantity
    saleForm.quantity = 1
  }
}

const handleInbound = async () => {
  if (!inboundFormRef.value) return
  try {
    await inboundFormRef.value.validate()
    inboundLoading.value = true
    const res = await request({
      url: '/api/flow/inbound',
      method: 'post',
      data: inboundForm
    })
    if (res.code === 200) {
      ElMessage.success('入库成功')
      resetInboundForm()
      loadFlowList()
      activeTab.value = 'record'
    } else {
      ElMessage.error(res.message || '入库失败')
    }
  } catch (error) {
    console.error('入库失败:', error)
    ElMessage.error('入库失败')
  } finally {
    inboundLoading.value = false
  }
}

const handleOutbound = async () => {
  if (!outboundFormRef.value) return
  try {
    await outboundFormRef.value.validate()
    outboundLoading.value = true
    const res = await request({
      url: '/api/flow/outbound',
      method: 'post',
      data: outboundForm
    })
    if (res.code === 200) {
      ElMessage.success('出库成功')
      resetOutboundForm()
      loadFlowList()
      activeTab.value = 'record'
    } else {
      ElMessage.error(res.message || '出库失败')
    }
  } catch (error) {
    console.error('出库失败:', error)
    ElMessage.error('出库失败')
  } finally {
    outboundLoading.value = false
  }
}

const handleSale = async () => {
  if (!saleFormRef.value) return
  try {
    await saleFormRef.value.validate()
    saleLoading.value = true
    const res = await request({
      url: '/api/flow/sale',
      method: 'post',
      data: saleForm
    })
    if (res.code === 200) {
      ElMessage.success('销售成功')
      resetSaleForm()
      loadFlowList()
      activeTab.value = 'record'
    } else {
      ElMessage.error(res.message || '销售失败')
    }
  } catch (error) {
    console.error('销售失败:', error)
    ElMessage.error('销售失败')
  } finally {
    saleLoading.value = false
  }
}

const resetInboundForm = () => {
  if (inboundFormRef.value) {
    inboundFormRef.value.resetFields()
  }
}

const resetOutboundForm = () => {
  if (outboundFormRef.value) {
    outboundFormRef.value.resetFields()
  }
  outboundForm.batchId = null
  outboundForm.medicineId = null
  outboundForm.traceCode = ''
  outboundForm.currentQuantity = 0
  outboundForm.quantity = 1
  outboundForm.receiver = ''
  outboundForm.receiverNodeId = null
}

const resetSaleForm = () => {
  if (saleFormRef.value) {
    saleFormRef.value.resetFields()
  }
  saleForm.medicineId = null
  saleForm.medicineName = ''
  saleForm.currentQuantity = 0
}

watch(activeTab, (newVal) => {
  if (newVal === 'record') {
    loadFlowList()
  } else if (newVal === 'outbound') {
    loadInventoryList()
    loadNodeList()
  } else if (newVal === 'inbound') {
    loadPendingList()
  } else if (newVal === 'sale') {
    loadInventoryList()
  }
})

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

const getOperationType = (operation) => {
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
  return iconMap[operation] || null
}

const getStatusType = (status) => {
  const typeMap = {
    '完成': 'success',
    '处理中': 'warning'
  }
  return typeMap[status] || 'info'
}

const viewDetail = (row) => {
  currentDetail.value = row
  detailDialogVisible.value = true
}

onMounted(() => {
  loadFlowList()
  loadUserList()
})
</script>

<style scoped>
.flow-container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tab-content {
  padding: 20px 0;
}

.search-bar {
  margin-bottom: 20px;
  padding: 16px;
  background: #f5f7fa;
  border-radius: 8px;
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

.copyable {
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.3s;
}

.copyable:hover {
  background: #ecf5ff;
  color: #409EFF;
}

.copy-icon {
  font-size: 14px;
  opacity: 0;
  transition: opacity 0.3s;
}

.copyable:hover .copy-icon {
  opacity: 1;
}

.text-gray {
  color: #909399;
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

.remark-text {
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: inline-block;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

:deep(.el-table .el-table__cell) {
  padding: 12px 0;
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

.card-actions {
  display: flex;
  gap: 12px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #f1f5f9;
}

@media (max-width: 768px) {
  .flow-container {
    padding: 10px;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 16px;
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

  .search-bar {
    padding: 12px;
    border-radius: 12px;
  }

  .search-bar :deep(.el-form-item) {
    width: 100%;
    margin-right: 0;
    margin-bottom: 12px;
  }

  .search-bar :deep(.el-form-item__label) {
    min-width: 70px;
    font-size: 13px;
  }

  .desktop-only {
    display: none;
  }

  .mobile-only {
    display: flex;
  }

  .pagination-container {
    justify-content: center;
  }

  .pagination-container :deep(.el-pagination) {
    justify-content: center;
    flex-wrap: wrap;
  }

  :deep(.el-tabs__nav-wrap) {
    overflow-x: auto;
  }

  :deep(.el-tabs__item) {
    padding: 0 12px;
    font-size: 13px;
  }

  .content-card {
    padding: 16px;
    border-radius: 12px;
  }

  .card-list {
    gap: 12px;
  }

  .card-item {
    padding: 12px;
    border-radius: 12px;
  }

  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .card-title {
    width: 100%;
  }

  .title-text {
    width: 100%;
  }

  .flow-number-text {
    font-size: 14px;
  }

  .card-content {
    gap: 8px;
  }

  .info-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }

  .info-row .label {
    min-width: auto;
    font-size: 12px;
  }

  .info-row .value {
    font-size: 13px;
  }

  .card-actions {
    gap: 8px;
    margin-top: 12px;
    padding-top: 12px;
  }

  .card-actions .action-btn {
    padding: 8px 12px;
    font-size: 13px;
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

  .dialog-form :deep(.el-form-item__label) {
    font-size: 13px;
  }

  .dialog-footer {
    flex-direction: column-reverse;
    gap: 8px;
  }

  .cancel-btn,
  .submit-btn {
    width: 100%;
    justify-content: center;
  }

  .medicine-list {
    width: 100%;
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
}
</style>
