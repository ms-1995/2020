可以将 Promise 构造函数看作一个 callback，这个 callback 返回了两个定义好的方法 resolve 和 reject。这样将参数传入 resolve 或 reject 就可以改变实例内部。
then 接受两个 callback，并将 resolve 和 reject 传入的值作为 callback 的参数暴露出来。

```ts
// 定义三种状态
const PENDING = "PENDING"; // 进行中
const FULFILLED = "FULFILLED"; // 已成功
const REJECTED = "REJECTED"; // 已失败

class myPromise {
  constructor(exector: function) {
    this.status = PENDING;
    this.value = undefined;
    this.reason = undefined;

    const resolve = (value) => {
      if (this.status === PENDING) {
        this.status = FULFILLED;
        this.value = value;
      }
    };

    const reject = (reason) => {
      if (this.status === PENDING) {
        this.status = REJECTED;
        this.reason = reason;
      }
    };

    try {
      exector(resolve, reject);
    } catch (e) {
      reject(e);
    }
  }

  then(onFulfilled, onRejected) {
    setTimeout(() => {
      if (this.status === FULFILLED) {
        // FULFILLED状态下才执行
        onFulfilled(this.value);
      } else if (this.status === REJECTED) {
        // REJECTED状态下才执行
        onRejected(this.reason);
      }
    });
  }
}

new myPromise((resolve, reject) => {
  resolve(1);
}).then((res) => {
  console.log(res); // 1
});
```

```js
function fn(callback) {
  callback(
    (item1) => {
      console.log(item1);
    },
    (item2) => {
      console.log(item2);
    }
  );
}

fn((x, y) => {
  x(1);
  y(2);
});
```
