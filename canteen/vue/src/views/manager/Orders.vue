<template>
  <div>

    <div class="card" style="margin-bottom: 5px">

      <div v-if="data.table.no">
        <div style="display: flex; align-items: center">
          <div style="flex: 1">
            <span style="margin-right: 10px">桌号 {{ data.table.no }} ,开始点餐</span>
            <el-badge v-if="data.total" :value="data.total" class="item">
              <el-button type="primary" @click="showOrderList">已点菜品</el-button>
            </el-badge>
            <el-button v-else type="primary" @click="showOrderList">已点菜品</el-button>
          </div>
          <el-button type="primary" @click="removeOrder">换张桌子</el-button>
        </div>
      </div>

      <div v-else style="color: #666;">
        您还未选择餐桌，请先<a href="/home">选择合适的餐桌</a>再点餐
      </div>
    </div>

    <el-row :gutter="10">
      <el-col :span="6" v-for="item in data.foodsList" :key="item.id">
        <div class="card">
          <img :src="item.img" alt="" style="width: 100%; height: 300px">
          <div style="margin: 5px; color: #000; font-size: 18px; display: flex; align-items: center">
            <div style="flex: 1">{{ item.name }}</div>
            <div style="color: red; font-weight: bold">￥{{ item.price }}</div>
          </div>
          <div style="margin: 5px; color: #666">
            <el-tooltip :content="item.descr" effect="light" v-if="item.descr.length >= 20">
              <div class="line1">{{ item.descr }}</div>
            </el-tooltip>
            <div v-else>{{ item.descr }}</div>
          </div>
          <div style="margin: 10px 0; text-align: right">
            <span style="margin-right: 50px">已售：{{item.sales}}</span>
            <el-input-number :min="1" v-model="item.quantity" style="margin-right: 5px"></el-input-number>
            <el-button type="primary" @click="addToCart(item)">点餐</el-button>
          </div>
        </div>
      </el-col>
    </el-row>

    <el-dialog v-model="data.dialogShow" title="已点菜品" width="800">
      <el-table :data="data.orderList" :key="data.itemkey">
        <el-table-column label="图片">
          <template #default="scope">
            <el-image style="width: 50px; height: 50px" :src="scope.row.img" :preview-src-list="[scope.row.img]"
                      preview-teleported></el-image>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="菜品" width="150"/>
        <el-table-column prop="price" label="价格" width="200"/>
        <el-table-column prop="quantity" label="数量"/>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button type="primary" :icon="SemiSelect" circle @click="dropOne(scope.row)"/>
            <el-button type="danger" :icon="Delete" circle @click="dropAll(scope.row)"/>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top: 10px; width: 100%">
        <el-input v-model="data.remark" placeholder="如有特殊需求，请备注"></el-input>
      </div>
      <div style="text-align: right; color: red; font-weight: bold; font-size: 20px; margin-top: 10px">
        总计￥{{ data.orderTotal }}
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="data.dialogShow = false">关闭</el-button>
          <el-button type="primary" @click="save">提交订单</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import {reactive , ref} from "vue";
import request from "@/utils/request";
import {ElMessage} from "element-plus";
import router from "@/router";
import {SemiSelect, Delete} from '@element-plus/icons-vue';

const data = reactive({
  table: {},
  user: JSON.parse(localStorage.getItem('canteen-user') || '{}'),
  foodsList: [],
  dialogShow: false,
  orderList: [],
  total: 0,
  orderTotal: 0,
  cart: {},
  remark: ref('')
})

const loadTable = () => {
  request.get('/tables/selectByUserId/' + data.user.id).then(res => {
    data.table = res.data || {}
  })
}
loadTable()

const removeOrder = () => {
  request.put('/tables/removeOrder', data.table).then(res => {
    if (res.code === '200') {
      ElMessage.success('退桌成功')
      data.table.no = undefined
      loadTable()
      router.push('/home')
    } else {
      ElMessage.error(res.msg)
    }
  })
}

const loadFoods = () => {
  request.get('/foods/selectAll').then(res => {
    data.foodsList = res.data || []
    data.foodsList.forEach(item => item.quantity = 1)
  })
}
loadFoods()

