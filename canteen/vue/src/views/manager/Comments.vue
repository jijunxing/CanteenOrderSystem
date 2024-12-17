<template>
  <div>
    <!-- 评分统计和筛选条件区域 -->
    <div class="stats-container">
      <div class="stats-box">
        <!-- 左侧：平均评分 -->
        <div class="rating-section">
          <div class="rating-circle">
            <span class="big-score">{{ averageScore }}</span>
            <span class="score-label">分</span>
          </div>
          <div class="rating-details">
            <h3>总体评分</h3>
            <el-rate v-model="averageScore" disabled show-score />
            <div class="total-reviews">共收到 {{ totalReviews }} 条评价</div>
          </div>
        </div>

        <!-- 右侧：评分分布 -->
        <div class="filter-section">
          <h3>评分筛选</h3>
          <el-select v-model="data.selectedFilter" class="filter-select">
            <el-option label="全部评价" value="all">
              <span class="filter-label">全部评价</span>
              <span class="filter-count">({{ totalReviews }})</span>
            </el-option>
            <el-option label="好评" value="good">
              <span class="filter-label">好评 (4-5分)</span>
              <span class="filter-count">({{ goodReviewsCount }})</span>
            </el-option>
            <el-option label="差评" value="bad">
              <span class="filter-label">差评 (1-2分)</span>
              <span class="filter-count">({{ badReviewsCount }})</span>
            </el-option>
          </el-select>
        </div>
      </div>
    </div>

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
            <img :src="order.userAvatar" alt="用户头像" class="user-avatar" />
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
  selectedFilter: 'all', // 当前选择的筛选条件
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

// 计算已评价的订单，并根据筛选条件过滤
const filteredOrders = computed(() => {
  let orders = data.tableData.filter(order => order.score > 0 && order.comments);

  if (data.selectedFilter === 'good') {
    orders = orders.filter(order => order.score >= 4);
  } else if (data.selectedFilter === 'bad') {
    orders = orders.filter(order => order.score <= 2);
  }

  return orders;
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

  data.currentOrder.response = response;
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

// 在 computed 部分添加新的计算属性
const averageScore = computed(() => {
  const reviewedOrders = data.tableData.filter(order => order.score > 0);
  if (reviewedOrders.length === 0) return 0;
  const totalScore = reviewedOrders.reduce((sum, order) => sum + order.score, 0);
  return Number((totalScore / reviewedOrders.length).toFixed(1));
});

const totalReviews = computed(() => {
  return data.tableData.filter(order => order.score > 0).length;
});

// 添加新的计算属性
const goodReviewsCount = computed(() => {
  return data.tableData.filter(order => order.score >= 4).length;
});

const badReviewsCount = computed(() => {
  return data.tableData.filter(order => order.score <= 2).length;
});
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

.filter-container {
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  gap: 10px;
  padding:  0; /* 增加上下间距 */
}

.average-rating-container {
  display: flex;
  justify-content: center;
  padding: 20px 0;
}

.average-rating-box {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 100%;
  max-width: 400px;
}

.average-rating-box h3 {
  color: #333;
  margin-bottom: 15px;
}

.rating-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
}

.average-score {
  font-size: 36px;
  font-weight: bold;
  color: #409EFF;
}

.total-reviews {
  margin-top: 10px;
  color: #666;
  font-size: 14px;
}

.stats-container {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.stats-box {
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 30px;
}

.rating-section {
  display: flex;
  align-items: center;
  gap: 30px;
  flex: 1;
}

.rating-circle {
  background: linear-gradient(135deg, #409EFF, #36D1DC);
  width: 100px;
  height: 100px;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
}

.big-score {
  font-size: 40px;
  font-weight: bold;
  line-height: 1;
}

.score-label {
  font-size: 14px;
  margin-top: 4px;
}

.rating-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.rating-details h3 {
  margin: 0;
  color: #303133;
  font-size: 16px;
}

.filter-section {
  flex: 1;
  max-width: 250px;
}

.filter-section h3 {
  margin: 0 0 12px 0;
  color: #303133;
  font-size: 16px;
}

.filter-select {
  width: 100%;
}

.filter-label {
  font-size: 14px;
  color: #303133;
}

.filter-count {
  margin-left: 8px;
  color: #909399;
  font-size: 13px;
}

.total-reviews {
  color: #909399;
  font-size: 13px;
  margin-top: 4px;
}

.cards-container {
  margin-top: 20px;
}
</style>
