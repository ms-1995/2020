### 多个判断条件时

* 范围查询

```js
    // 判断数据在1-5或20-30之间
    function judgeSome(num,...ranges) {
        return ranges.some(range => num>=range[0]&&num<=range[1])
    }
    judgeSome(2,[1,5],[20-30])
```
* 多个与条件

```js
    // 判断多个参数
    let obj = {
        'status=1&type=1':'判断1成立',
        'status=2&type=1':'判断2成立',
        'status=1&type=2':'判断3成立',
        'status=2&type=2':'判断4成立',
    }
    console.log(obj[`status=${status}&type=${type}`]) 
```

* 多个或条件
```js
    let city='广州'
let obj={
    '广州,佛山':'广东',
    '海口,三亚':'海南',
}
let keys=[]
for(let key in obj){
    keys=key.split(',')
    if(keys.includes(city)){
        console.log(obj[key])
        break
    }
}
```

### 页面加载

* 异步加载 async

* 延迟加载 defer

### 值的比较

* ndefined 和 null 在相等性检查 == 中不会进行任何的类型转换

* `Object.is(value1, value2)`;相等性检查

### vue预渲染与服务端渲染
1. 预渲染

    * 使用prerender-spa-plugin插件应用
    * 运行项目，使用puppeter(通过node.js控制无界面chrome)抓取已经渲染好的html、css、js、数据

2. 服务端渲染

    * [Vue SSR](./vueSSR.md)
    * 通过vue-server-render对vue实例对象进行解析成最终html

### vuex原理

1. 将vueinit混入vue的beforeCreated生命周期中
2. 将根组件的store赋值给$store,在创建前将父组件store赋值给子组件store
3. 将data存入vue实例组件的data中，在访问getter的时候实际上访问的是vue实例上的computed属性

### keep-alive

* keep-alive是vue的一个抽象组件，不渲染任何dom
* 使用keep-alive包裹活动组件，在不活动时缓存它
* 原理：
    1. created时定义缓存虚拟dom的合集
    2. mounted中监听白名单和黑名单的变动，实时删除
    3. destoryed删除cache中的vnode实例，删除缓存要执行实例的destory钩子函数 

### 不使用index作为key

* 频繁比对导致性能损耗
* 删除时产生不可预知错误

### vue-router生命周期

* beforeRouterEnter：路由进入该组件调用
* beforeRouterLeave：离开时调用
* beforeRouterUpdate：路由更新是调用，同一个组件多个页面使用