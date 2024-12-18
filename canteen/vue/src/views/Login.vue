<template>
  <div class="login-container">
    <div class="login-box">
      <!-- Logo和标题区域 -->
      <div class="header">
        <img src="@/assets/imgs/logo2.png" alt="Logo" class="logo">
        <h2 class="title">SCU食堂</h2>
        <p class="subtitle">欢迎使用智慧餐厅系统</p>
      </div>

      <!-- 登录表单 -->
      <div class="form-container">
        <el-form 
          ref="formRef" 
          :model="form" 
          :rules="rules"
          label-width="0"
        >
          <!-- 角色选择 -->
          <div class="role-switch">
            <span 
              :class="['role-option', form.role === 'USER' ? 'active' : '']"
              @click="form.role = 'USER'"
            >
              用户登录
            </span>
            <span 
              :class="['role-option', form.role === 'ADMIN' ? 'active' : '']"
              @click="form.role = 'ADMIN'"
            >
              管理员登录
            </span>
          </div>

          <!-- 输入框区域 -->
          <el-form-item prop="username">
            <el-input
              v-model="form.username"
              placeholder="请输入账号"
              :prefix-icon="User"
              size="large"
              clearable
            />
          </el-form-item>
          
          <el-form-item prop="password">
            <el-input
              v-model="form.password"
              type="password"
              placeholder="请输入密码"
              :prefix-icon="Lock"
              size="large"
              show-password
              clearable
              @keyup.enter="login"
            />
          </el-form-item>

          <!-- 登录按钮 -->
          <el-form-item>
            <el-button 
              type="primary" 
              class="login-btn"
              size="large"
              :loading="loading"
              @click="login"
            >
              {{ loading ? '登录中...' : '登录' }}
            </el-button>
          </el-form-item>
        </el-form>

        <!-- 注册链接 -->
        <div class="register-link">
          还没有账号？
          <router-link to="/register" class="link">立即注册</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { User, Lock } from '@element-plus/icons-vue'
import request from '@/utils/request'
import router from '@/router'
import { ElMessage } from 'element-plus'

const formRef = ref()
const loading = ref(false)

const form = reactive({
  username: '',
  password: '',
  role: 'USER'
})

// 表单验证规则
const rules = reactive({
  username: [
    { required: true, message: '请输入账号', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
  ]
})

const login = () => {
  formRef.value.validate((valid) => {
    if (!valid) return
    
    loading.value = true
    request.post('/login', form).then(res => {
      if (res.code === '200') {
        localStorage.setItem('canteen-user', JSON.stringify(res.data))
        router.push('/')
        ElMessage.success('登录成功')
      } else {
        ElMessage.error(res.msg)
      }
    }).finally(() => {
      loading.value = false
    })
  }).catch(error => {
    console.error(error)
  })
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: url("@/assets/imgs/log_bg.png") center/cover no-repeat;
}

.login-box {
  width: 400px;
  padding: 40px;
  background: rgba(255, 255, 255, .85);
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

.header {
  text-align: center;
  margin-bottom: 40px;
}

.logo {
  width: 80px;
  height: 80px;
  margin-bottom: 16px;
}

.title {
  font-size: 28px;
  color: #303133;
  margin: 0 0 8px;
  background: linear-gradient(45deg, #F9B44C, #ff9f43);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.subtitle {
  font-size: 16px;
  color: #909399;
  margin: 0;
}

.form-container {
  padding: 0 20px;
}

.role-switch {
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
  gap: 20px;
}

.role-option {
  padding: 8px 24px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
  color: #606266;
  background: #f5f7fa;
}

.role-option.active {
  color: #fff;
  background: #F9B44C;
  box-shadow: 0 2px 8px rgba(249, 180, 76, 0.3);
}

:deep(.el-input__wrapper) {
  box-shadow: 0 0 0 1px #dcdfe6 inset;
  border-radius: 8px;
  padding: 1px 12px;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.7);
}

:deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px #F9B44C inset;
  background: rgba(255, 255, 255, 0.8);
}

:deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 2px rgba(249, 180, 76, 0.2);
  background: rgba(255, 255, 255, 0.85);
}

:deep(.el-input__prefix) {
  margin-right: 8px;
}

.login-btn {
  width: 100%;
  height: 44px;
  font-size: 16px;
  border-radius: 8px;
  background: linear-gradient(45deg, #F9B44C, #ff9f43);
  border: none;
  margin-top: 20px;
  transition: transform 0.3s ease;
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(249, 180, 76, 0.3);
}

.register-link {
  text-align: center;
  font-size: 14px;
  color: #606266;
  margin-top: 20px;
}

.link {
  color: #F9B44C;
  text-decoration: none;
  transition: color 0.3s ease;
}

.link:hover {
  color: #ff9f43;
}

/* 响应式适配 */
@media (max-width: 480px) {
  .login-box {
    width: 90%;
    margin: 20px;
    padding: 30px 20px;
  }

  .logo {
    width: 60px;
    height: 60px;
  }

  .title {
    font-size: 24px;
  }

  .subtitle {
    font-size: 14px;
  }
}
</style>