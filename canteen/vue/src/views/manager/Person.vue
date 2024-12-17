<template>
  <div class="cards-container">
    <div class="profile-card">
      <!-- 个人信息表单 -->
      <el-form :model="data.user" label-width="100px">
        <!-- 头像部分 -->
        <div class="profile-header">
          <el-form-item label="头像" class="avatar-item">
            <el-upload 
              :show-file-list="false" 
              class="avatar-uploader" 
              action="http://localhost:9090/files/upload"
              :on-success="handleFileUpload"
            >
              <div class="avatar-wrapper">
                <img v-if="data.user.avatar" :src="data.user.avatar" class="avatar"/>
                <el-icon v-else class="avatar-uploader-icon"><Plus/></el-icon>
                <div class="avatar-hover-text">点击更换头像</div>
              </div>
            </el-upload>
          </el-form-item>

          <!-- 用户角色标识 -->
          <div class="role-tag">
            <el-tag :type="data.user.role === 'ADMIN' ? 'danger' : 'primary'" effect="dark">
              {{ data.user.role === 'ADMIN' ? '管理员' : '用户' }}
            </el-tag>
          </div>
        </div>

        <!-- 基本信息部分 -->
        <div class="form-section">
          <el-form-item label="账号">
            <el-input disabled v-model="data.user.username" />
          </el-form-item>
          <el-form-item label="名称">
            <el-input v-model="data.user.name" />
          </el-form-item>
          
          <!-- 用户特有字段 -->
          <template v-if="data.user.role === 'USER'">
            <el-form-item label="性别">
              <el-radio-group v-model="data.user.sex">
                <el-radio label="男">男</el-radio>
                <el-radio label="女">女</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="手机">
              <el-input v-model="data.user.phone" />
            </el-form-item>
            
            <!-- 用户余额展示 -->
            <el-form-item label="账户余额">
              <div class="balance-display">
                <span class="balance-amount">￥{{ data.user.account || '0.00' }}</span>
                <el-button 
                  type="warning" 
                  @click="data.rechargeVisible = true"
                  class="recharge-btn"
                >
                  <el-icon><Plus /></el-icon>
                  充值
                </el-button>
              </div>
            </el-form-item>
          </template>
        </div>

        <!-- 操作按钮 -->
        <div class="action-buttons">
          <el-button type="primary" @click="save">
            <el-icon><Check /></el-icon>保存修改
          </el-button>
          <el-button type="info" @click="data.formVisible = true">
            <el-icon><Lock /></el-icon>修改密码
          </el-button>
        </div>
      </el-form>

      <!-- 修改密码弹窗 -->
      <el-dialog v-model="data.formVisible" title="修改密码" width="360px" destroy-on-close>
        <el-form :model="data.form" ref="formRef" :rules="data.rules" label-width="100px">
          <el-form-item prop="originalPassword" label="原密码">
            <el-input v-model="data.form.originalPassword"/>
          </el-form-item>
          <el-form-item prop="newPassword" label="新密码">
            <el-input v-model="data.form.newPassword" show-password/>
          </el-form-item>
          <el-form-item prop="confirmedPassword" label="确认新密码">
            <el-input v-model="data.form.confirmedPassword" show-password/>
          </el-form-item>
        </el-form>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="data.formVisible = false">取消</el-button>
            <el-button type="primary" @click="changePassword">保存</el-button>
          </div>
        </template>
      </el-dialog>

      <!-- 充值弹窗 -->
      <el-dialog v-model="data.rechargeVisible" title="账户充值" width="400px" align-center>
        <el-form :model="data" :rules="data.rechargeRules" ref="rechargeFormRef">
          <el-form-item prop="rechargeMoney">
            <div><span style="font-size: 35px">￥</span>
              <el-input v-model="data.rechargeMoney" style="margin-bottom: 20px; width: 300px"/>
            </div>
          </el-form-item>
        </el-form>
        <el-button @click="data.rechargeMoney=50" style="margin-left: 20px">50元</el-button>
        <el-button @click="data.rechargeMoney=100">100元</el-button>
        <el-button @click="data.rechargeMoney=200">200元</el-button>
        <el-button @click="data.rechargeMoney=500">500元</el-button>
        <el-radio-group style="margin-top: 20px; margin-left: 30px" v-model="data.radio">
          <el-radio :label="3" size="small">微信支付</el-radio>
          <el-radio :label="6" size="small">支付宝支付</el-radio>
          <el-radio :label="9" size="small">银联支付</el-radio>
        </el-radio-group>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="data.rechargeVisible = false">取消</el-button>
            <el-button type="primary" @click="submitRecharge">充值</el-button>
          </div>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script setup>
import {reactive, ref} from "vue"
import request from "@/utils/request";
import {ElMessage} from "element-plus";

