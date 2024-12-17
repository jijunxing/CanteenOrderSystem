<template>
  <div>
    <div>
      <div class="card" style="margin-bottom: 10px;">
        <el-input prefix-icon="Search" style="width: 300px; margin-right: 10px" placeholder="请输入用户名称查询"
                  v-model="data.userName"></el-input>
        <el-select v-model="data.status" placeholder="订单状态" clearable @change="load"
                   style="width:150px; margin-right: 10px">
          <el-option value="待出餐"/>
          <el-option value="待评价"/>
          <el-option value="已完成"/>
        </el-select>
        <el-button type="primary" @click="load">查询</el-button>
        <el-button type="info" style="margin: 0 10px" @click="reset">重置</el-button>
      </div>

      <div class="card" style="margin-bottom: 10px">
        <el-table :data="data.tableData" style="width: 100%">
          <el-table-column prop="orderNo" label="订单号" width="200"/>
          <el-table-column prop="tableNo" label="桌号" width="70"/>
          <el-table-column prop="content" label="菜单内容" width="400"/>
          <el-table-column prop="remark" label="备注"/>
          <el-table-column prop="status" label="订单状态" width="100">
            <template #default="scope">
              <el-tag type="primary" v-if="scope.row.status === '待出餐'">{{ scope.row.status }}</el-tag>
              <el-tag type="warning" v-if="scope.row.status === '待评价'">{{ scope.row.status }}</el-tag>
              <el-tag type="success" v-if="scope.row.status === '已完成'">{{ scope.row.status }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="score" label="用户评分" width="220" size="small">
            <template #default="scope">
              <span v-if="scope.row.score == 0">暂未评价</span>
              <span v-else>
              <el-rate v-model="scope.row.score" disabled/>
              <el-button size="small" @click="showComments(scope.row)">查看评价</el-button>
                </span>
            </template>
          </el-table-column>
          <el-table-column prop="time" label="下单时间" width="110"/>
          <el-table-column prop="userName" label="用户名称" width="100"/>
          <el-table-column prop="total" label="总价" width="80">
            <template #default="scope">
              <strong style="color:red;">￥{{ scope.row.total }}</strong>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100">
            <template #default="scope">
              <el-button type="primary" :icon="Edit" circle @click="handleEdit(scope.row)"/>
              <el-button type="danger" :icon="Delete" circle @click="del(scope.row.id)"/>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="card" v-if="data.total">
        <el-pagination background layout="prev, pager, next" @current-change="load" :page-size="data.pageSize"
                       v-model:current-page="data.pageNum" :total="data.total"/>
      </div>

      <el-dialog v-model="data.formVisible" title="信息" width="25%" destroy-on-close>
        <el-form :model="data.form" label-width="100px" style="padding-right: 50px">
          <el-form-item label="订单状态">
            <el-select style="width: 100%" v-model="data.form.status">
              <el-option value="待出餐"></el-option>
              <el-option value="待评价"></el-option>
              <el-option value="已完成"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="data.formVisible = false">取消</el-button>
            <el-button type="primary" @click="save">保存</el-button>
          </div>
        </template>
      </el-dialog>

      <!-- 用户评价对话框 -->
      <el-dialog 
        v-model="data.commentsDialogVisible" 
        title="订单评价详情" 
        width="500px"
        class="comments-dialog"
      >
        <div class="comments-content">
          <!-- 订单基本信息 -->
          <div class="order-info">
            <div class="info-item">
              <span class="label">订单号：</span>
              <span class="value">{{ data.curOrder.orderNo }}</span>
            </div>
            <div class="info-item">
              <span class="label">用户名：</span>
              <span class="value">{{ data.curOrder.userName }}</span>
            </div>
            <div class="info-item">
              <span class="label">下单时间：</span>
              <span class="value">{{ data.curOrder.time }}</span>
            </div>
          </div>

          <!-- 用户评价部分 -->
          <div class="review-section">
            <div class="section-title">用户评价</div>
            <div class="rating-display">
              <span class="rating-label">评分：</span>
              <el-rate 
                v-model="data.curOrder.score" 
                disabled 
                show-score
                :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
              />
            </div>
            <div class="comments-display">
              <div class="comments-label">评价内容：</div>
              <div class="comments-text">{{ data.curOrder.comments || '暂无评价内容' }}</div>
            </div>
          </div>

          <!-- 商家回复部分 -->
          <div class="reply-section">
            <div class="section-title">商家回复</div>
            <template v-if="data.curOrder.response">
              <div class="reply-content">{{ data.curOrder.response }}</div>
              <el-tag size="small" type="success" class="reply-status">已回复</el-tag>
            </template>
            <template v-else>
              <el-input
                v-model="data.response"
                type="textarea"
                :rows="3"
                placeholder="请输入回复内容..."
                resize="none"
                maxlength="200"
                show-word-limit
              />
              <div class="reply-actions">
                <el-button type="primary" @click="submitResponse" :disabled="!data.response.trim()">
                  提交回复
                </el-button>
              </div>
            </template>
          </div>
        </div>
      </el-dialog>

    </div>
  </div>
</template>

<script setup>
import {reactive} from "vue"
import request from "@/utils/request";
import {ElMessage, ElMessageBox} from "element-plus";
import {Delete, Edit} from '@element-plus/icons-vue';

const data = reactive({
  tableData: [],
  total: 0,
  pageNum: 1,  // 当前的页码
  pageSize: 9,  // 每页的个数
  formVisible: false,
  commentsDialogVisible: false,
  form: {},
  userName: '',
  status: '',
  curOrder: {},
  response: ''
})

const load = () => {
  console.log(data.userName)
  console.log(data.status)
  request.get('/orders/selectPage', {
    params: {
      name: data.userName,
      status: data.status,
      pageNum: data.pageNum,
      pageSize: data.pageSize
    }
  }).then(res => {
    console.log(res.data)
    data.tableData = res.data?.list || []
    data.total = res.data.total
  })
}

load()

const reset = () => {
  data.userName = null;
  data.status = null;
  load();
}

//保存数据
const save = () => {
  request.request({
    method: data.form.id ? 'PUT' : 'POST',
    url: data.form.id ? '/orders/update' : '/orders/add',
    data: data.form
  }).then(res => {
    if (res.code === '200') {
      ElMessage.success('操作成功')
      data.formVisible = false
      load()
    } else {
      ElMessage.error(res.msg)
    }
  })
}

const handleEdit = (row) => {
  data.form = JSON.parse(JSON.stringify(row))
  data.formVisible = true;
}

const del = (id) => {
  ElMessageBox.confirm('删除后数据无法恢复,您确认要删除吗？', '确认删除', {type: 'warning'}).then(res => {
    request.delete('orders/delete/' + id).then(res => {
      if (res.code === '200') {
        ElMessage.success('操作成功')
        load()
      } else {
        ElMessage.error(res.msg)
      }
    })
  }).catch(err => {
    console.log(err)
  })
}

const showComments = (row) => {
  data.curOrder = row
  data.commentsDialogVisible = true
}

const submitResponse = () => {
  if (data.curOrder.response != null && data.curOrder.response != '') {
    ElMessage.warning('已经回复过该评价')
    return
  }
  data.curOrder.response = data.response
  request.put('/orders/update', data.curOrder).then(res => {
    if (res.code === '200') {
      ElMessage.success('回复成功')
      load()
      data.commentsDialogVisible = false
    } else {
      ElMessage.error(res.msg)
    }
  })
}
</script>

<style scoped>
/* 评价对话框样式 */
.comments-dialog :deep(.el-dialog__body) {
  padding: 0;
}

.comments-content {
  padding: 20px 30px;
}

/* 订单信息样式 */
.order-info {
  background: #f8f9fa;
  padding: 15px 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.info-item {
  display: flex;
  margin-bottom: 8px;
  font-size: 14px;
  line-height: 1.8;
}

.info-item:last-child {
  margin-bottom: 0;
}

.label {
  color: #909399;
  width: 80px;
  flex-shrink: 0;
}

.value {
  color: #303133;
  font-weight: 500;
}

/* 评价部分样式 */
.review-section, .reply-section {
  margin-bottom: 24px;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #ebeef5;
}

.rating-display {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.rating-label {
  margin-right: 8px;
  color: #606266;
}

.comments-label {
  color: #606266;
  margin-bottom: 8px;
}

.comments-text {
  background: #fafafa;
  padding: 12px 16px;
  border-radius: 6px;
  color: #606266;
  line-height: 1.6;
  min-height: 60px;
}

/* 回复部分样式 */
.reply-content {
  background: #f0f9eb;
  padding: 12px 16px;
  border-radius: 6px;
  color: #67c23a;
  line-height: 1.6;
  margin-bottom: 12px;
}

.reply-status {
  margin-top: 8px;
}

.reply-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}

:deep(.el-textarea__inner) {
  border-radius: 8px;
  padding: 12px;
  font-size: 14px;
}

:deep(.el-textarea__inner:focus) {
  border-color: #409EFF;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.1);
}

/* 对话框标题样式 */
:deep(.el-dialog__header) {
  padding: 20px 30px;
  margin-right: 0;
  border-bottom: 1px solid #f0f0f0;
  background: #f8f9fa;
}

:deep(.el-dialog__title) {
  font-weight: 600;
  font-size: 18px;
}

:deep(.el-dialog__footer) {
  padding: 20px 30px;
  border-top: 1px solid #f0f0f0;
}

/* 评分星星样式 */
:deep(.el-rate__icon) {
  font-size: 20px;
  margin-right: 4px;
}

:deep(.el-rate__text) {
  font-size: 14px;
  margin-left: 8px;
}
</style>