// pages/order/order.js
const request = require('../../utils/request')

Page({
  data: {
    user: {},
    table: {},
    types: [],
    foodsByCategory: {},
    foodsList: [],
    currentType: '',
    scrollTop: 0,
    scrollWithAnimation: true,
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
    
    // 确保类型和菜品数据都加载完成
    this.loadTypes().then(() => {
      console.log('所有数据加载完成')
      // 初始化滚动位置
      if (this.data.types.length > 0) {
        const firstType = this.data.types[0].type
        this.setData({
          currentType: firstType,
          scrollIntoView: `category-${firstType}`
        })
      }
    })

    this.loadCart()
  },

  onShow() {
    // 获取当前餐桌信息
    this.loadTable()
  },

  // 获取当前餐桌信息
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
    return new Promise((resolve) => {
      request.get('/foods/getType').then(res => {
        if (res.code === '200') {
          const types = res.data
          console.log('加载的类型：', types)  // 添加日志
          this.setData({ 
            types,
            currentType: types[0]?.type || ''
          }, () => {
            this.loadFoodsByCategory().then(() => {
              resolve()
            })
          })
        } else {
          resolve()
        }
      }).catch(() => resolve())
    })
  },

  // 按分类加载菜品
  loadFoodsByCategory() {
    return new Promise((resolve) => {
      request.get('/foods/selectAll').then(res => {
        if (res.code === '200') {
          // 保存完整的菜品列表
          this.setData({ 
            foodsList: res.data || []  // 添加这行
          })

          // 将菜品按类别分组
          const foodsByCategory = {}
          this.data.types.forEach(type => {
            foodsByCategory[type.type] = res.data.filter(
              food => food.type === type.type
            )
          })
          console.log('按类别分组的菜品：', foodsByCategory)
          this.setData({ foodsByCategory }, resolve)
        } else {
          resolve()
        }
      }).catch(resolve)
    })
  },

  // 点击分类
  handleCategoryClick(e) {
    const type = e.currentTarget.dataset.type
    console.log('点击分类:', type)
    
    if (!type) {
      console.error('分类type为空')
      return
    }
    
    // 先更新当前分类
    this.setData({
      currentType: type,
      scrollWithAnimation: true
    })
    
    // 简化滚动逻辑
    setTimeout(() => {
      wx.createSelectorQuery()
        .selectAll('.category-section')
        .boundingClientRect(rects => {
          console.log('所有分类元素:', rects)
          
          // 找到目标分类的索引
          const targetIndex = rects.findIndex(rect => rect.id === `category-${type}`)
          if (targetIndex !== -1) {
            console.log('找到目标元素:', rects[targetIndex])
            
            // 计算滚动位置
            let scrollTop = 0
            for (let i = 0; i < targetIndex; i++) {
              scrollTop += rects[i].height
            }
            
            // 直接设置滚动位置
            this.setData({
              scrollTop: scrollTop
            })
          } else {
            console.error('找不到目标分类元素')
          }
        })
        .exec()
    }, 100)
  },

  // 监听滚动
  handleScroll(e) {
    // 防抖处理
    if (this.scrollTimer) {
      clearTimeout(this.scrollTimer)
    }
    
    this.scrollTimer = setTimeout(() => {
      // 获取窗口信息
      const windowInfo = wx.getWindowInfo()
      
      wx.createSelectorQuery()
        .selectAll('.category-section')
        .boundingClientRect(rects => {
          if (!rects || rects.length === 0) return
          
          // 找到当前可见的分类
          const currentRect = rects.find(rect => {
            const viewportTop = 100 // 视口顶部位置
            const viewportBottom = windowInfo.windowHeight - 100 // 使用新API获取窗口高度
            return rect.top <= viewportTop && rect.bottom >= viewportTop
          })

          if (currentRect) {
            const type = currentRect.id.replace('category-', '')
            if (type !== this.data.currentType) {
              this.setData({
                currentType: type,
                scrollWithAnimation: false
              })
            }
          }
        })
        .exec()
    }, 100)
  },

  // 加载菜品列表
  loadFoods() {
    request.get('/foods/selectAll').then(res => {
      if (res.code === '200') {
        console.log('加载的菜品列表：', res.data)
        this.setData({
          foodsList: res.data || []
        }, () => {
          // 确保数据加载完成后再设置初始分类
          if (this.data.types.length > 0 && !this.data.currentType) {
            this.setData({
              currentType: this.data.types[0].type
            })
          }
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
    const currentType = item.type
    const foodsList = this.data.foodsByCategory[currentType]
    const index = foodsList.findIndex(food => food.id === item.id)
    
    if (index === -1) return
    
    const quantity = item.quantity || 1
    const newQuantity = type === 'plus' ? quantity + 1 : Math.max(1, quantity - 1)
    
    // 更新对应分类中的菜品数量
    const newFoodsByCategory = { ...this.data.foodsByCategory }
    newFoodsByCategory[currentType][index].quantity = newQuantity
    
    this.setData({
      foodsByCategory: newFoodsByCategory
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
          existItem.quantity = (existItem.quantity || 0) + (item.quantity || 1)
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
      content: this.data.orderList.map(item => {
        const food = this.data.foodsList.find(f => f.id === item.foodsId)
        return `${food ? food.name : '未知菜品'}×${item.quantity}`
      }).join('、'),
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
          throw new Error('菜品信息不完整，请刷新页面重试')
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
        
        // 4. 扣除用户额并更新用户信息
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
          title: error.message || '下单失���',
          icon: 'none'
        })
      }
    }
    
    // 执行下单流程
    submitOrder()
  },

  // 退桌
  removeOrder() {
    wx.showModal({
      title: '提示',
      content: '确定要退桌吗？',
      success: (res) => {
        if (res.confirm) {
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
                title: res.msg || '退桌失败',
                icon: 'none'
              })
            }
          })
        }
      }
    })
  }
})