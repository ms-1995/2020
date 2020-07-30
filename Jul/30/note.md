### ES5实现继承

#### 原型继承

1. 所有Child实例都指向同一个Parent实例，修改某一个Child实例的父类的引用类型变量会影响所有Child实例
2. 创建CHild实例时无法向Parent类构造传参

```js
function Parent() {
  this.name = 'parent'
}
Parent.prototype.getName = function() {
  return this.name
}

function Child() {}
Child.prototype = new Parent()
Child.prototype.constructor = Child

const child = new Child()
child.name // parent
child.getName() // parent
```

#### 构造函数继承

1. 继承不到父类原型上的属性和方法

```js
function Parent(name) {
  this.name = name
}
Parent.prototype.getName = function() {
  return this.name
}

function Child() {
  Parent.call(this,'child')
}

const child1 = new Child()
const child2 = new Child()
child1.name = 'child1'
child1.name // child1
child2.name // child
child2.getName() // 找不到getName()
```

#### 组合式继承

1. 每次创建子类实例都要执行两次构造函数

```js
function Parent(name) {
  this.name = name
}
Parent.prototype.getName = function() {
  return this.name
}

function Child() {
  Parent.call(this,'child')
}
Child.prototype = new Parent()
Child.prototype.constructor = Child

const child1 = new Child()
const child2 = new Child()
child1.name = 'child1'
child1.name // child1
child2.name // child
child2.getName() // child
```

#### 寄生式组合继承

1. 将指向实例改为指向原型

```js
function Parent(name) {
  this.name = name
}
function Child() {
  Parent.call(this, 'child')
}
// Child.prototype = Parent.prototype
Child.prototype = Object.create(Parent.prototype) // 浅拷贝使Child原型与Parent原型不指向同一个对象
Child.prototype.constructor = Child
Child.prototype.getName = function() {
  return this.name
}

const child = new Child()
const parent = new Parent()
child.getName() // child
parent.getName() // 找不到getName()
```

### V8引擎机制

#### V8执行流程

1. 预解析：检查语法错误
2. 生成AST：经过词法/语法分析，生成抽象语法树
3. 生成字节码：基线编译器将AST转为字节码
4. 生成机器码：优化编译器将字节码转换为优化过的机器码，如果一段代码经常被执行，V8会将这段代码转换成机器码并保存起来

#### 垃圾回收

* 栈内存回收：栈内存调用栈上下文切换后就会被回收
* 堆内存回收：
  1. 新生代内存回收：分为From和To两部分。垃圾回收时先扫描From将非存活对象回收，将存活对象按顺序复制到To中，之后调换From/To等待下一次回收。
  2. 老生代内存回收：
    * 晋升：如果新生代变量经过多次回收依然存在，那么就会被放入老生代内存中。
    * 标记清除：老生代会先遍历所有对象并打上标记，然后对正在使用或被强引用的对象取消标记，回收被标记的对象。
    * 整理内存碎片：把对象挪到内存的一端。

#### V8优化

* js的问题：

  1. 动态类型：每次存取属性/寻找方法时都需要先检查类型
  2. 属性存取：存储在对象中，每次获取都需要进行哈希查询

* V8的优化：

  1. 优化JIT(即时编译)：将被执行多次的代码缓存下来，下次运行时直接使用机器码
  2. 隐藏类：借用了类和偏移位置的思想，将对象划分成不同的组
  3. 内嵌缓存：缓存对象查询的结果
  4. 垃圾回收管理

### 浏览器渲染机制

#### 浏览器渲染流程

  1. HTML和CSS经过解析，生成DOM树和CSSOM树
  2. 合并成渲染树
  3. 根据渲染树进行布局
  4. 调用GPU进行绘制，显示在屏幕上

#### 首屏加载速度优化

  1. 优化文件大小，减少CSS文件层级
  2. 将`<script>`标签放在底部，或加上`defer, async`来进行异步下载

#### 回流与重绘

  * DOM元素的几何属性发生变化，DOM元素移动或增加，读写`offset/scroll/client`等属性或者调用`window.getComputedStyle`时都会触发回流
  * DOM样式发生变化但没有影响DOM的几何属性时会触发重绘。

#### 如何减少回流

  * 减少`style`的使用
  * 使用`resize或scroll`时进行防抖节流处理
  * 使用`visibility`替代`display: none`
  * 批量修改元素时，先让元素脱离文档流。等修改完毕后再放入文档流
  * 避免触发同步布局事件
  * 对于复杂动画效果，使用绝对定位让其脱离文档流