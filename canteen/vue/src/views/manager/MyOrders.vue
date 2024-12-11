<template>
  <div>
    <div>
      <div class="card" style="margin-bottom: 10px">
        <el-table :data="data.tableData" style="width: 100%">
          <el-table-column prop="id" label="序号" width="70"/>
          <el-table-column prop="orderNo" label="订单号" width="200"/>
          <el-table-column prop="tableNo" label="桌号" width="70"/>
          <el-table-column prop="content" label="菜单内容" width="400"/>
          <el-table-column prop="remark" label="备注" />
          <el-table-column prop="status" label="订单状态" >
            <template #default="scope">
              <el-tag type="primary" v-if="scope.row.status === '待出餐'">{{scope.row.status}}</el-tag>
              <el-tag type="warning" v-if="scope.row.status === '待结算'">{{scope.row.status}}</el-tag>
              <el-tag type="success" v-if="scope.row.status === '已完成'">{{scope.row.status}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="time" label="下单时间" />
          <el-table-column prop="userName" label="用户名称" width="100"/>
          <el-table-column prop="total" label="总价" width="100">
            <template #default="scope">
              <strong style="color:red;">￥{{scope.row.total}}</strong>
            </template>
          </el-table-column>

        </el-table>
      </div>

      <div class="card" v-if="data.total">
        <el-pagination background layout="prev, pager, next" @current-change="load" :page-size="data.pageSize"
                       v-model:current-page="data.pageNum" :total="data.total"/>
      </div>

    </div>
  </div>
</template>

<script setup>
import {reactive} from "vue"
import request from "@/utils/request";
import {ElMessage, ElMessageBox} from "element-plus";

const data = reactive({
  user: JSON.parse(localStorage.getItem('canteen-user') || '{}'),
  tableData: [
  ],
  total: 0,
  pageNum: 1,  // 当前的页码
  pageSize: 10,  // 每页的个数
  formVisible: false,
  form: {},
})

const load = () => {
  request.get('/orders/selectPage', {

    params:{
      pageNum: data.pageNum,
      pageSize: data.pageSize,
      name: data.user.name
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
  load();
}
</script>