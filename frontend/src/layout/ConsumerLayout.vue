<template>
  <el-container class="layout-container">
    <el-header>
      <div class="header-left">
        <h1>药品溯源查询</h1>
      </div>
      <div class="header-right">
        <span>{{ username }}</span>
        <el-button type="primary" @click="logout">退出</el-button>
      </div>
    </el-header>
    <el-main>
      <router-view />
    </el-main>
  </el-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const username = ref(localStorage.getItem('username') || '消费者')

const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('username')
  router.push('/login')
}
</script>

<style scoped>
.layout-container {
  height: 100vh;
}
.el-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #1890ff;
  color: white;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);
}
.header-left h1 {
  margin: 0;
  font-size: 20px;
}
.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}
.el-main {
  padding: 40px;
}
</style>