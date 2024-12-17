<template>
  <div class="layout-container">
    <!-- 顶部导航栏 -->
    <header class="main-header">
      <div class="header-left">
        <div class="logo-container">
          <img src="@/assets/imgs/logo2.png" alt="Logo" class="logo-img">
          <h1 class="logo-text">SCU食堂</h1>
        </div>
      </div>
      
      <div class="header-right">
        <div class="user-info">
          <span class="welcome-text" :class="{ 'admin-text': data.user.role === 'ADMIN' }">
            欢迎您，{{ data.user.role === 'ADMIN' ? '管理员' : '顾客' }}
          </span>
          <div class="avatar-container">
            <img 
              :src="data.user.avatar || 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'" 
              class="user-avatar"
            >
            <span class="user-name">{{ data.user.name }}</span>
          </div>
        </div>
      </div>
    </header>

    <!-- 其他内容保持不变 -->
    <div class="main-container">
      <div class="sidebar">
        <el-menu
            router
            style="border: none"
            :default-active="$route.path"
            :default-openeds="['/home', '2']"
        >
          <el-menu-item index="/home">
            <el-icon><HomeFilled /></el-icon>
            <span>系统首页</span>
          </el-menu-item>
          <el-menu-item index="/orders" v-if="data.user.role === 'USER'">
            <el-icon><Food /></el-icon>
            <span>我的点餐</span>
          </el-menu-item>
          <el-menu-item index="/myOrders" v-if="data.user.role === 'USER'">
            <el-icon><Checked /></el-icon>
            <span>我的订单</span>
          </el-menu-item>
          <el-sub-menu index="2" v-if="data.user.role === 'ADMIN'">
            <template #title>
              <el-icon><OfficeBuilding /></el-icon>
              <span>餐厅管理</span>
            </template>
            <el-menu-item index="/tables">
              <el-icon><Dish /></el-icon>
              <span>餐桌信息</span>
            </el-menu-item>
            <el-menu-item index="/foods">
              <el-icon><Bowl /></el-icon>
              <span>菜品信息</span>
            </el-menu-item>
            <el-menu-item index="/orderManager" v-if="data.user.role === 'ADMIN'">
              <el-icon><List /></el-icon>
              <span>订单管理</span>
            </el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="3" v-if="data.user.role === 'ADMIN'">
            <template #title>
              <el-icon><User /></el-icon>
              <span>用户管理</span>
            </template>
            <el-menu-item index="/admin">
              <el-icon><Avatar /></el-icon>
              <span>管理员信息</span>
            </el-menu-item>
            <el-menu-item index="/user">
              <el-icon><UserFilled /></el-icon>
              <span>顾客信息</span>
            </el-menu-item>
          </el-sub-menu>
          <el-menu-item index="/person">
            <el-icon><User /></el-icon>
            <span>个人资料</span>
          </el-menu-item>
          <el-menu-item index="/comments">
            <el-icon><ChatDotRound /></el-icon>
            <span>餐厅评价</span>
          </el-menu-item>
          <el-menu-item index="login" @click="logout">
            <el-icon><SwitchButton /></el-icon>
            <span>退出系统</span>
          </el-menu-item>
        </el-menu>
      </div>
      <div class="content">
        <router-view @updateUser="updateUser"/>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import {User, UserFilled} from "@element-plus/icons-vue";
import {reactive} from "vue";
const $route = useRoute()
console.log($route.path)

const data = reactive({
  user : JSON.parse(localStorage.getItem('canteen-user') || '{}')
})

const logout = () => {
  localStorage.removeItem('canteen-user')
}

const updateUser = () => {
  data.user = JSON.parse(localStorage.getItem('canteen-user') || '{}')
}

</script>

<style scoped>
.layout-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-header {
  height: 60px;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-bottom: 1px solid #e4e7ed;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.header-left {
  display: flex;
  align-items: center;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-img {
  width: 40px;
  height: 40px;
  object-fit: contain;
}

.logo-text {
  font-family: 'Arial', sans-serif;
  font-size: 24px;
  font-weight: bold;
  color: #F9B44C;
  margin: 0;
  background: linear-gradient(45deg, #F9B44C, #ff9f43);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
}

.header-right {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 0 10px;
  border-radius: 20px;
  transition: background-color 0.3s;
}

.user-info:hover {
  background-color: rgba(0, 0, 0, 0.02);
}

.welcome-text {
  color: #409EFF;
  font-size: 14px;
}

.admin-text {
  color: #F56C6C;
}

.avatar-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 2px solid #fff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.user-avatar:hover {
  transform: scale(1.05);
}

.user-name {
  font-size: 14px;
  color: #303133;
  font-weight: 500;
}

.main-container {
  flex: 1;
  display: flex;
}

.sidebar {
  width: 200px;
  border-right: 1px solid #ddd;
  background-color: #fff;
}

.content {
  flex: 1;
  background-color: #f8f8ff;
  padding: 10px;
}

/* 优化菜单样式 */
:deep(.el-menu) {
  border-right: none;
}

:deep(.el-menu-item.is-active) {
  background-color: #ecf5ff;
  border-right: 3px solid #409EFF;
}

:deep(.el-menu-item:hover) {
  background-color: #f5f7fa;
}

:deep(.el-menu-item) {
  border-radius: 4px;
  margin: 4px 8px;
  height: 50px;
  line-height: 50px;
}

:deep(.el-sub-menu__title) {
  border-radius: 4px;
  margin: 4px 8px;
}
</style>