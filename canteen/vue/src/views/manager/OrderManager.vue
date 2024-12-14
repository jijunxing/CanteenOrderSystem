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
      <el-dialog v-model="data.commentsVisible" title="用户评价" width="400px" destroy-on-close>
        <div style="text-align: center; margin-bottom: 20px;">
          <el-rate v-model="data.curOrder.score" size="large" disabled />
        </div>
        <div style="padding: 10px;">
          <el-divider>评价内容</el-divider>
          <div class="card" style="padding: 10px; font-size: 14px; background-color: #f7f7f7;">
            {{ data.curOrder.comments || '暂无评价' }}
          </div>
        </div>
        <div style="padding: 10px;">
          <el-divider>商家回复</el-divider>
          <div class="card" style="padding: 10px; font-size: 14px; background-color: #f7f7f7;">
            {{ data.curOrder.response || '暂无回复' }}
          </div>
        </div>

        <template #footer>
          <div class="dialog-footer">
            <el-button @click="data.commentsVisible = false">关闭</el-button>
            <el-button v-if="!data.curOrder.response" type="primary" @click="data.responseVisible=true">回复</el-button>
          </div>
        </template>
      </el-dialog>

      <!-- 商家回复对话框 -->
      <el-dialog v-model="data.responseVisible" title="回复" destroy-on-close append-to-body width="400px">
        <el-input v-model="data.response" autocomplete="off" placeholder="请输入回复" rows="4" />
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="data.responseVisible = false">取消</el-button>
            <el-button type="primary" @click="response">回复</el-button>
          </div>
        </template>
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
  pageSize: 10,  // 每页的个数
  formVisible: false,
  commentsVisible: false,
  responseVisible: false,
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
  data.commentsVisible = true
}

const response = () => {
  if (data.curOrder.response != null && data.curOrder.response != '') {
    ElMessage.warning('已经回复过该评价')
    return
  }
  data.curOrder.response = data.response
  request.put('/orders/update', data.curOrder).then(res => {
    if (res.code === '200') {
      ElMessage.success('回复成功')
      load()
      data.responseVisible = false
    } else {
      ElMessage.error(res.msg)
    }
  })
}
</script>