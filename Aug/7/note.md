### \$nextTick

#### 浏览器（多进程）

包含了 Browser 进程（浏览器的主进程），第三方插件进程和 GPU 进程（浏览器渲染进程）。

#### GPU 进程（多线程）

包含了如下线程：

- GUI 渲染线程
- JS 引擎线程
- 事件触发线程
- 定时触发器线程
- 异步 HTTP 请求线程

其中 GUI 渲染线程和 JS 引擎线程是互斥的，为了防止 DOM 渲染的不一致性，其中一个线程执行时另一个线程会被挂起。

#### JS 引擎线程结合事件触发线程的工作流程

1. 同步任务在 JS 引擎线程上执行，形成执行栈。
2. 调用某些异步 API 时，在任务队列中添加事件。并由事件触发线程管理。
3. 执行栈中的同步任务执行完毕，读取任务队列。将队列中需要执行的任务加到执行栈中并执行响应的异步任务。

#### JS 的两种任务类型

JS 中有两种任务类型：微任务（microtask）和宏任务（macrotask），在 ES6 中，microtask 称为 jobs，macrotask 称为 task。

- 宏任务： script （主代码块）、setTimeout 、setInterval 、setImmediate 、I/O 、UI rendering
- 微任务：process.nextTick（Nodejs） 、promise 、Object.observe 、MutationObserver

微任务是在当前宏任务执行结束之后立即执行的任务，响应速度快于 setTimeout，无需等待 UI 渲染。当前宏任务执行后，会将在它执行期间产生的所有微任务都执行一遍。

#### nextTick

在下次 DOM 更新循环结束之后执行延迟回调。在修改数据之后立即使用这个方法，获取更新后的 DOM。

```js
// 修改数据
vm.msg = "Hello";
// DOM 还没有更新
Vue.nextTick(function () {
  // DOM 更新了
});

// 作为一个 Promise 使用 (2.1.0 起新增，详见接下来的提示)
Vue.nextTick().then(function () {
  // DOM 更新了
});
```

* vue在后续不同的版本分别使用了不同的方法来实现nextTick。
* 当使用setTimeout等宏任务函数，那么势必要等待UI渲染完成后的下一个宏任务执行。
* 而如果使用微任务函数，无需等待UI渲染完成才进行nextTick的回调函数操作，可以想象在JS引擎线程和GUI渲染线程之间来回切换，以及等待GUI渲染线程的过程中，浏览器势必要消耗性能。

