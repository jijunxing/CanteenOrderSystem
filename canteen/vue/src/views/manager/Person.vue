<template>
  <div class="cards-container">
    <div class="card">
      <el-form :model="data.user" label-width="100px" style="padding-right: 50px">
        <el-form-item label="头像">
          <el-upload :show-file-list="false" class="avatar-uploader" action="http://localhost:9090/files/upload"
                     :on-success="handleFileUpload">
            <img v-if="data.user.avatar" :src="data.user.avatar" class="avatar"/>
            <el-icon v-else class="avatar-uploader-icon">
              <Plus/>
            </el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="账号">
          <el-input disabled v-model="data.user.username" autocomplete="off"/>
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="data.user.name" autocomplete="off"/>
        </el-form-item>
        <el-form-item label="性别" v-if="data.user.role === 'USER'">
          <el-radio-group v-model="data.user.sex">
            <el-radio label="男"></el-radio>
            <el-radio label="女"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="手机" v-if="data.user.role === 'USER'">
          <el-input v-model="data.user.phone" autocomplete="off"/>
        </el-form-item>
        <el-form-item label="账户余额" v-if="data.user.role === 'USER'">
          <el-input disabled v-model="data.user.account" autocomplete="off"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="save">保存</el-button>
          <el-button type="primary" @click="data.formVisible = true" style="text-align: right">修改密码</el-button>
          <el-button type="warning" @click="data.rechargeVisible = true" style="text-align: right"
                     v-if="data.user.role === 'USER'">充值
          </el-button>
        </el-form-item>
      </el-form>

      <!-- 修改密码弹窗 -->
      <el-dialog v-model="data.formVisible" title="修改密码" width="25%" destroy-on-close>
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

      <!-- 充值余额弹窗 -->
      <el-dialog v-model="data.rechargeVisible" title="充值余额" width="380px" align-center>
        <el-form :model="data" :rules="data.rechargeRules" ref="rechargeFormRef">
          <el-form-item prop="rechargeMoney">
            <div><span style="font-size: 35px">￥</span>
              <el-input v-model="data.rechargeMoney" style="margin-bottom: 20px; width: 300px"/>
            </div>
          </el-form-item>
        </el-form>
        <el-button @click="data.rechargeMoney=50" style="margin-left: 30px">50元</el-button>
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
/* 容器设置 */
.cards-container {
  display: flex;
  flex-direction: column;
  align-items: center; /* 垂直居中 */
  justify-content: flex-start; /* 上对齐 */
  padding: 20px;
  width: 100%;
  max-width: 1000px; /* 限制容器最大宽度 */
  margin: 0 auto; /* 水平居中 */
}

/* 卡片样式 */
.card {
  padding: 20px;
  border-radius: 12px;
  background-color: #fff;
  border: 1px solid #e4e7ed;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  width: 100%; /* 默认宽度 */
  max-width: 800px; /* 限制卡片最大宽度 */
}

/* 头像上传的样式 */
.avatar-uploader {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 120px;
  height: 120px;
  border: 1px dashed #dcdfe6;
  border-radius: 50%;
  cursor: pointer;
  margin-bottom: 10px;
}

.avatar-uploader .avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.avatar-uploader-icon {
  font-size: 40px;
  color: #909399;
}

/* 弹窗样式 */
.el-dialog {
  width: 30%; /* 设置弹出框的宽度 */
  max-width: 600px; /* 设置最大宽度 */
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
}

/* 修改密码弹窗 */
.el-dialog .el-form-item {
  margin-bottom: 20px;
}

/* 充值弹窗 */
.el-dialog[title="充值余额"] {
  width: 380px;
}

.el-dialog .el-form-item {
  margin-bottom: 10px;
}

.el-radio-group {
  margin-top: 20px;
}

/* 按钮样式 */
.el-button {
  margin-right: 10px;
}

</style>
