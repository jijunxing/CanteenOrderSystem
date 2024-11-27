<template>
  <div>

    <div class="card" style="line-height: 30px">
      <div>欢迎您，<span style="color:#1450aa">{{ user.name }}</span> 祝您今天过得开心！</div>
    </div>

    <div class="card">
      <div style="display: flex; flex-wrap: wrap">
        <div v-for=" item in data.tables" :key="item.id" style="text-align: center; margin-right: 20px; margin-bottom: 20px ">
          <div style="font-weight: bold">{{ item.no }}</div>
          <div><img src="@/assets/imgs/餐饮.png" alt="" style="width: 100px"></div>
          <div>规格：{{ item.unit }}</div>
          <div style="margin: 10px 0">
            <el-button type="success" size="small" v-if="item.free === '是' && user.role==='USER'" @click="addOrder(item)">空闲</el-button>
            <el-tag  type="warning" v-else>占用</el-tag>
            <el-tag type="success" v-if="item.free === '是' && user.role==='ADMIN'">空闲</el-tag>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
  import { reactive } from "vue";
  import request from "@/utils/request";
  import router from "@/router";
  import {ElMessage} from "element-plus";

  const user = JSON.parse(localStorage.getItem('canteen-user') || '{}')

  const data = reactive({
    tables: []
  })

  const loadTables = () => {
    request.get('/tables/selectAll').then(res => {
      data.tables = res.data || []
    })
  }
  loadTables()

  const addOrder = (item) => {
    item.userId = user.id;
    request.put('/tables/addOrder', item).then(res => {
      if(res.code === '200')
        router.push('/orders')
      else
        ElMessage.error(res.msg)
    })
  }

</script>