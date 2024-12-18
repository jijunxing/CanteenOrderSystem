// pages/person/person.js
const request = require('../../utils/request')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: {}
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
    // 获取用户信息
    const userStr = wx.getStorageSync('canteen-user')
    if (userStr) {
      this.setData({
        user: JSON.parse(userStr)
      })
    }
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
      const user = JSON.parse(userStr)
      // 确保头像URL存在
      if (!user.avatar) {
        user.avatar = '/assets/images/avatar.png'
      }
      this.setData({ user })
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

    request.put('/user/recharge', {
      id: this.data.user.id,
      amount: amount
    }).then(res => {
      if (res.code === '200') {
        this.setData({ user: newUser })
        wx.setStorageSync('canteen-user', JSON.stringify(newUser))
        wx.showToast({
          title: '充值成功',
          icon: 'success'
        })
      } else {
        wx.showToast({
          title: res.msg || '充值失败',
          icon: 'none'
        })
      }
    })
  },

  // 去登录
  goToLogin() {
    wx.navigateTo({
      url: '/pages/login/login'
    })
  },

  // 去充值
  goToRecharge() {
    if (!this.data.user.username) {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      })
      return
    }

    wx.showModal({
      title: '充值',
      editable: true,
      placeholderText: '请输入充值金额',
      success: (res) => {
        if (res.confirm) {
          const amount = parseFloat(res.content)
          if (isNaN(amount) || amount <= 0) {
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
              this.setData({ user: newUser })
              // 更新本地存储
              wx.setStorageSync('canteen-user', JSON.stringify(newUser))
            } else {
              wx.showToast({
                title: res.msg || '充值失败',
                icon: 'none'
              })
            }
          })
        }
      }
    })
  },

  // 去设置
  goToSettings() {
    if (!this.data.user.username) {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      })
      return
    }

    wx.showActionSheet({
      itemList: ['修改头像', '修改密码', '编辑资料'],
      success: (res) => {
        if (res.tapIndex === 0) {
          // 修改头像
          wx.chooseMedia({
            count: 1,
            mediaType: ['image'],
            sourceType: ['album', 'camera'],
            success: (res) => {
              const tempFilePath = res.tempFiles[0].tempFilePath
              // 上传头像
              wx.uploadFile({
                url: `${request.baseURL}/files/upload`,
                filePath: tempFilePath,
                name: 'file',
                success: (uploadRes) => {
                  const data = JSON.parse(uploadRes.data)
                  if (data.code === '200') {
                    // 更新用户头像
                    const newUser = { ...this.data.user, avatar: data.data }
                    // 更新到服务器
                    request.put('/user/update', newUser).then(res => {
                      if (res.code === '200') {
                        this.setData({ user: newUser })
                        wx.setStorageSync('canteen-user', JSON.stringify(newUser))
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
        } else if (res.tapIndex === 1) {
          // 修改密码
          wx.showModal({
            title: '修改密码',
            editable: true,
            placeholderText: '请输入原密码',
            success: (res1) => {
              if (res1.confirm) {
                const oldPassword = res1.content
                // 先验证原密码
                request.post('/login', {
                  username: this.data.user.username,
                  password: oldPassword
                }).then(res => {
                  if (res.code === '200') {
                    // 原密码验证成功，继续修改新密码
                    wx.showModal({
                      title: '修改密码',
                      editable: true,
                      placeholderText: '请输入新密码',
                      success: (res2) => {
                        if (res2.confirm) {
                          const newPassword = res2.content
                          // 更新密码
                          const newUser = {
                            ...this.data.user,
                            password: newPassword
                          }
                          request.put('/user/update', newUser).then(res => {
                            if (res.code === '200') {
                              wx.showToast({
                                title: '密码修改成功',
                                icon: 'success'
                              })
                              // 退出登录
                              setTimeout(() => {
                                this.handleLogout()
                              }, 1500)
                            } else {
                              wx.showToast({
                                title: res.msg || '密码修改失败',
                                icon: 'none'
                              })
                            }
                          })
                        }
                      }
                    })
                  } else {
                    wx.showToast({
                      title: '原密码错误',
                      icon: 'none'
                    })
                  }
                })
              }
            }
          })
        } else if (res.tapIndex === 2) {
          // 编辑资料
          wx.showModal({
            title: '编辑资料',
            editable: true,
            placeholderText: '请输入昵称',
            success: (res1) => {
              if (res1.confirm) {
                const nickname = res1.content
                wx.showModal({
                  title: '编辑资料',
                  editable: true,
                  placeholderText: '请输入姓名',
                  success: (res2) => {
                    if (res2.confirm) {
                      const name = res2.content
                      wx.showModal({
                        title: '编辑资料',
                        editable: true,
                        placeholderText: '请输入手机号',
                        success: (res3) => {
                          if (res3.confirm) {
                            const phone = res3.content
                            // 验证手机号格式
                            if (!/^1[3-9]\d{9}$/.test(phone)) {
                              wx.showToast({
                                title: '请输入正确的手机号',
                                icon: 'none'
                              })
                              return
                            }
                            // 选择性别
                            wx.showActionSheet({
                              itemList: ['男', '女'],
                              success: (res4) => {
                                const sex = res4.tapIndex === 0 ? '男' : '女'
                                // 更新用户信息
                                const newUser = {
                                  ...this.data.user,
                                  nickname,
                                  name,
                                  phone,
                                  sex
                                }
                                request.put('/user/update', {
                                  id: this.data.user.id,
                                  username: this.data.user.username,
                                  nickname,
                                  name,
                                  phone,
                                  sex,
                                  avatar: this.data.user.avatar,
                                  role: this.data.user.role,
                                  account: this.data.user.account
                                }).then(res => {
                                  if (res.code === '200') {
                                    this.setData({ user: newUser })
                                    wx.setStorageSync('canteen-user', JSON.stringify(newUser))
                                    wx.showToast({
                                      title: '资料更新成功',
                                      icon: 'success'
                                    })
                                  } else {
                                    wx.showToast({
                                      title: res.msg || '更新失败',
                                      icon: 'none'
                                    })
                                  }
                                })
                              }
                            })
                          }
                        }
                      })
                    }
                  }
                })
              }
            }
          })
        }
      }
    })
  },

  // 退出登录
  handleLogout() {
    wx.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          // 清除用户信息
          wx.removeStorageSync('canteen-user')
          this.setData({
            user: {}
          })
          wx.showToast({
            title: '已退出登录',
            icon: 'success'
          })
          // 跳转到登录页面
          setTimeout(() => {
            wx.redirectTo({
              url: '/pages/login/login'
            })
          }, 1500)
        }
      }
    })
  }
})