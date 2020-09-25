### vue 监听生命周期钩子函数

#### 内部监听

在 Vue 组件中，可以用$on,$once 去监听所有的生命周期钩子函数

```js
export default {
  mounted() {
    window.addEventListener("resize", this.$_handleResizeChart);
    this.$once("hook:beforeDestroy", () => {
      // 监听beforeDestroy生命周期钩子函数
      window.removeEventListener("resize", this.$_handleResizeChart);
    });
  },
};

export default {
  mounted() {
    window.addEventListener("resize", this.$_handleResizeChart);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.$_handleResizeChart);
  },
};
```

#### 外部监听

组件的所有生命周期钩子都可以通过@hook:钩子函数名 来监听触发

```html
<template>
  <!--通过@hook:updated监听组件的updated生命钩子函数-->
  <custom-select @hook:updated="$_handleSelectUpdated" />
</template>
<script>
  import CustomSelect from "../components/custom-select";
  export default {
    components: {
      CustomSelect,
    },
    methods: {
      $_handleSelectUpdated() {
        console.log("custom-select组件的updated钩子函数被触发");
      },
    },
  };
</script>
```

### 可响应对象 Vue.observable（2.6.0）

- 让一个对象可响应，Vue 内部用它来处理 data 函数返回的对象。
- 它会在发生改变时触发相应的更新。
- 2.x 中，传入的对象和返回的对象为同一对象。而 3.x 中，会返回一个可响应的代理，对源对象的修改仍然是不可响应的。

```js
export const store = Vue.observable({
  userInfo: {},
  roleIds: [],
});
```

### 自定义指令 Vue.directive

常见场景

- 为组件添加 loading 效果
- 按钮级别权限控制 `v-permission`
- 代码埋点,根据操作类型定义指令
- input 输入框自动获取焦点

```js
// 定义一个名为loading的指令
Vue.directive("loading", {
  /**
   * @param {*} el 指令要绑定的元素
   * @param {*} binding 指令传入的信息，包括 {name:'指令名称', value: '指令绑定的值',arg: '指令参数 v-bind:text 对应 text'}
   */
   // 钩子函数
  bind(el, binding) {}, // 只调用一次，指令第一次绑定到元素时调用。在这里可以进行一次性的初始化设置。
  inserted(el, binding) {}, // 被绑定元素插入父节点时调用 (仅保证父节点存在，但不一定已被插入文档中)。
  update(el, binding) {}, // 所在组件的 VNode 更新时调用，但是可能发生在其子 VNode 更新之前。
  componentUpdated(el, binding){}, // 指令所在组件的 VNode 及其子 VNode 全部更新后调用。
  unbind(el, binding) {}, // 只调用一次，指令与元素解绑时调用。
});

```

```js
// <input v-focus>
Vue.directive('focus', {
  // 当被绑定的元素插入到 DOM 中时……
  inserted: function (el) {
    // 聚焦元素
    el.focus()
  }
})
```

### watch

```js
export default {
  watch: {
    searchValue: {
      // 通过handler来监听属性变化, 初次调用 newValue为""空字符串， oldValue为 undefined
      handler(newValue, oldValue) {
        if (newValue !== oldValue) {
          this.$_loadData();
        }
      },
      // 配置立即执行属性
      immediate: true,
      // 深度监听，监听对象内的全部属性变化
      deep: false,
    },
  },
};
```

在调用方法中，随时监听

```js
// 等表单数据回填之后，监听数据是否发生变化
const unwatch = this.$watch(
  "formData",
  () => {
    console.log("数据发生了变化");
  },
  {
    deep: true,
  }
);
unwatch() // 取消监听
```

### 函数式组件与普通组件的区别

1. 函数式组件需要在声明组件是指定functional（配置functional属性为true）
2. 函数式组件不需要实例化，所以没有this,this通过render函数的第二个参数来代替
3. 函数式组件没有生命周期钩子函数，不能使用计算属性，watch等等
4. 函数式组件不能通过$emit对外暴露事件，调用事件只能通过context.listeners.click的方式调用外部传入的事件
5. 因为函数式组件是没有实例化的，所以在外部通过ref去引用组件时，实际引用的是HTMLElement
6. 函数式组件的props可以不用显示声明，所以没有在props里面声明的属性都会被自动隐式解析为prop,而普通组件所有未声明的属性都被解析到$attrs里面，并自动挂载到组件根元素上面(可以通过inheritAttrs属性禁止)
