const request = require('../../utils/request')

Page({
  data: {
    username: '',
    password: ''
  },

  handleLogin() {
    const { username, password } = this.data
    if (!username || !password) {
      wx.showToast({
        title: '请输入用户名和密码',
        icon: 'none'
      })
      return
    }

    // 使用 WebController 中的登录接口
    request.post('/login', {
      username,
      password,
      role: 'USER' // 小程序端只处理用户登录
    }).then(res => {
      if (res.code === '200') {
        // 保存用户信息
        wx.setStorageSync('canteen-user', JSON.stringify(res.data))
        wx.showToast({
          title: '登录成功',
          icon: 'success'
        })
        // 跳转到首页
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
  },

  goToRegister() {
    wx.navigateTo({
      url: '/pages/register/register'
    })
  }
}) 