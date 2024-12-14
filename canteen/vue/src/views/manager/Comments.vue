<template>
  <div>
    <!-- 评价列表 -->
    <div class="cards-container">
      <el-card
          v-for="order in filteredOrders"
          :key="order.orderNo"
          class="order-card"
          shadow="hover"
          style="margin-bottom: 20px"
      >
        <div class="order-card-header">
          <h3>订单号: {{ order.orderNo }}</h3>
          <span class="order-status">{{ order.status }}</span>
        </div>

        <div class="order-card-body">
          <div class="user-info">
            <img :src="order.userAvatar" alt="用户头像" class="user-avatar"/>
            <strong>{{ order.userName }}</strong>
          </div>

          <div class="menu-content">
            <p><strong>菜单内容:</strong> {{ order.content }}</p>
          </div>

          <div class="rating">
            <el-rate v-model="order.score" size="medium" disabled />
          </div>

          <div class="comments">
            <p class="comment-text"><strong>用户评价:</strong></p>
            <p class="comment-content">{{ order.comments || '暂无用户评价' }}</p>
          </div>

          <div class="response">
            <p class="response-title"><strong>商家回复:</strong></p>
            <p class="response-content">{{ order.response || '暂无商家回复' }}</p>
          </div>

          <div class="order-time">
            <p><strong>下单时间:</strong> {{ order.time }}</p>
          </div>

          <!-- 仅管理员可见的回复按钮 -->
          <div v-if="data.user.role === 'ADMIN' && !order.response" class="reply-button">
            <el-button type="primary" @click="openReplyDialog(order)">回复</el-button>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 回复对话框 -->
    <el-dialog v-model="data.replyDialogVisible" title="商家回复" width="30%" destroy-on-close>
      <el-form :model="data.replyForm" label-width="100px">
        <el-form-item label="回复内容" prop="response">
          <el-input type="textarea" v-model="data.replyForm.response" rows="4" placeholder="请输入商家回复" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="data.replyDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitReply">提交</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { reactive, computed } from "vue";
import request from "@/utils/request";
import { ElMessage } from "element-plus";

const data = reactive({
  user: JSON.parse(localStorage.getItem("canteen-user") || "{}"), // 获取当前用户信息
  tableData: [], // 存储所有订单数据
  replyDialogVisible: false, // 控制回复对话框的显示
  replyForm: { response: "" }, // 回复表单数据
  currentOrder: null, // 当前需要回复的订单
});

// 加载所有订单数据
const load = () => {
  request.get("/orders/selectAll").then((res) => {
    if (res.code === "200") {
      data.tableData = res.data || [];
    } else {
      ElMessage.error(res.msg);
    }
  });
};

// 初始化加载数据
load();

// 计算已评价的订单
const filteredOrders = computed(() => {
  return data.tableData.filter(order => order.score > 0 && order.comments);
});

// 打开回复对话框
const openReplyDialog = (order) => {
  data.currentOrder = order;
  data.replyForm.response = order.response || ''; // 如果已有回复则预填
  data.replyDialogVisible = true;
};

// 提交商家回复
const submitReply = () => {
  const { response } = data.replyForm;
  if (!response) {
    ElMessage.warning("回复内容不能为空");
    return;
  }

  data.currentOrder.response = response
  request.put("/orders/update", data.currentOrder).then((res) => {
    if (res.code === "200") {
      ElMessage.success("回复成功");
      // 更新订单数据
      data.replyDialogVisible = false;
    } else {
      ElMessage.error(res.msg);
    }
  });
};
</script>

<style scoped>
.cards-container {
  display: flex;
  flex-direction: column;
  align-items: center; /* 垂直居中 */
  justify-content: flex-start; /* 默认向上排列 */
  padding: 20px;
  width: 100%; /* 使容器宽度占满屏幕 */
  max-width: 1200px; /* 限制容器的最大宽度 */
  margin: 0 auto; /* 水平居中 */
}

.order-card {
  padding: 20px;
  border-radius: 12px;
  background-color: #fff;
  border: 1px solid #e4e7ed;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 100%; /* 默认宽度 */
  max-width: 800px; /* 限制卡片最大宽度 */
  margin-bottom: 20px;
}

.order-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.order-status {
  background-color: #f5f5f5;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
  color: #409eff;
}

.order-card-body {
  padding: 10px 0;
}

.user-info {
  font-size: 16px;
  color: #333;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
}

.menu-content {
  font-size: 14px;
  margin-bottom: 10px;
}

.rating {
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.comment-text,
.response-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
}

.comment-content,
.response-content {
  font-size: 14px;
  line-height: 1.6;
  color: #666;
  background-color: #f9f9f9;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ddd;
}

.response-content {
  background-color: #e6f7ff; /* 商家回复背景色 */
  border: 1px solid #b3d8ff;
  color: #3399ff;
}

.comment-content {
  background-color: #f9f9f9; /* 用户评价背景色 */
  border: 1px solid #ddd;
}

.order-time {
  font-size: 14px;
  color: #999;
  margin-top: 15px;
}

.reply-button {
  margin-top: 10px;
}

.el-rate {
  margin-left: 10px;
}

.el-rate__item {
  font-size: 20px; /* 调整评分星星大小 */
}
</style>
