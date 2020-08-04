### axios

Axios 是一个基于 promise 的 HTTP 库，可以用在浏览器和 node.js 中。

#### axios特性

* 浏览器环境下创建XMLHttpRequests, node环境下创建http请求
* 支持PromiseAPI
* 拦截请求和响应，转换请求响应数据
* 自动转换JSON数据
* 客户端支持防御XSRF

#### 使用

```js
axios.post('/postAxios', {
  name: 'post请求'
}).then(res => {
  // 成功响应
})
axios({
  method: 'post',
  url: '/postAxios'
}).then(res => {
  // 成功响应
})
```

#### 实现

```js
class Axios {
  constructor() {}

  request(config) {
    return new Promise(resolve => {
      // const url = config.url || ''
      const {url = '', method = 'get', data = {}} = config
      const xhr = new HMLHttpRequest()
      xhr.open(method, url, true)
      xhr.onload = function() {
        resolve(xhr.responseText)
      }
      xhr.send(data)
    })
  }
}

const methodsArr = ['get', 'delete', 'head', 'options', 'put', 'patch', 'post']
methodsArr.forEach(method => {
  Axios.prototype[method] = function() {
    if(['get','delete', 'head', 'options'].includes(method)) {
      return this.request({
        method: method,
        url: arguments[0],
        ...argument[1] || {}
      })
    } else {
      return this.request({
        method: met,
        url: arguments[0],
        data: arguments[1] || {},
        ...argument[2] || {}
      })
    }
  }
})

// 混入方法
const utils = {
  extend(target, data, context) {
    for(let key in data) {
      if(data.hasOwnProperty(key)) {
        if(typeof data[key] === 'function') {
          target[key] = data[key].bind(context)
        } else {
          target[key] = data[key]
        }
      }
    }
  }
}

// 实例axios
function CreateAxios() {
    let axios = new Axios();
    let req = axios.request.bind(axios);
    // 混入
    utils.extend(req, Axios.prototype, axios)
    return req;
}

let axios = CreateAxios();

```

#### 拦截器

```js
// 请求拦截器
axios.interceptors.request.use(config => {
  // 发送请求前处理
  return config
}, error => {
  // 请求错误处理
  return Promise.reject(error)
})
// 响应拦截器
axios.interceptors.response.use(res => {
  // 处理响应数据
  return res
}, err => {
  // 响应错误处理
  return Promise.reject(err)
})
```

```js
class InterceptorsManage {
  constructor() {
    this.handlers = [];
  }
  use(fullfield, rejected) {
    this.handlers.push({
      fullfield,
      rejected
    })
  }
}

class Axios {
  constructor() {
    // 拦截器
    this.interceptors = {
      request: new InterceptorsManage,
      response: new InterceptorsManage
    }
  }
  request(config) {
    // 拦截器和请求组装队列
    const chain = [this.sendAjax.bind(this), undefined]
    // 请求拦截
    this.interceptors.request.handlers.forEach(interceptor => {
      chain.unshift(interceptor.fullfield, interceptor.rejected)
    })
    // 响应拦截
    // ...
    // 利用Promise执行顺序，将请求拦截插入请求前，响应拦截插入请求后
    let promise = Promise.resolve(config);
    while(chain.length > 0) { // 按顺序依次执行，请求拦截，请求，响应拦截
      promise = promise.then(chain.shift(), chain.shift())
    }
    return promise;
  }
}
```
