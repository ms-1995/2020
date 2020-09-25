### call apply bind

* `call()` 使用一个指定的this和单独给出的一个或多个参数来调用函数 `Function.call(thisArg, arg1, arg2, ...)`

* `apply()` 使用一个指定的this和单独给出的一个参数数组来调用函数 `Function.apply(thisArg, [argsArray])`

* `bind()` 返回一个新的函数，新函数的this被指定为第一个参数，其余作为新函数的参数 `Function.bind(thisArg, arg1, arg2, ...)`

#### 手写call()

  函数的this指向它的直接调用者，变更调用者即完成this指向的变更。

```js
function.prototype.myCall = function(thisArg, ...args) {
  const fn = Symbol('fn') // 声明一个独有的Symbol属性，防止fn覆盖已有属性
  thisArg = thisArg || window // 若没有传入this，默认绑定window
  thisArg[fn] = this // 这里this就是要调用的函数，在thisArg上扩展这个方法
  const result = thisArg[fn](...args)
  delete thisArg[fn] // 删除声明的fn属性
  return result
}
```

#### 手写apply()

  与call类似，接收参数不同

```js
function.prototype.myApply = function(thisArg, argsArray) {
  const fn = Symbol('fn') // 声明一个独有的Symbol属性，防止fn覆盖已有属性
  thisArg = thisArg || window // 若没有传入this，默认绑定window
  thisArg[fn] = this // this指向调用call的对象
  const result = thisArg[fn](...argsArray) // 在调用原函数时，要将参数数组展开
  delete thisArg[fn] // 删除声明的fn属性
  return result
}
```

#### 手写bind()

  bind()除了要接收bind时传入的参数，还要接收返回函数时传入的参数

```js
Function.prototype.myBind = function(thisArg, ...args) {
  const self = this
  const fbound = function() {
    // 方式函数因new被改变this指向
    self.apply(this instanceof self ? this : thisArg,args.concat(Array.prototype.slice.call(arguments)))
  }
  // Array.prototype.slice.call(arguments)的作用是将函数传入的参数转换为数组对象。将两次传入参数合并
  fbound.prototype = Object.create(self.prototype) // 保留原型链上的属性和方法
  return fbound
}
```