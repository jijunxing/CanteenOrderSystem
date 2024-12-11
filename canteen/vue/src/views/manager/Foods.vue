<template>
  <div>

    <div class="card" style="margin-bottom: 10px;">
      <el-input prefix-icon="Search" style="width: 300px; margin-right: 10px" placeholder="请输入菜品名称查询" v-model="data.name"></el-input>
      <el-select v-model="data.dishType" placeholder="菜品类型" clearable @change="load" style="width:150px; margin-right: 10px">
        <el-option v-for="item in data.type" :key="item.id" :label="item.type" :value="item.type"/>
      </el-select>
      <el-button type="primary" @click="load">查询</el-button>
      <el-button type="info" style="margin: 0 10px" @click="reset">重置</el-button>
    </div>

    <div class="card" style="margin-bottom: 10px">
      <div style="margin-bottom: 10px">
        <el-button type="primary" @click="handleAdd">新增菜品</el-button>
        <el-button type="primary" plain @click="data.addTypeVisible=true">新增类别</el-button>
      </div>
      <el-table :data="data.tableData" style="width: 100%">
        <el-table-column prop="id" label="序号" width="70"/>
        <el-table-column prop="name" label="菜品名称" width="150"/>
        <el-table-column prop="type" label="类别" width="100"/>
        <el-table-column label="图片" width="200">
          <template v-slot="scope">
            <el-image style="width: 125px; height: 100px;" v-if="scope.row.img" :src="scope.row.img" :preview-src-list="[scope.row.img]" preview-teleported></el-image>
          </template>
        </el-table-column>
        <el-table-column prop="descr" label="简介" />
        <el-table-column prop="price" label="价格" width="100"/>
        <el-table-column prop="sales" label="销售量" width="100"/>
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
        <el-form-item label="菜名">
          <el-input v-model="data.form.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="类别">
          <el-select v-model="data.form.type" placeholder="菜品类型" clearable @change="load" style="width:150px; margin-right: 10px">
            <el-option v-for="item in data.type" :key="item.id" :label="item.type" :value="item.type"/>
          </el-select>
        </el-form-item>
        <el-form-item label="简介">
          <el-input type="textarea" v-model="data.form.descr" autocomplete="off" />
        </el-form-item>
        <el-form-item label="价格">
          <el-input v-model="data.form.price" autocomplete="off" />
        </el-form-item>
        <el-form-item label="图片">
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

    <el-dialog v-model="data.addTypeVisible" title="新增类别" width="25%" destroy-on-close>
      <el-form :model="data.typeForm" label-width="100px" style="padding-right: 50px">
        <el-form-item label="类别名">
          <el-input v-model="data.typeForm.type" autocomplete="off" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="data.addTypeVisible = false">取消</el-button>
          <el-button type="primary" @click="addType">保存</el-button>
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
  pageSize: 4,  // 每页的个数
  formVisible: false,
  addTypeVisible: false,
  form: {},
  typeForm: {},
  dishType: '',
  name: '',
  type: []
})

const load = () => {
  console.log(data.dishType)
  console.log(data.name)
  request.get('/foods/selectPage', {
    params:{
      pageNum: data.pageNum,
      pageSize: data.pageSize,
      name: data.name,
      type: data.dishType
    }
  }).then(res => {
    data.tableData = res.data?.list || []
    data.total = res.data.total
  })
}

load()

const reset = () => {
  data.name = null
  data.dishType = null
  load()
}

const handleAdd = () =>{
  data.form = {};//初始化
  data.formVisible = true;//显示
}

//保存数据
const save = () => {
  request.request({
    method: data.form.id ? 'PUT' : 'POST',
    url: data.form.id ? '/foods/update' : '/foods/add',
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
    request.delete('foods/delete/'+id).then(res => {
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
  data.form.img = file.data
}

const getType = () => {
  request.get('/foods/getType').then(res => {
    if(res.code=== '200')
      data.type = res.data
    else
      ElMessage.error(res.msg)
  })
}
getType()

const addType = () => {
  let type = data.type.find(item => item.type === data.typeForm.type)
  if(type === undefined){
    request.post('/foods/addType', data.typeForm).then(res => {
      if(res.code === '200') {
        ElMessage.success('添加成功')
        data.addTypeVisible=false
        getType()
      }
      else
        ElMessage.error(res.msg)
    })
  } else {
    ElMessage.warning('已有该类别')
  }
}
</script>