// pages/home/home.js
const request = require('../../utils/request')

Page({
  data: {
    user: {},
    tables: [],
    units: [],
    curUnit: '',
    curUnitIndex: 0
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
    const table = e.currentTarget.dataset.table
    const userId = this.data.user.id
    
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
      }
      
      // 如果没有预定餐桌，则进行预定
      table.userId = userId
      request.put('/tables/addOrder', table).then(res => {
        if (res.code === '200') {
          wx.showToast({
            title: '选择成功',
            icon: 'success'
          })
          wx.switchTab({
            url: '/pages/order/order'
          })
        } else {
          wx.showToast({
            title: res.msg,
            icon: 'none'
          })
        }
      })
    })
  },

  // 重置筛选
  handleReset() {
    this.setData({
      curUnit: '',
      curUnitIndex: 0
    })
    this.loadTables()
  }
})