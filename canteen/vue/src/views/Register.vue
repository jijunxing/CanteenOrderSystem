<template>
  <div class="register-container">
    <div class="register-box">
      <!-- Logo和标题区域 -->
      <div class="header">
        <img src="@/assets/imgs/logo2.png" alt="Logo" class="logo">
        <h2 class="title">SCU食堂</h2>
        <p class="subtitle">欢迎注册智慧餐厅系统</p>
      </div>

      <!-- 注册表单 -->
      <div class="form-container">
        <el-form 
          ref="formRef" 
          :model="form" 
          :rules="rules"
          label-width="0"
        >
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
            />
          </el-form-item>

          <el-form-item prop="confirmPassword">
            <el-input
              v-model="form.confirmPassword"
              type="password"
              placeholder="请确认密码"
              :prefix-icon="Lock"
              size="large"
              show-password
              clearable
            />
          </el-form-item>

          <!-- 注册按钮 -->
          <el-form-item>
            <el-button 
              type="primary" 
              class="register-btn"
              size="large"
              :loading="loading"
              @click="register"
            >
              {{ loading ? '注册中...' : '注册' }}
            </el-button>
          </el-form-item>
        </el-form>

        <!-- 登录链接 -->
        <div class="login-link">
          已有账号？
          <router-link to="/login" class="link">立即登录</router-link>
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

const validatePass = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请确认密码'))
  } else if (value !== form.password) {
    callback(new Error('输入密码不一致!'))
  } else {
    callback()
  }
}

const form = reactive({
  username: '',
  password: '',
  confirmPassword: '',
  role: 'USER'
})

const rules = reactive({
  username: [
    { required: true, message: '请输入账号', trigger: 'blur' },
    { min: 3, max: 20, message: '账号长度应在 3 到 20 个字符之间', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度应在 6 到 20 个字符之间', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    { validator: validatePass, trigger: 'blur' },
  ]
})

const register = () => {
  formRef.value.validate((valid) => {
    if (!valid) return
    
    loading.value = true
    request.post('/register', form).then(res => {
      if (res.code === '200') {
        ElMessage.success('注册成功')
        router.push('/login')
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
.register-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: url("@/assets/imgs/reg_bg.png") center/cover no-repeat;
}

.register-box {
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

:deep(.el-input__wrapper) {
  box-shadow: 0 0 0 1px #dcdfe6 inset;
  border-radius: 8px;
  padding: 1px 12px;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.8);
}

:deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px #F9B44C inset;
  background: rgba(255, 255, 255, 0.9);
}

:deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 2px rgba(249, 180, 76, 0.2);
  background: rgba(255, 255, 255, 0.95);
}

:deep(.el-input__prefix) {
  margin-right: 8px;
}

.register-btn {
  width: 100%;
  height: 44px;
  font-size: 16px;
  border-radius: 8px;
  background: linear-gradient(45deg, #F9B44C, #ff9f43);
  border: none;
  margin-top: 20px;
  transition: transform 0.3s ease;
}

.register-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(249, 180, 76, 0.3);
}

.login-link {
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
  .register-box {
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