const getOrderList = () => {
  request.get('/cart/selectAll/' + data.user.username).then(res => {
    if (res.code === '200') {
      data.orderList = res.data
      data.total = data.orderList.map(item => item.quantity).reduce((acc, cur) => acc + cur, 0)
      data.orderTotal = 0
      data.orderList.forEach(item => {
        data.orderTotal += item.price * item.quantity
      })
    } else {
      ElMessage.error(res.msg)
    }
  })
}
getOrderList()

const showOrderList = () => {
  getOrderList()
  data.dialogShow = true;
}

const addToCart = async (foods) => {
  if (data.table.no === undefined) {
    ElMessage({
      message: '请先选择餐桌再点餐',
      type: 'warning'
    })
    return
  }

  const res = await request.get('/cart/selectAll/' + data.user.username);
  data.orderList = res.data;
  let o = data.orderList.find(item => item.foodsId === foods.id);
  if (o != null) {
    o.quantity += foods.quantity;
    // 等待更新购物车数据的异步请求完成
    const updateRes = await request.put('/cart/update', o);
    if (res.code === '200') {
      ElMessage.success('添加菜品成功')
    } else
      ElMessage.error(res.msg)
  } else {
    data.cart.userId = data.user.id;
    data.cart.foodsId = foods.id;
    data.cart.quantity = foods.quantity;
    // 等待添加购物车数据的异步请求完成
    const addRes = await request.post('/cart/add', data.cart);
    if (addRes.code === '200') {
      ElMessage.success('添加菜品成功')
    } else
      ElMessage.error(res.msg)
  }
  //最后调用getOrderList更新购物车
  await getOrderList()
}

const emit = defineEmits(["updateUser"])

const save = async () => {
  if (data.orderList.length === 0) {
    ElMessage.warning('请先选择商品再下单')
    return
  }
  let content = ''
  data.orderList.forEach(item => {
    content += item.name + 'x' + item.quantity + '，'
  })
  content = content.substring(0, content.length - 1)
  let remark = ''
  if(data.remark === '')
    remark = '无'
  else remark = data.remark

  let orderData = {
    content: content, remark: remark, total: data.orderTotal,
    userId: data.user.id, status: '待出餐', tableNo: data.table.no
  }
  if(orderData.total > data.user.account){
    ElMessage.warning('余额不足')
    return
  }
  //下单时将购物车对应的菜品销量量增加
  for (const order of data.orderList) {
    console.log(order)
    console.log(data.foodsList)
    let sale_food = data.foodsList.find(food => food.id === order.foodsId)
    console.log(sale_food)
    sale_food.sales += order.quantity
    console.log(sale_food)
    await request.put('/foods/update', sale_food).then(res => {
      if(res.code !== '200')
        ElMessage.error(res.msg)
    })
  }
  //下单后清空购物车
  await request.post('/orders/add', orderData).then(res => {
    if (res.code === '200') {
      ElMessage.success('下单成功')
      data.dialogShow = false;
      data.orderList.forEach(item => {
        dropAllSilent(item)
      })
      data.remark=''
    } else {
      ElMessage.error(res.msg)
      return
    }
  })
  getOrderList()
  data.user.account -= orderData.total
  localStorage.setItem('canteen-user', JSON.stringify(data.user))
  request.put('/user/update', data.user)
  emit('updateUser')
}

const dropOne = async (cart) => {
  cart.quantity -= 1
  if (cart.quantity > 0) {
    await request.put('/cart/update', cart).then(res => {
      if (res.code === '200') {
        ElMessage.success('删除菜品成功')
        data.itemkey = Math.random()
      } else
        ElMessage.error(res.msg)
    })
  } else {
    dropAll(cart)
  }
  getOrderList()
}

const dropAll = async (cart) => {
  await request.delete('/cart/delete/' + cart.id).then(res => {
    if (res.code === '200') {
      ElMessage.success('删除菜品成功')
      data.itemkey = Math.random()
    } else {
      ElMessage.error(res.msg)
    }
  })
  getOrderList()
}

const dropAllSilent = async (cart) => {
  await request.delete('/cart/delete/' + cart.id).then(res => {
    if (res.code === '200') {
      data.itemkey = Math.random()
    } else {
      ElMessage.error(res.msg)
    }
  })
  getOrderList()
}
</script>

<style scoped>

</style>