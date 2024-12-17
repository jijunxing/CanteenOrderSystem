<template>
  <div>
    <div>
      <!-- 订单数据表格 -->
      <div class="card" style="margin-bottom: 10px">
        <el-table :data="data.tableData" style="width: 100%">
          <el-table-column prop="orderNo" label="订单号" width="200"/>
          <el-table-column prop="tableNo" label="桌号" width="70"/>
          <el-table-column prop="content" label="菜单内容" width="400"/>
          <el-table-column prop="remark" label="备注" />
          <el-table-column prop="status" label="订单状态">
            <template #default="scope">
              <el-tag type="primary" v-if="scope.row.status === '待出餐'">{{scope.row.status}}</el-tag>
              <el-tag type="warning" v-if="scope.row.status === '待评价'">{{scope.row.status}}</el-tag>
              <el-tag type="success" v-if="scope.row.status === '已完成'">{{scope.row.status}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="score" label="用户评分" width="220" size="small">
            <template #default="scope">
              <span v-if="scope.row.score == 0">暂未评价</span>
              <span v-else>
              <el-rate v-model="scope.row.score" style="margin-left: 0; display: inline-block;" disabled/>
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="time" label="下单时间" width="110"/>
          <el-table-column prop="userName" label="用户名称" width="100"/>
          <el-table-column prop="total" label="总价" width="100">
            <template #default="scope">
              <strong style="color:red;">￥{{scope.row.total}}</strong>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template #default="scope">
              <!-- 根据订单状态显示不同按钮 -->
              <el-button v-if="scope.row.status === '待评价'" size="small" @click="showEvaluationDialog(scope.row)">评价订单</el-button>
              <el-button v-if="scope.row.status === '已完成'" size="small" @click="showCommentsDialog(scope.row)">查看评价</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 分页 -->
      <div class="card" v-if="data.total">
        <el-pagination background layout="prev, pager, next" @current-change="load" :page-size="data.pageSize"
                       v-model:current-page="data.pageNum" :total="data.total"/>
      </div>
    </div>

    <!-- 用户评价对话框 -->
    <el-dialog 
      v-model="data.dialogVisible" 
      title="订单评价" 
      width="500px"
      :close-on-click-modal="false"
      class="rating-dialog"
    >
      <div class="rating-content">
        <!-- 订单信息概览 -->
        <div class="order-summary">
          <div class="order-no">订单号：{{ data.currentOrder.orderNo }}</div>
          <div class="order-time">下单时间：{{ data.currentOrder.time }}</div>
        </div>

        <!-- 菜品列表 -->
        <div class="dishes-list">
          <div class="list-title">点餐内容</div>
          <div class="dishes-content">{{ data.currentOrder.content }}</div>
        </div>

        <!-- 评分部分 -->
        <div class="rating-section">
          <div class="rating-title">为这次用餐体验打分</div>
          <el-rate
            v-model="data.currentOrder.score"
            :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
            :texts="['失望', '一般', '满意', '推荐', '超赞']"
            show-text
            size="large"
          />
        </div>

        <!-- 评价输入 -->
        <div class="comment-section">
          <div class="comment-title">写下您的评价</div>
          <el-input
            v-model="data.currentOrder.comments"
            type="textarea"
            :rows="4"
            placeholder="请分享您的用餐体验，帮助我们提供更好的服务..."
            resize="none"
            maxlength="200"
            show-word-limit
          />
        </div>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="data.dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submit" :disabled="!data.currentOrder.score">
            提交评价
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 查看评价对话框 -->
    <el-dialog v-model="data.commentsDialogVisible" title="用户评价" width="500px" destroy-on-close>
      <!-- 用户评分和评论展示 -->
      <div class="card">
        <div class="evaluation-item">
          <span><strong>用户评分:</strong></span>
          <el-rate v-model="data.curOrder.score" size="large" disabled />
        </div>
        <div class="evaluation-item">
          <span><strong>用户评价:</strong></span>
          <p>{{ data.curOrder.comments || '暂无用户评价' }}</p>
        </div>
      </div>
      <!-- 商家回复 -->
      <div class="card" v-if="data.curOrder.response">
        <div class="evaluation-item">
          <span><strong>商家回复:</strong></span>
          <p>{{ data.curOrder.response }}</p>
        </div>
      </div>
      <div class="card" v-else>
        <div class="evaluation-item">
          <span><strong>商家回复:</strong></span>
          <p>暂无商家回复</p>
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="data.commentsDialogVisible = false">关闭</el-button>
        </div>
      </template>
    </el-dialog>

  </div>
</template>

<script setup>
import { reactive } from "vue";
import request from "@/utils/request";
import { ElMessage } from "element-plus";

const data = reactive({
  user: JSON.parse(localStorage.getItem('canteen-user') || '{}'),
  tableData: [],
  total: 0,
  pageNum: 1,  // 当前的页码
  pageSize: 9,  // 每页的个数
  formVisible: false,
  form: {},
  dialogVisible: false,  // 控制评价对话框显示
  commentsDialogVisible: false,  // 控制查看评价对话框显示
  responseVisible: false,  // 控制商家回复对话框显示
  currentOrder: {},  // 当前订单
  response: '',  // 商家回复内容
});

const load = () => {
  request.get('/orders/selectPage', {
    params: {
      pageNum: data.pageNum,
      pageSize: data.pageSize,
      name: data.user.name
    }
  }).then(res => {
    data.tableData = res.data?.list || [];
    data.total = res.data.total;
  });
};

load();

const showEvaluationDialog = (order) => {
  data.currentOrder = order;
  data.dialogVisible = true;  // 显示评价对话框
};

const submit = () => {
  if (data.currentOrder.score === 0 || !data.currentOrder.comments.trim()) {
    ElMessage.warning('请提供评分和评价内容');
    return;
  }

  // 更新订单的评价
  data.currentOrder.score = data.currentOrder.score;
  data.currentOrder.comments = data.currentOrder.comments;
  data.currentOrder.status = '已完成'
  request.put('/orders/update', data.currentOrder).then(res => {
    if (res.code === '200') {
      ElMessage.success('评价提交成功');
      data.dialogVisible = false;
      load();  // 重新加载数据
    } else {
      ElMessage.error(res.msg);
    }
  });
};

const showCommentsDialog = (order) => {
  data.curOrder = order;
  data.commentsDialogVisible = true;  // 显示查看评价对话框
};

</script>

<style scoped>
.card {
  border: 1px solid #e4e7ed;
  margin-bottom: 15px;
  border-radius: 8px;
  padding: 15px;
  background-color: #fff;
}

.evaluation-item {
  margin-bottom: 10px;
}

.dialog-footer {
  text-align: right;
}

.el-rate {
  margin-left: 80px;
}

.el-input__inner {
  border-radius: 8px;
}

/* 评价对话框样式 */
.rating-dialog :deep(.el-dialog__body) {
  padding: 0;
}

.rating-content {
  padding: 20px 30px;
}

.order-summary {
  background: #f8f9fa;
  padding: 15px 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 14px;
  color: #606266;
}

.order-no {
  margin-bottom: 8px;
  font-weight: 500;
}

.dishes-list {
  margin-bottom: 24px;
}

.list-title, .rating-title, .comment-title {
  font-size: 16px;
  font-weight: 500;
  color: #303133;
  margin-bottom: 12px;
}

.dishes-content {
  background: #fafafa;
  padding: 12px 16px;
  border-radius: 6px;
  color: #606266;
  line-height: 1.6;
}

.rating-section {
  margin-bottom: 24px;
  padding: 20px;
  background: #fff9f2;
  border-radius: 8px;
}

.rating-section :deep(.el-rate) {
  margin-top: 10px;
}

.rating-section :deep(.el-rate__text) {
  font-size: 14px;
  margin-left: 10px;
}

.comment-section {
  margin-bottom: 10px;
}

.comment-section :deep(.el-textarea__inner) {
  border-radius: 8px;
  padding: 12px;
  font-size: 14px;
}

.comment-section :deep(.el-textarea__inner:focus) {
  border-color: #409EFF;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.1);
}

/* 对话框标题和底部样式 */
:deep(.el-dialog__header) {
  padding: 20px 30px;
  margin-right: 0;
  border-bottom: 1px solid #f0f0f0;
}

:deep(.el-dialog__title) {
  font-weight: 600;
  font-size: 18px;
}

:deep(.el-dialog__footer) {
  padding: 20px 30px;
  border-top: 1px solid #f0f0f0;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* 评分星星样式 */
:deep(.el-rate__icon) {
  font-size: 24px;
  margin-right: 6px;
}

:deep(.el-rate__text) {
  font-size: 14px;
}
</style>
