<template>
  <div>

    <div class="card" style="margin-bottom: 10px;">
      <el-input prefix-icon="Search" style="width: 300px; margin-right: 10px" placeholder="请输入餐桌号查询" v-model="data.no"></el-input>
      <el-select v-model="data.curUnit" placeholder="餐桌规格" clearable @change="load" style="width:150px; margin-right: 10px">
        <el-option v-for="item in data.unit" :key="item.id" :label="item.unit" :value="item.unit"/>
      </el-select>
      <el-button type="primary" @click="load">查询</el-button>
      <el-button type="info" style="margin: 0 10px" @click="reset">重置</el-button>
    </div>

    <div class="card" style="margin-bottom: 10px">
      <div style="margin-bottom: 10px">
        <el-button type="primary" @click="handleAdd">新增餐桌</el-button>
        <el-button type="primary" plain @click="data.manageUnitVisible=true">管理规格</el-button>
      </div>
      <el-table :data="data.tableData" style="width: 100%">
        <el-table-column prop="id" label="序号" width="70"/>
        <el-table-column prop="no" label="餐桌号"/>
        <el-table-column prop="unit" label="规格"/>
        <el-table-column prop="free" label="是否空闲">
        </el-table-column>
        <el-table-column prop="userName" label="占用顾客" />
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
        <el-form-item label="餐桌号">
          <el-input v-model="data.form.no" autocomplete="off" :disabled="!!data.form.id" />
        </el-form-item>
        <el-form-item label="规格">
          <el-select v-model="data.form.unit" placeholder="餐桌规格" clearable @change="load" style="width:150px; margin-right: 10px">
            <el-option v-for="item in data.unit" :key="item.id" :label="item.unit" :value="item.unit"/>
          </el-select>
        </el-form-item>
        <el-form-item label="是否空闲">
          <el-radio-group v-model="data.form.free">
            <el-radio label="是"></el-radio>
            <el-radio label="否"></el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="data.formVisible = false">取消</el-button>
          <el-button type="primary" @click="save">保存</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog v-model="data.manageUnitVisible" title="管理规格" width="20%">
      <el-table :data="data.unit">

        <el-table-column prop="unit" label="规格" />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button type="danger" icon="Delete" circle @click="deleteUnit(scope.row.id)"/>
          </template>
        </el-table-column>
      </el-table>

      <!-- 嵌套对话框 -->
      <el-dialog v-model="data.addUnitVisible" title="新增规格" destroy-on-close append-to-body width="15%">
        <el-form :model="data.unitForm" label-width="100px" style="padding-right: 50px">
          <el-form-item label="规格">
            <el-input v-model="data.unitForm.unit" autocomplete="off" />
          </el-form-item>
        </el-form>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="data.addUnitVisible = false">取消</el-button>
            <el-button type="primary" @click="addUnit">添加</el-button>
          </div>
        </template>
      </el-dialog>

      <!-- 主对话框底部 -->
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="data.manageUnitVisible = false">关闭</el-button>
          <el-button type="primary" @click="data.addUnitVisible = true">添加规格</el-button>
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
  tableData: [],
  total: 0,
  pageNum: 1,  // 当前的页码
  pageSize: 5,  // 每页的个数
  formVisible: false,
  manageUnitVisible: false,
  addUnitVisible: false,
  form: {},
  unitForm: {},
  name: '',
  curUnit: '',
  unit:[]
})

const load = () => {
  request.get('/tables/selectPage', {
    params:{
      pageNum: data.pageNum,
      pageSize: data.pageSize,
      no: data.no,
      unit: data.curUnit
    }
  }).then(res => {
    data.tableData = res.data?.list || []
    data.total = res.data.total
  })
}

load()

const reset = () => {
  data.no = null;
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
    url: data.form.id ? '/tables/update' : '/tables/add',
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
    request.delete('tables/delete/'+id).then(res => {
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

const deleteUnit = (id) => {
  ElMessageBox.confirm('删除后数据无法恢复,您确认要删除吗？', '确认删除', {type:'warning'}).then(res => {
    request.delete('/tables/deleteUnit/'+id).then(res => {
      if(res.code === '200'){
        ElMessage.success('操作成功')
        getUnit()
      } else {
        ElMessage.error(res.msg)
      }
    })
  }).catch(err => {
    console.log(err)
  })
}

const getUnit = () => {
  request.get('/tables/getUnit').then(res => {
    if(res.code=== '200')
      data.unit = res.data
    else
      ElMessage.error(res.msg)
  })
}
getUnit()

const addUnit = () => {
  let unit = data.unit.find(item => item.unit === data.unitForm.unit)
  if(unit === undefined){
    request.post('/tables/addUnit', data.unitForm).then(res => {
      if(res.code === '200') {
        ElMessage.success('添加成功')
        data.addUnitVisible=false
        getUnit()
      }
      else
        ElMessage.error(res.msg)
    })
  } else {
    ElMessage.warning('已有该规格')
  }
}
</script>