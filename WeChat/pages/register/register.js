// pages/register/register.js
const request = require('../../utils/request')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    form: {
      username: '',
      password: '',
      name: '',
      phone: '',
      sex: '男'
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

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

  handleSexChange(e) {
    this.setData({
      'form.sex': e.detail.value
    })
  },

  handleRegister() {
    const { username, password, name, phone, sex } = this.data.form
    
    // 表单验证
    if (!username || !password) {
      wx.showToast({
        title: '用户名和密码不能为空',
        icon: 'none'
      })
      return
    }
    
    if (!name) {
      wx.showToast({
        title: '请输入姓名',
        icon: 'none'
      })
      return
    }
    
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none'
      })
      return
    }

    // 调用注册接口
    request.post('/register', {
      ...this.data.form,
      role: 'USER'
    }).then(res => {
      if (res.code === '200') {
        wx.showToast({
          title: '注册成功',
          icon: 'success'
        })
        // 延迟跳转到登录页
        setTimeout(() => {
          wx.navigateBack()
        }, 1500)
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
  },

  goToLogin() {
    wx.navigateBack()
  }
})