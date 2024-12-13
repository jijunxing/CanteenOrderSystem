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
    <el-dialog v-model="data.evaluationDialogVisible" title="评价订单" width="500px" destroy-on-close>
      <el-rate v-model="data.evaluationScore" size="large" style="margin-left: 80px" />
      <el-input v-model="data.evaluationComments" type="textarea" placeholder="请输入评价内容" rows="4" style="margin-top: 20px;" />
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="data.evaluationDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitEvaluation">提交评价</el-button>
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
          <el-button v-if="data.curOrder.response == null" type="primary" @click="showResponseDialog">回复</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 商家回复对话框 -->
    <el-dialog v-model="data.responseVisible" title="商家回复" width="500px" destroy-on-close>
      <el-input v-model="data.response" type="textarea" placeholder="请输入回复内容" rows="4" />
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="data.responseVisible = false">取消</el-button>
          <el-button type="primary" @click="submitResponse">提交回复</el-button>
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
  pageSize: 10,  // 每页的个数
  formVisible: false,
  form: {},
  evaluationDialogVisible: false,  // 控制评价对话框显示
  commentsDialogVisible: false,  // 控制查看评价对话框显示
  responseVisible: false,  // 控制商家回复对话框显示
  evaluationScore: 0,  // 用户评分
  evaluationComments: '',  // 用户评价内容
  curOrder: {},  // 当前订单
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
  data.curOrder = order;
  data.evaluationScore = 0;  // 重置评分
  data.evaluationComments = '';  // 清空评论
  data.evaluationDialogVisible = true;  // 显示评价对话框
};

const submitEvaluation = () => {
  if (data.evaluationScore === 0 || !data.evaluationComments.trim()) {
    ElMessage.warning('请提供评分和评价内容');
    return;
  }

  // 更新订单的评价
  data.curOrder.score = data.evaluationScore;
  data.curOrder.comments = data.evaluationComments;
  data.curOrder.status = '已完成'
  request.put('/orders/update', data.curOrder).then(res => {
    if (res.code === '200') {
      ElMessage.success('评价提交成功');
      data.evaluationDialogVisible = false;
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

const showResponseDialog = () => {
  data.response = '';  // 清空回复内容
  data.responseVisible = true;  // 显示商家回复对话框
};

const submitResponse = () => {
  data.curOrder.response = data.response;
  request.put('/orders/update', data.curOrder).then(res => {
    if (res.code === '200') {
      ElMessage.success('回复提交成功');
      data.responseVisible = false;
      load();  // 重新加载数据
    } else {
      ElMessage.error(res.msg);
    }
  });
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
</style>
