// pages/person/person.js
const request = require('../../utils/request')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: {},
    showRecharge: false,
    rechargeAmount: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.loadUserInfo()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

  // 加载用户信息
  loadUserInfo() {
    const userStr = wx.getStorageSync('canteen-user')
    if (userStr) {
      this.setData({
        user: JSON.parse(userStr)
      })
    }
  },

  // 选择头像
  chooseAvatar() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePath = res.tempFiles[0].tempFilePath
        // 上传头像
        wx.uploadFile({
          url: 'http://localhost:9090/files/upload',
          filePath: tempFilePath,
          name: 'file',
          success: (uploadRes) => {
            const data = JSON.parse(uploadRes.data)
            if (data.code === '200') {
              // 更新用户头像
              const newUser = { ...this.data.user, avatar: data.data }
              this.setData({
                user: newUser
              })
              // 保存到本地
              wx.setStorageSync('canteen-user', JSON.stringify(newUser))
              // 更新到服务器
              request.put('/user/update', newUser).then(res => {
                if (res.code === '200') {
                  wx.showToast({
                    title: '头像更新成功',
                    icon: 'success'
                  })
                }
              })
            }
          }
        })
      }
    })
  },

  // 处理姓名输入
  handleNameInput(e) {
    this.setData({
      'user.name': e.detail.value
    })
  },

  // 处理性别选择
  handleSexChange(e) {
    this.setData({
      'user.sex': e.detail.value
    })
  },

  // 处理手机号输入
  handlePhoneInput(e) {
    this.setData({
      'user.phone': e.detail.value
    })
  },

  // 保存个人信息
  handleSave() {
    const { user } = this.data
    if (!user.name || !user.phone) {
      wx.showToast({
        title: '请填写完整信息',
        icon: 'none'
      })
      return
    }

    request.put('/user/update', user).then(res => {
      if (res.code === '200') {
        wx.showToast({
          title: '保存成功',
          icon: 'success'
        })
        // 更新本地存储
        wx.setStorageSync('canteen-user', JSON.stringify(user))
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
  },

  // 显示充值弹窗
  showRechargeDialog() {
    this.setData({
      showRecharge: true,
      rechargeAmount: ''
    })
  },

  // 隐藏充值弹窗
  hideRecharge() {
    this.setData({
      showRecharge: false
    })
  },

  // 处理充值金额输入
  handleRechargeInput(e) {
    this.setData({
      rechargeAmount: e.detail.value
    })
  },

  // 确认充值
  handleRecharge() {
    const amount = parseFloat(this.data.rechargeAmount)
    if (!amount || amount <= 0) {
      wx.showToast({
        title: '请输入有效金额',
        icon: 'none'
      })
      return
    }

    // 更新用户余额
    const newUser = {
      ...this.data.user,
      account: (this.data.user.account || 0) + amount
    }

    request.put('/user/update', newUser).then(res => {
      if (res.code === '200') {
        wx.showToast({
          title: '充值成功',
          icon: 'success'
        })
        this.setData({
          user: newUser,
          showRecharge: false
        })
        // 更新本地存储
        wx.setStorageSync('canteen-user', JSON.stringify(newUser))
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
  }
})