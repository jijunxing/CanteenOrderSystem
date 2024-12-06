<template>
  <div>

    <div class="card" style="margin-bottom: 10px;">
      <el-input prefix-icon="Search" style="width: 300px; margin-right: 10px" placeholder="请输入名称查询" v-model="data.name"></el-input>
      <el-button type="primary" @click="load">查询</el-button>
      <el-button type="info" style="margin: 0 10px" @click="reset">重置</el-button>
    </div>

    <div class="card" style="margin-bottom: 10px">
      <div style="margin-bottom: 10px">
        <el-button type="primary" @click="handleAdd">新增</el-button>
      </div>
      <el-table :data="data.tableData" style="width: 100%">
        <el-table-column prop="id" label="序号" width="70"/>
        <el-table-column prop="username" label="账号"/>
        <el-table-column prop="name" label="名称"/>
        <el-table-column prop="avatar" label="头像">
          <template v-slot="scope">
            <img v-if="scope.row.avatar" :src="scope.row.avatar" alt="" style="width: 50px; height: 50px; border-radius: 50%">
          </template>
        </el-table-column>
        <el-table-column prop="role" label="角色"/>
        <el-table-column label="操作" width="180">
          <template #default="scope">
            <el-button type="primary" :icon="Edit" circle @click="handleEdit(scope.row)" />
            <el-button type="danger" :icon="Delete" circle @click="del(scope.row.id)" />
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="card" v-if="data.total">
      <el-pagination background layout="prev, pager, next" @current-change="load" :page-size="data.pageSize" v-model:current-page="data.pageNum" :total="data.total"/>
    </div>

    <el-dialog v-model="data.formVisible" title="信息" width="25%" destroy-on-close>
      <el-form :model="data.form" label-width="100px" style="padding-right: 50px">
        <el-form-item label="账号">
          <el-input v-model="data.form.username" autocomplete="off" :disabled="!!data.form.id" />
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="data.form.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="头像">
          <el-upload action="http://localhost:9090/files/upload" :on-success="handleFileUpload">
            <el-button type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="data.formVisible = false">取消</el-button>
          <el-button type="primary" @click="save">保存</el-button>
        </div>
      </template>
    </el-dialog>

  </div>
</template>

<script setup>
import {reactive} from "vue"
import request from "@/utils/request";
import {ElMessage, ElMessageBox} from "element-plus";
import {Delete, Edit} from '@element-plus/icons-vue';

const data = reactive({
  tableData: [
  ],
  total: 0,
  pageNum: 1,  // 当前的页码
  pageSize: 5,  // 每页的个数
  formVisible: false,
  form: {},
  name: ''
})

const load = () => {
  request.get('/admin/selectPage', {
    params:{
      pageNum: data.pageNum,
      pageSize: data.pageSize,
      name: data.name
    }
  }).then(res => {
    data.tableData = res.data?.list || []
    data.total = res.data.total
  })
}

load()

const reset = () => {
  data.name = null;
  load();
}

const handleAdd = () =>{
  data.form = {};//初始化
  data.formVisible = true;//显示
}

//保存数据
const save = () => {
  request.request({
    method: data.form.id ? 'PUT' : 'POST',
    url: data.form.id ? '/admin/update' : '/admin/add',
    data: data.form
  }).then(res => {
    if(res.code === '200'){
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
  ElMessageBox.confirm('删除后数据无法恢复,您确认要删除吗？', '确认删除', {type:'warning'}).then(res => {
    request.delete('admin/delete/'+id).then(res => {
      if(res.code === '200'){
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

const handleFileUpload = (file) => {
  data.form.avatar = file.data
}

</script>