const validatePass = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请确认密码'))
  } else if (value !== data.form.newPassword) {
    callback(new Error("输入密码不一致!"))
  } else {
    callback()
  }
}

const data = reactive({
  user: JSON.parse(localStorage.getItem('canteen-user') || '{}'),
  form: {},
  formVisible: false,
  rechargeVisible: false,
  radio: 3,
  rules: {
    originalPassword: [
      {required: true, message: '请输入原密码', trigger: 'blur'},
    ],
    newPassword: [
      {required: true, message: '请输入新密码', trigger: 'blur'},
    ],
    confirmedPassword: [
      {required: true, validator: validatePass, trigger: 'blur'},
    ],
  },
  rechargeRules: {
    rechargeMoney: [
      {
        type: 'number' , required: true, min: 0, message: '充值金额必须大于或等于 0', trigger: 'blur',
      },
    ],
  },
})

const formRef = ref()
const rechargeFormRef = ref()
const handleFileUpload = (file) => {
  data.user.avatar = file.data
}

const emit = defineEmits(["updateUser"])

//把修改的信息存入数据库
const save = () => {
  if (data.user.role === 'ADMIN') {
    request.put('/admin/update', data.user).then(res => {
      if (res.code === '200') {
        ElMessage.success('更新成功')
        localStorage.setItem('canteen-user', JSON.stringify(data.user))
        emit('updateUser')
      } else {
        ElMessage.error(res.msg)
      }
    })
  } else {
    request.put('/user/update', data.user).then(res => {
      if (res.code === '200') {
        ElMessage.success('更新成功')
        localStorage.setItem('canteen-user', JSON.stringify(data.user))
        emit('updateUser')
      } else {
        ElMessage.error(res / msg)
      }
    })
  }
}

const changePassword = () => {
  formRef.value.validate((valid => {
    console.log(valid)
    if (valid) {
      data.user.password = data.form.originalPassword
      request.post('/login', data.user).then(res => {
        if (res.code === '200') {
          data.user.password = data.form.newPassword
          save()
          data.formVisible = false;
        } else {
          ElMessage.error(res.msg)
        }
      })
    }
  })).catch(error => {
    console.error(error)
  })
}

const submitRecharge = () => {
  rechargeFormRef.value.validate((valid) => {
    if (valid) {
      recharge();
    } else {
      ElMessage.error('充值金额不符合要求');
    }
  });
};

const recharge = () => {
  data.user.account += data.rechargeMoney
  save()
  data.rechargeVisible = false
}
</script>

<style scoped>
.cards-container {
  padding: 20px;
  display: flex;
  justify-content: center;
}

.profile-card {
  background: #fff;
  border-radius: 16px;
  padding: 30px;
  width: 100%;
  max-width: 700px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.avatar-item :deep(.el-form-item__content) {
  margin-left: 0 !important;
}

.avatar-wrapper {
  position: relative;
  width: 120px;
  height: 120px;
  border: 2px dashed #dcdfe6;
  border-radius: 50%;
  overflow: visible;
  cursor: pointer;
  transition: all 0.3s;
}

.avatar-wrapper:hover {
  border-color: #409EFF;
}

.avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
}

.avatar-hover-text {
  position: absolute;
  left: 50%;
  bottom: -25px;
  transform: translateX(-50%);
  white-space: nowrap;
  color: #606266;
  font-size: 12px;
  opacity: 0;
  transition: opacity 0.3s;
}

.avatar-wrapper:hover .avatar-hover-text {
  opacity: 1;
}

.avatar-uploader {
  position: relative;
  display: inline-block;
}

.avatar-uploader:hover .avatar-wrapper {
  border-color: #409EFF;
  box-shadow: 0 0 8px rgba(64, 158, 255, 0.2);
}

.role-tag {
  padding: 20px;
}

.form-section {
  max-width: 500px;
  margin: 0 auto;
}

.balance-display {
  display: flex;
  align-items: center;
  gap: 20px;
}

.balance-amount {
  font-size: 24px;
  color: #f56c6c;
  font-weight: bold;
}

.recharge-btn {
  display: flex;
  align-items: center;
  gap: 4px;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
}

/* 弹窗样式优化 */
:deep(.el-dialog) {
  border-radius: 12px;
  overflow: hidden;
}

:deep(.el-dialog__header) {
  margin: 0;
  padding: 20px;
  background: #f8f9fa;
  border-bottom: 1px solid #eee;
}

:deep(.el-dialog__body) {
  padding: 30px;
}

:deep(.el-form-item__label) {
  font-weight: 500;
}

:deep(.el-input__wrapper) {
  box-shadow: 0 0 0 1px #dcdfe6 inset;
}

:deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px #409EFF inset;
}
</style>
