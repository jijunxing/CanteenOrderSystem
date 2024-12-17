const baseURL = 'http://localhost:9090'

const request = (url, options = {}) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${baseURL}${url}`,
      ...options,
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data)
        } else {
          reject(res)
        }
      },
      fail: reject
    })
  })
}

const get = (url, data) => {
  return request(url, {
    method: 'GET',
    header: {
      'content-type': 'application/json'
    },
    data
  })
}

const post = (url, data) => {
  return request(url, {
    method: 'POST',
    header: {
      'content-type': 'application/json'
    },
    data
  })
}

const put = (url, data) => {
  return request(url, {
    method: 'PUT',
    header: {
      'content-type': 'application/json'
    },
    data
  })
}

const del = (url, data) => {
  return request(url, {
    method: 'DELETE',
    header: {
      'content-type': 'application/json'
    },
    data
  })
}

module.exports = {
  get,
  post,
  put,
  delete: del
} 