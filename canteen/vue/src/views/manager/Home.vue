<template>
  <div class="home-container">
    <!-- 欢迎语 -->
    <div class="welcome-card">
      <div>欢迎您，<span class="user-name">{{ user.name }}</span> 祝您今天过得开心！</div>
    </div>

    <!-- 用户视角：餐桌选择区域 -->
    <div class="tables-section" v-if="user.role === 'USER'">
      <!-- 餐桌规格筛选 -->
      <div class="filter-bar">
        <el-select 
          v-model="data.curUnit" 
          placeholder="选择餐桌规格" 
          clearable 
          @change="loadTables"
          class="unit-select"
        >
          <el-option 
            v-for="item in data.unit" 
            :key="item.id" 
            :label="item.unit" 
            :value="item.unit"
          />
        </el-select>
      </div>

      <!-- 餐桌展示网格 -->
      <div class="tables-grid">
        <div 
          v-for="item in data.tables" 
          :key="item.id"
          class="table-card"
          :class="{ 'table-occupied': item.free === '否' }"
        >
          <div class="table-header">{{ item.no }}</div>
          <div class="table-image">
            <img src="@/assets/imgs/餐饮.png" alt="餐桌">
          </div>
          <div class="table-info">规格：{{ item.unit }}</div>
          <div class="table-status">
            <el-button 
              type="primary" 
              :plain="true"
              size="large"
              v-if="item.free === '是' && user.role === 'USER'"
              @click="addOrder(item)"
            >
              <el-icon><Select /></el-icon>
              选择此桌
            </el-button>
            <el-tag 
              v-if="item.free === '否'"
              type="warning"
              effect="dark"
              round
            >
              已占用
            </el-tag>
          </div>
        </div>
      </div>
    </div>

    <!-- 管理员视角部分保持不变 -->
    <div v-if="user.role === 'ADMIN'">
      <div class="card" style="margin-top: 3px">
        <el-row :gutter="16">
          <el-col :span="6">
            <div class="statistic-card">
              <el-statistic :value="data.todayOrderNum">
                <template #prefix>
                  <el-icon style="vertical-align: -0.125em">
                    <List/>
                  </el-icon>
                </template>
                <template #title>
                  <div style="display: inline-flex; align-items: center">
                    今日订单数
                  </div>
                </template>
              </el-statistic>
              <div class="statistic-footer">
                <div class="footer-item">
                  <span>than yesterday</span>
                  <span class="green" v-if="data.dif1>=0">
                    {{ data.dif1 }}
                  <el-icon>
                    <CaretTop/>
                  </el-icon>
                </span>
                  <span class="red" v-else>
                    {{ data.dif1 }}
                  <el-icon>
                    <CaretBottom/>
                  </el-icon>
                </span>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="statistic-card">
              <el-statistic :value="data.todayIncome">
                <template #prefix>
                  <div>￥</div>
                </template>
                <template #title>
                  <div style="display: inline-flex; align-items: center">
                    今日营业额
                  </div>
                </template>
              </el-statistic>
              <div class="statistic-footer">
                <div class="footer-item">
                  <span>than yesterday</span>
                  <span class="green" v-if="data.dif2>=0">
                  {{ data.dif2 }}
                  <el-icon>
                    <CaretTop/>
                  </el-icon>
                </span>
                  <span class="red" v-else>
                  {{ data.dif2 }}
                  <el-icon>
                    <CaretBottom/>
                  </el-icon>
                </span>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="statistic-card">
                <el-statistic :value="data.totalIncome">
                  <template #prefix>
                    <div v-if="data.chartType === 'income'">￥</div>
                  </template>
                  <template #title>
                    <div style="display: inline-flex; align-items: center">
                      近30日{{ data.chartType === 'income' ? '总营业额' : '总订单数' }}
                    </div>
                  </template>
                </el-statistic>
                <div class="statistic-footer">
                  <div class="chart-controls">
                    <el-radio-group v-model="data.chartType" @change="switchChartData" size="small">
                      <el-radio-button label="income">营业额</el-radio-button>
                      <el-radio-button label="orders">订单数</el-radio-button>
                    </el-radio-group>
                  </div>
                </div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="statistic-card">
              <el-statistic :value="data.todayUnfinishedOrderNum" title="New transactions today">
                <template #prefix>
                  <el-icon style="vertical-align: -0.125em">
                    <Failed/>
                  </el-icon>
                </template>
                <template #title>
                  <div style="display: inline-flex; align-items: center">
                    待出餐订单数
                  </div>
                </template>
              </el-statistic>
              <div class="statistic-footer">
                <div class="footer-item">
                  <a href="/OrderManager">>>查看</a>
                </div>
                <div class="footer-item">
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>

      <div class="card" id="incomeChart" style="width: 100%; margin-top: 3px" v-if="user.role === 'ADMIN'"></div>
    </div>
  </div>
