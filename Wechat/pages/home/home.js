// pages/home/home.js
const request = require('../../utils/request')

Page({
  data: {
    user: {},
    tables: [],
    units: [],
    curUnit: '',
    curUnitIndex: 0,
    bannerFoods: []
  },

  onLoad() {
    // 获取用户信息
    const userStr = wx.getStorageSync('canteen-user')
    if (userStr) {
      this.setData({
        user: JSON.parse(userStr)
      })
    }
    
    // 加载餐桌规格
    this.loadUnits()
    // 加载餐桌数据
    this.loadTables()
    // 加载轮播图数据
    this.loadBannerFoods()
  },

  // 加载餐桌规格
  loadUnits() {
    request.get('/tables/getUnit').then(res => {
      if (res.code === '200') {
        this.setData({
          units: res.data
        })
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
  },

  // 加载餐桌数据
  loadTables() {
    request.get('/tables/selectAll', {
      unit: this.data.curUnit
    }).then(res => {
      if (res.code === '200') {
        this.setData({
          tables: res.data || []
        })
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
  },

  // 规格选择变化
  handleUnitChange(e) {
    const index = e.detail.value
    const unit = this.data.units[index]
    this.setData({
      curUnitIndex: index,
      curUnit: unit.unit
    })
    this.loadTables()
  },

  // 选择餐桌
  handleTableSelect(e) {
    const { table } = e.currentTarget.dataset
    const userId = this.data.user.id
    
    if (!userId) {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      })
      setTimeout(() => {
        wx.navigateTo({
          url: '/pages/login/login'
        })
      }, 1500)
      return
    }

    if (table.userId) {
      wx.showToast({
        title: '该餐桌已被占用',
        icon: 'none'
      })
      return
    }

    // 先检查用户是否已经有预定的餐桌
    request.get('/tables/selectAll').then(res => {
      if (res.code === '200') {
        const hasOrder = res.data.some(t => t.userId === userId && t.id !== table.id)
        if (hasOrder) {
          wx.showToast({
            title: '您已预定其他餐桌',
            icon: 'none'
          })
          return
        }

        // 如果没有预定餐桌，则进行预定
        table.userId = userId
        request.put('/tables/addOrder', table).then(res => {
          if (res.code === '200') {
            wx.showToast({
              title: '选择成功',
              icon: 'success'
            })
            
            // 选择成功后自动跳转到点餐页面
            setTimeout(() => {
              wx.switchTab({
                url: '/pages/order/order'
              })
            }, 1000)  // 延迟1秒跳转，让用户看到成功提示
          } else {
            wx.showToast({
              title: res.msg || '选择失败',
              icon: 'none'
            })
          }
        })
      }
    })
  },

  // 重置筛选
  handleReset() {
    this.setData({
      curUnit: '',
      curUnitIndex: 0
    })
    this.loadTables()
  },

  // 加载轮播图数据
  loadBannerFoods() {
    request.get('/foods/selectAll').then(res => {
      if (res.code === '200') {
        // 随机选择5个有图片的菜品
        const foods = res.data.filter(food => food.img)
        const randomFoods = this.getRandomItems(foods, 5)
        this.setData({
          bannerFoods: randomFoods
        })
      }
    })
  },

  // 从数组中随机选择指定数量的元素
  getRandomItems(array, count) {
    const shuffled = array.sort(() => 0.5 - Math.random())
    return shuffled.slice(0, count)
  }
})