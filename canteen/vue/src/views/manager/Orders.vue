<template>
  <div class="orders-page">
    <!-- 顶部餐桌信息卡片 -->
    <div class="info-card">
      <template v-if="data.table.no">
        <div class="table-info">
          <div class="left-section">
            <span class="table-text">桌号 {{ data.table.no }}</span>
            <el-badge v-if="data.total" :value="data.total" class="cart-badge">
              <el-button type="primary" @click="showOrderList">已点菜品</el-button>
            </el-badge>
            <el-button v-else type="primary" @click="showOrderList">已点菜品</el-button>
            <el-select 
              v-model="data.dishType" 
              placeholder="菜品类型" 
              clearable 
              @change="loadFoods"
              class="type-select"
            >
              <el-option 
                v-for="item in data.type" 
                :key="item.id" 
                :label="item.type" 
                :value="item.type"
              />
            </el-select>
          </div>
          <el-button type="warning" @click="removeOrder">换张桌子</el-button>
        </div>
      </template>
      <div v-else class="no-table-tip">
        您还未选择餐桌，请先<router-link to="/home" class="select-table-link">选择合适的餐桌</router-link>再点餐
      </div>
    </div>

    <!-- 菜品展示网格 -->
    <div class="foods-grid">
      <el-card 
        v-for="item in data.foodsList" 
        :key="item.id" 
        class="food-card"
        :body-style="{ padding: '0px' }"
      >
        <div class="food-image">
          <el-image 
            :src="item.img" 
            fit="cover"
            :preview-src-list="[item.img]"
            preview-teleported
          />
        </div>
        <div class="food-content">
          <div class="food-header">
            <h3 class="food-name">{{ item.name }}</h3>
            <div class="food-price">￥{{ item.price }}</div>
          </div>
          <div class="food-description">
            <el-tooltip 
              :content="item.descr" 
              effect="customized" 
              placement="top" 
              v-if="item.descr.length >= 20"
            >
              <div class="description-text">{{ item.descr }}</div>
            </el-tooltip>
            <div v-else class="description-text">{{ item.descr }}</div>
          </div>
          <div class="food-footer">
            <span class="sales-info">已售：{{ item.sales }}</span>
            <div class="order-actions">
              <el-input-number 
                v-model="item.quantity" 
                :min="1" 
                size="small"
                class="quantity-input"
              />
              <el-button type="primary" size="small" @click="addToCart(item)">
                加入购物车
              </el-button>
            </div>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 购物车对话框 -->
    <el-dialog 
      v-model="data.dialogShow" 
      title="已点菜品" 
      width="800px"
      class="cart-dialog"
    >
      <el-table :data="data.orderList" :key="data.itemkey" class="cart-table">
        <el-table-column label="图片" width="80">
          <template #default="scope">
            <el-image 
              :src="scope.row.img" 
              :preview-src-list="[scope.row.img]"
              preview-teleported
              class="cart-food-image"
            />
          </template>
        </el-table-column>
        <el-table-column prop="name" label="菜品" />
        <el-table-column prop="price" label="价格" width="100">
          <template #default="scope">
            <span class="price-text">￥{{ scope.row.price }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="quantity" label="数量" width="100" />
        <el-table-column label="操作" width="120">
          <template #default="scope">
            <el-button 
              type="primary" 
              :icon="SemiSelect" 
              circle 
              @click="dropOne(scope.row)"
            />
            <el-button 
              type="danger" 
              :icon="Delete" 
              circle 
              @click="dropAll(scope.row)"
            />
          </template>
        </el-table-column>
      </el-table>

      <div class="cart-footer">
        <el-input
          v-model="data.remark"
          type="textarea"
          placeholder="如有特殊需求，请备注"
          :rows="2"
          class="remark-input"
        />
        <div class="total-section">
          <span class="total-text">总计：</span>
          <span class="total-amount">￥{{ data.orderTotal }}</span>
        </div>
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

<style scoped>
.orders-page {
  padding: 20px;
}

.info-card {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

.table-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.left-section {
  display: flex;
  align-items: center;
  gap: 16px;
}

.table-text {
  font-size: 16px;
  color: #303133;
  margin-right: 16px;
}

.type-select {
  width: 140px;
}

.no-table-tip {
  color: #666;
  font-size: 14px;
}

.select-table-link {
  color: #409EFF;
  text-decoration: none;
  margin: 0 4px;
}

.select-table-link:hover {
  text-decoration: underline;
}

.foods-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.food-card {
  transition: all 0.3s;
  display: flex;
  flex-direction: column;
}

.food-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.food-image {
  height: 200px;
  overflow: hidden;
}

.food-image :deep(.el-image) {
  width: 100%;
  height: 100%;
}

.food-content {
  padding: 16px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.food-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.food-name {
  margin: 0;
  font-size: 16px;
  color: #303133;
}

.food-price {
  color: #f56c6c;
  font-size: 18px;
  font-weight: bold;
}

.food-description {
  color: #666;
  font-size: 14px;
  margin-bottom: 16px;
  min-height: 40px;
}

.description-text {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  min-height: 40px;
}

.food-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}

.sales-info {
  color: #909399;
  font-size: 13px;
}

.order-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.quantity-input {
  width: 100px;
}

.cart-dialog :deep(.el-dialog__body) {
  padding-top: 10px;
}

.cart-food-image {
  width: 50px;
  height: 50px;
  border-radius: 4px;
}

.cart-footer {
  margin-top: 20px;
}

.remark-input {
  margin-bottom: 16px;
}

.total-section {
  text-align: right;
  font-size: 16px;
}

.total-amount {
  color: #f56c6c;
  font-size: 24px;
  font-weight: bold;
}

.dialog-footer {
  text-align: right;
}

/* 自定义 tooltip 样式 */
:global(.el-popper.is-customized) {
  padding: 6px 12px;
  background: linear-gradient(90deg, rgb(159, 229, 151), rgb(204, 229, 129));
}

:global(.el-popper.is-customized .el-popper__arrow::before) {
  background: linear-gradient(45deg, #b2e68d, #bce689);
  right: 0;
}
</style>

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
  remark: ref(''),
  dishType: '',
  type: []
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
  request.get('/foods/selectAll', {
    params:{
      type: data.dishType
  }
  }).then(res => {
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

const getType = () => {
  request.get('/foods/getType').then(res => {
    if(res.code=== '200')
      data.type = res.data
    else
      ElMessage.error(res.msg)
  })
}
getType()
</script>