</template>

<script setup>
import {reactive} from "vue";
import request from "@/utils/request";
import router from "@/router";
import {ElMessage} from "element-plus";
import moment from "moment";
import * as echarts from "echarts";
import { onMounted } from "vue";

const user = JSON.parse(localStorage.getItem('canteen-user') || '{}')

const data = reactive({
  tables: [],
  today: moment().format("YYYY-MM-DD").slice(0, 10),
  yesterday: moment().subtract(1,"days").format().slice(0, 10),
  todayOrderNum: 0,
  todayUnfinishedOrderNum: 0,
  todayIncome: 0,
  yesterdayOrderNum: 0,
  yesterdayIncome: 0,
  dif1: 0,
  dif2: 0,
  recentThirtyDays: [],
  income: [],
  totalIncome: 0,
  curUnit: '',
  unit: [],
  chartType: 'income',
  orderNums: []
})

const loadTables = () => {
  request.get('/tables/selectAll',{params:{unit:data.curUnit}
  }).then(res => {
    data.tables = res.data || []
  })
}
loadTables()

const addOrder = (item) => {
  item.userId = user.id;
  request.put('/tables/addOrder', item).then(res => {
    if (res.code === '200')
      router.push('/orders')
    else
      ElMessage.error(res.msg)
  })
}

const loadStatisticData = async () => {
  // console.log(data.today)
  await request.get('/orders/getNumByDate', {
    params: {
      date: data.today
    }
  }).then(res => {
    if (res.code === '200') {
      // console.log(res.data)
      data.todayOrderNum = res.data
    } else {
      ElMessage.error(res.msg)
    }
  })
  await request.get('/orders/getUnfinishedNum').then(res => {
    if (res.code === '200') {
      // console.log(res.data)
      data.todayUnfinishedOrderNum = res.data
    } else {
      ElMessage.error(res.msg)
    }
  })
  await request.get('/orders/getIncomeByDate', {
    params: {
      date: data.today
    }
  }).then(res => {
    if (res.code === '200') {
      // console.log(res.data)
      data.todayIncome = res.data ? res.data : 0
    } else {
      ElMessage.error(res.msg)
    }
  })
  // console.log(data.yesterday)
  await request.get('/orders/getNumByDate', {
    params: {
      date: data.yesterday
    }
  }).then(res => {
    if (res.code === '200') {
      // console.log(res.data)
      data.yesterdayOrderNum = res.data
    } else {
      ElMessage.error(res.msg)
    }
  })
  // console.log(data.dif1)
  await request.get('/orders/getIncomeByDate', {
    params: {
      date: data.yesterday
    }
  }).then(res => {
    if (res.code === '200') {
      // console.log(res.data)
      data.yesterdayIncome = res.data ? res.data : 0
    } else {
      ElMessage.error(res.msg)
    }
  })
  data.dif1 = data.todayOrderNum - data.yesterdayOrderNum
  data.dif2 = data.todayIncome - data.yesterdayIncome
}
loadStatisticData()

