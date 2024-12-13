<template>
  <div>

    <div class="card" style="line-height: 30px">
      <div>欢迎您，<span style="color:#1450aa">{{ user.name }}</span> 祝您今天过得开心！</div>
    </div>

    <div class="card" v-if="user.role==='USER'">
      <el-select v-model="data.curUnit" placeholder="餐桌规格" clearable @change="loadTables" style="width:100px; margin-right: 10px; margin-left: 5px">
        <el-option v-for="item in data.unit" :key="item.id" :label="item.unit" :value="item.unit"/>
      </el-select>
      <div style="display: flex; flex-wrap: wrap; margin-top: 10px">
        <div v-for=" item in data.tables" :key="item.id"
             style="text-align: center; margin-right: 20px; margin-bottom: 20px ">
          <div style="font-weight: bold">{{ item.no }}</div>
          <div><img src="@/assets/imgs/餐饮.png" alt="" style="width: 100px"></div>
          <div>规格：{{ item.unit }}</div>
          <div style="margin: 10px 0">
            <el-button type="success" size="small" v-if="item.free === '是' && user.role==='USER'"
                       @click="addOrder(item)">空闲
            </el-button>
            <el-tag type="success" v-if="item.free === '是' && user.role==='ADMIN'">空闲</el-tag>
            <el-tag type="warning" v-if="item.free === '否'">占用</el-tag>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="card" v-if="user.role === 'ADMIN'" style="margin-top: 3px">
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
                <div>￥</div>
              </template>
              <template #title>
                <div style="display: inline-flex; align-items: center">
                  近30日总营业额
                </div>
              </template>
            </el-statistic>
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
  unit: []
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
  }
  // 基于准备好的dom，初始化echarts实例
  let Chart = echarts.init(document.getElementById("incomeChart"));
  // 绘制图表
  let options = {
    title: {
      text: "近30日营业额",
    },
    tooltip: {},
    xAxis: {
      data: data.recentThirtyDays,
    },
    yAxis: {},
    series: [
      {
        name: "营业额",
        type: "bar",
        data: data.income,
      },
    ],
  };
  // 渲染图表
  Chart.setOption(options);
  data.totalIncome = 0
  for(let j=0 ; j<30; j++)
    data.totalIncome += data.income[j]
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

</script>

<style scoped>

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
</style>