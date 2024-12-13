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
            <strong>用户名称: {{ order.userName }}</strong>
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
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed } from "vue";
import request from "@/utils/request";
import { ElMessage } from "element-plus";

const data = reactive({
  user: JSON.parse(localStorage.getItem("canteen-user") || "{}"), // 获取当前用户信息
  tableData: [], // 存储所有订单数据
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

.el-rate {
  margin-left: 10px;
}

.el-rate__item {
  font-size: 20px; /* 调整评分星星大小 */
}

</style>
