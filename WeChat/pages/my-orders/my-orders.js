// pages/my-orders/my-orders.js
const request = require('../../utils/request')

Page({
  data: {
    user: {},
    orderList: [],
    showRating: false,
    showComments: false,
    currentOrder: {}
  },

  onLoad() {
    // 获取用户信息
    const userStr = wx.getStorageSync('canteen-user')
    if (userStr) {
      this.setData({
        user: JSON.parse(userStr)
      })
    }
  },

  onShow() {
    this.loadOrders()
  },

  // 加载订单列表
  loadOrders() {
    const userId = this.data.user.id
    if (!userId) return

    request.get('/orders/selectAll', {
      userId
    }).then(res => {
      if (res.code === '200') {
        this.setData({
          orderList: res.data || []
        })
      }
    })
  },

  // 显示评价弹窗
  showRatingDialog(e) {
    const order = e.currentTarget.dataset.order
    this.setData({
      currentOrder: {
        ...order,
        score: 5,  // 默认5分
        comments: ''
      },
      showRating: true
    })
  },

  // 隐藏评价弹窗
  hideRating() {
    this.setData({
      showRating: false
    })
  },

  // 评分变化
  handleRateChange(e) {
    this.setData({
      'currentOrder.score': e.detail.value
    })
  },

  // 评价内容输入
  handleCommentsInput(e) {
    this.setData({
      'currentOrder.comments': e.detail.value
    })
  },

  // 提交评价
  submitRating() {
    const { currentOrder } = this.data
    if (!currentOrder.comments) {
      wx.showToast({
        title: '请填写评价内容',
        icon: 'none'
      })
      return
    }

    request.put('/orders/update', {
      ...currentOrder,
      status: '已完成'
    }).then(res => {
      if (res.code === '200') {
        wx.showToast({
          title: '评价成功',
          icon: 'success'
        })
        this.setData({
          showRating: false
        })
        this.loadOrders()
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
  },

  // 显示评价详情
  showComments(e) {
    const order = e.currentTarget.dataset.order
    this.setData({
      currentOrder: order,
      showComments: true
    })
  },

  // 隐藏评价详情
  hideComments() {
    this.setData({
      showComments: false
    })
  }
})