//声明周期函数，自动执行初始化
onMounted(() => {
  init();
});
//初始化函数
async function init() {
  let date;
  for(let i=0; i<30; i++)
  {
    date = moment().subtract(29,"days").add(i,"days").format("YYYY-MM-DD").slice(0,10)
    data.recentThirtyDays.push(date)
    await request.get('/orders/getIncomeByDate', {
      params: {
        date: date
      }
    }).then(res => {
      if(res.code === '200'){
        data.income.push(res.data ? res.data : 0)
      } else {
        ElMessage.error(res.msg)
        return
      }
    })
    await request.get('/orders/getNumByDate', {
      params: {
        date: date
      }
    }).then(res => {
      if(res.code === '200'){
        data.orderNums.push(res.data ? res.data : 0)
      } else {
        ElMessage.error(res.msg)
        return
      }
    })
  }
  updateChart()
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

function switchChartData() {
  updateChart()
}

function updateChart() {
  let Chart = echarts.init(document.getElementById("incomeChart"));
  let options = {
    title: {
      text: data.chartType === 'income' ? "近30日营业额" : "近30日订单数量",
    },
    tooltip: {},
    xAxis: {
      data: data.recentThirtyDays,
    },
    yAxis: {},
    series: [
      {
        name: data.chartType === 'income' ? "营业额" : "订单数量",
        type: "bar",
        data: data.chartType === 'income' ? data.income : data.orderNums,
      },
    ],
  };
  Chart.setOption(options);
  
  // 更新总计数据
  if (data.chartType === 'income') {
    data.totalIncome = data.income.reduce((sum, val) => sum + val, 0)
  } else {
    data.totalIncome = data.orderNums.reduce((sum, val) => sum + val, 0)
  }
}

</script>

<style scoped>
.home-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.welcome-card {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.user-name {
  color: #409EFF;
  font-weight: bold;
}

.tables-section {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.filter-bar {
  margin-bottom: 20px;
  padding: 10px 0;
}

.unit-select {
  width: 200px;
}

.tables-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  padding: 10px;
}

.table-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  transition: all 0.3s ease;
  border: 2px solid #e6e6e6;
  position: relative;
  overflow: hidden;
}

.table-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.table-occupied {
  opacity: 0.8;
  background: #f5f7fa;
}

.table-header {
  font-size: 18px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 15px;
}

.table-image {
  margin: 15px 0;
}

.table-image img {
  width: 80px;
  height: 80px;
  object-fit: contain;
}

.table-info {
  color: #606266;
  margin: 10px 0;
}

.table-status {
  margin-top: 15px;
}

.table-status .el-button {
  width: 100%;
  margin-top: 10px;
}

.table-status .el-tag {
  padding: 8px 20px;
  font-size: 14px;
}

:global(h2#card-usage ~ .example .example-showcase) {
  background-color: var(--el-fill-color) !important;
}

.el-statistic {
  --el-statistic-content-font-size: 28px;
}

.statistic-card {
  height: 100%;
  padding: 20px;
  border-radius: 4px;
  background-color: var(--el-bg-color-overlay);
}

.statistic-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  font-size: 12px;
  color: var(--el-text-color-regular);
  margin-top: 16px;
}

.statistic-footer .footer-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.statistic-footer .footer-item span:last-child {
  display: inline-flex;
  align-items: center;
  margin-left: 4px;
}

.green {
  color: var(--el-color-success);
}

.red {
  color: var(--el-color-error);
}

#incomeChart {
  width: 90vw;
  height: 65vh;
}

/* 进入过渡的开始状态 */
.fade-num-enter {
  opacity: 0;
}
/* 进入过渡的结束状态 */
.fade-num-enter-active {
  transition: opacity 0.5s ease;
  opacity: 1;
}
/* 离开过渡的开始状态 */
.fade-num-leave {
  opacity: 1;
}
/* 离开过渡的结束状态 */
.fade-num-leave-active {
  transition: opacity 0.5s ease;
  opacity: 0;
}

.chart-controls {
  margin-top: 10px;
}

.chart-controls .el-radio-group {
  display: flex;
  gap: 8px;
}

.chart-controls .el-radio-button__inner {
  padding: 4px 12px;
  font-size: 12px;
}
</style>