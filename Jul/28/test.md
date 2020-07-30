#### 局部变量和参数传递

```js
var bb = 1;
function aa(bb) {
  bb = 2; // 这里bb为函数内部定义的参数
  alert(bb);
}
aa(bb); // 2
alert(bb); // 1
```

#### 闭包和引用类型

```js
function Foo() {
  var i = 0;
  return function () {
    console.log(i++); // i为闭包中定义的局部变量
  };
}

var f1 = Foo(),
  f2 = Foo();
f1(); // 0
f1(); // 1
f2(); // 0
```
