<template>
  <div class="sale-container">
    <el-card>
      <template #header>
        <span>销售登记</span>
      </template>
      
      <el-form :model="form" :rules="rules" ref="formRef" label-width="120px" class="sale-form">
        <el-form-item label="追溯码" prop="traceCode">
          <el-input v-model="form.traceCode" placeholder="请输入追溯码" />
        </el-form-item>
        <el-form-item label="销售数量" prop="quantity">
          <el-input-number v-model="form.quantity" :min="1" style="width: 100%" />
        </el-form-item>
        <el-form-item label="购买方" prop="buyer">
          <el-input v-model="form.buyer" placeholder="请输入购买方" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" :rows="3" placeholder="请输入备注" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSubmit" :loading="loading">确认销售</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import request from '@/utils/request'

const formRef = ref(null)
const loading = ref(false)

const form = reactive({
  traceCode: '',
  quantity: 1,
  buyer: '',
  remark: ''
})

const rules = {
  traceCode: [{ required: true, message: '请输入追溯码', trigger: 'blur' }],
  quantity: [{ required: true, message: '请输入销售数量', trigger: 'blur' }],
  buyer: [{ required: true, message: '请输入购买方', trigger: 'blur' }]
}

const handleSubmit = async () => {
  if (!formRef.value) return
  try {
    await formRef.value.validate()
    loading.value = true
    const res = await request({
      url: '/api/flow/sale',
      method: 'post',
      data: form
    })
    if (res.code === 200) {
      ElMessage.success('销售成功')
      resetForm()
    } else {
      ElMessage.error(res.message || '销售失败')
    }
  } catch (error) {
    console.error('销售失败:', error)
    ElMessage.error('销售失败')
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetFields()
  }
}
</script>

<style scoped>
.sale-container {
  padding: 20px;
}

.sale-form {
  max-width: 600px;
}

@media (max-width: 768px) {
  .sale-container {
    padding: 16px;
  }

  .sale-form {
    max-width: 100%;
  }

  .sale-form .el-form-item {
    margin-bottom: 18px;
  }

  .sale-form .el-form-item__label {
    text-align: left;
  }

  .sale-form .el-button {
    width: 100%;
    margin-bottom: 12px;
  }
}
</style>
