// pages/order/order.js
const request = require('../../utils/request')

Page({
  data: {
    user: {},
    table: {},
    types: [],
    curType: '',
    curTypeIndex: 0,
    foodsList: [],
    orderList: [],
    total: 0,
    orderTotal: 0,
    remark: '',
    showCart: false
  },

  onLoad() {
    // 获取用户信息
    const userStr = wx.getStorageSync('canteen-user')
    if (userStr) {
      this.setData({
        user: JSON.parse(userStr)
      })
    }
    
    // 加载菜品类型
    this.loadTypes()
    // 加载菜品列表
    this.loadFoods()
    // 加载购物车
    this.loadCart()
  },

  onShow() {
    // 获取当前餐桌信息
    this.loadTable()
  },

  // 加载当前餐桌信息
  loadTable() {
    const userId = this.data.user.id
    if (!userId) return

    request.get('/tables/selectAll').then(res => {
      if (res.code === '200') {
        // 查找用户预定的餐桌
        let table = res.data.find(t => t.userId === userId)
        // 如果找到了餐桌，确保包含完整的实体信息
        if (table) {
          table = {
            ...table,
            free: '是',  // 退桌时需要设置为空闲
            userId: null // 退桌时需要清空用户ID
          }
        } else {
          table = {}
        }
        this.setData({
          table
        })
        
        // 如果没有选择餐桌，自动跳转到选择餐桌页面
        if (!table.id) {
          wx.showToast({
            title: '请先选择餐桌',
            icon: 'none'
          })
          setTimeout(() => {
            wx.switchTab({
              url: '/pages/home/home'
            })
          }, 1500)
        }
      }
    })
  },

  // 加载菜品类型
  loadTypes() {
    request.get('/foods/getType').then(res => {
      if (res.code === '200') {
        this.setData({
          types: res.data
        })
      }
    })
  },

  // 加载菜品列表
  loadFoods() {
    request.get('/foods/selectAll', {
      type: this.data.curType
    }).then(res => {
      if (res.code === '200') {
        console.log('加载的菜品列表：', res.data)
        this.setData({
          foodsList: res.data || []
        })
      }
    })
  },

  // 加载购物车
  loadCart() {
    const username = this.data.user.username
    if (!username) return

    request.get('/cart/selectAll/' + username).then(res => {
      if (res.code === '200') {
        const orderList = res.data || []
        this.setData({
          orderList,
          total: orderList.map(item => item.quantity).reduce((acc, cur) => acc + cur, 0),
          orderTotal: this.calculateTotal(orderList)
        })
      }
    })
  },

  // 计算总价
  calculateTotal(orderList) {
    return orderList.reduce((total, item) => {
      return total + item.price * item.quantity
    }, 0)
  },

  // 类型选择变化
  handleTypeChange(e) {
    const index = e.detail.value
    const type = this.data.types[index]
    this.setData({
      curTypeIndex: index,
      curType: type.type
    })
    this.loadFoods()
  },

  // 数量变化
  handleQuantityChange(e) {
    const { item } = e.currentTarget.dataset
    const type = e.currentTarget.dataset.type
    const index = this.data.foodsList.findIndex(food => food.id === item.id)
    
    if (index === -1) return
    
    const food = this.data.foodsList[index]
    const quantity = food.quantity || 1

    this.setData({
      [`foodsList[${index}].quantity`]: type === 'plus' ? quantity + 1 : Math.max(1, quantity - 1)
    })
  },

  // 添加到购物车
  addToCart(e) {
    const { item } = e.currentTarget.dataset
    const userId = this.data.user.id
    const username = this.data.user.username
    if (!userId) {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      })
      return
    }

    if (!this.data.table.no) {
      wx.showToast({
        title: '请先选择餐桌',
        icon: 'none'
      })
      return
    }

    // 检查购物车中是否已有该菜品
    request.get('/cart/selectAll/' + username).then(res => {
      if (res.code === '200') {
        const orderList = res.data
        const existItem = orderList.find(o => o.foodsId === item.id)
        
        if (existItem) {
          // 如果已存在，更新数量
          existItem.quantity += (item.quantity || 1)
          request.put('/cart/update', existItem).then(res => {
            if (res.code === '200') {
              wx.showToast({
                title: '添加成功',
                icon: 'success'
              })
              this.loadCart()
            }
          })
        } else {
          // 如果不存在，新增
          const cart = {
            userId,
            foodsId: item.id,
            quantity: item.quantity || 1
          }
          request.post('/cart/add', cart).then(res => {
            if (res.code === '200') {
              wx.showToast({
                title: '添加成功',
                icon: 'success'
              })
              this.loadCart()
            }
          })
        }
      }
    })
  },

  // 显示购物车
  showOrderList() {
    this.setData({
      showCart: true
    })
  },

  // 隐藏购物车
  hideCart() {
    this.setData({
      showCart: false
    })
  },

  // 购物车减少数量
  dropOne(e) {
    const { item } = e.currentTarget.dataset
    if (item.quantity <= 1) {
      this.dropAll(e)
      return
    }

    const cart = {
      ...item,
      quantity: item.quantity - 1
    }

    request.put('/cart/update', cart).then(res => {
      if (res.code === '200') {
        this.loadCart()
      }
    })
  },

  // 购物车增加数量
  addOne(e) {
    const { item } = e.currentTarget.dataset
    const cart = {
      ...item,
      quantity: item.quantity + 1
    }

    request.put('/cart/update', cart).then(res => {
      if (res.code === '200') {
        this.loadCart()
      }
    })
  },

  // 从购物车删除
  dropAll(e) {
    const { item } = e.currentTarget.dataset
    request.delete('/cart/delete/' + item.id).then(res => {
      if (res.code === '200') {
        this.loadCart()
      }
    })
  },

  // 提交订单
  submitOrder() {
    if (this.data.orderList.length === 0) {
      wx.showToast({
        title: '请先选择菜品',
        icon: 'none'
      })
      return
    }

    // 计算订单总价
    const total = this.calculateTotal(this.data.orderList)
    
    // 检查余额是否足够
    if (total > this.data.user.account) {
      wx.showToast({
        title: '余额不足',
        icon: 'none'
      })
      return
    }

    const order = {
      userId: this.data.user.id,
      table: this.data.table,
      content: this.data.orderList.map(item => 
        `${this.data.foodsList.find(f => f.id === item.foodsId)?.name || '未知菜品'}×${item.quantity}`
      ).join('、'),
      remark: this.data.remark || '无',
      total: total,
      status: '待出餐',
      tableNo: this.data.table.no
    }

    // 使用 async/await 处理多个异步操作
    const submitOrder = async () => {
      try {
        // 0. 确保能找到所有菜品信息
        const missingFoods = this.data.orderList.some(item => 
          !this.data.foodsList.find(f => f.id === item.foodsId)
        )
        if (missingFoods) {
          throw new Error('菜品信息不完整���请刷新页面重试')
        }

        // 1. 提交订单
        const orderRes = await request.post('/orders/add', order)
        if (orderRes.code !== '200') {
          throw new Error(orderRes.msg)
        }
        
        // 2. 更新菜品销量
        for (const item of this.data.orderList) {
          const food = this.data.foodsList.find(f => f.id === item.foodsId)
          if (food) {
            food.sales += item.quantity
            await request.put('/foods/update', food)
          }
        }
        
        // 3. 清空购物车
        for (const item of this.data.orderList) {
          await request.delete('/cart/delete/' + item.id)
        }
        
        // 4. 扣除用户余额并更新用户信息
        this.data.user.account -= total
        await request.put('/user/update', this.data.user)
        wx.setStorageSync('canteen-user', JSON.stringify(this.data.user))
        
        // 5. 完成下单
        wx.showToast({
          title: '下单成功',
          icon: 'success'
        })
        this.setData({
          showCart: false,
          remark: '',
          orderList: [],
          total: 0,
          orderTotal: 0
        })
      } catch (error) {
        wx.showToast({
          title: error.message || '下单失败',
          icon: 'none'
        })
      }
    }
    
    // 执行下单流程
    submitOrder()
  },

  // 换桌
  removeOrder() {
    // 确保table对象包含所需属性
    const tableData = {
      ...this.data.table,
      free: '是',
      userId: null
    }
    
    request.put('/tables/removeOrder', tableData).then(res => {
      if (res.code === '200') {
        wx.showToast({
          title: '退桌成功',
          icon: 'success'
        })
        // 清空当前餐桌信息
        this.setData({
          table: {}
        })
        wx.switchTab({
          url: '/pages/home/home'
        })
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
  }
})