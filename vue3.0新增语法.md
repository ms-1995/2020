### 新增响应式 API - ref, reactive

- `reactive`接收一个普通对象然后返回该普通对象的响应式代理

- `ref`接受一个参数值并返回一个响应式且可改变的 `ref` 对象, 如果传入的是一个对象，将调用调用`reactive`方法

- `ref`的属性`value`指向内部值，但是`ref`作为属性返回或者作为 `reactive` 对象的 `property` 被访问或修改时, 将自动解套 `value` 值

### 新增组件选项 - setup 函数

> setup 函数是一个新的组件选项。作为在组件内使用 Composition API 的入口点。

- 调用时机：创建组件实例，初始化`props`后。在`beforeCreate`之前调用

- 返回一个对象时，对象的属性会被合并到组件模板的上下文中

```ts
setup(){
  const value = 1
  return {
    value
  }
}
```

- 也可以返回一个渲染函数，在函数中可以使用`setup`作用域的响应式数据

```ts
setup() {
  const value = 1
  return () => h('div',[value])
}
```

- `setup`接收`props`和`context`上下文作为参数

```js
setup(props, context){
  context.attrs
  context.slots
  context.emit
  const value = 1
  return {
    value
  }
}
```

- hook

```vue
<template>
  <div>{{ text }} {{ object.count }}</div>
  <p>{{ getValue }}</p>
  <button @click="text += 1">change text</button>
  <button @click="object.count += 1">change count</button>
</template>
<script>
import { ref, reactive, computed } from "vue";

export default {
  props: {
    name: String,
  },
  setup(props) {
    const { text, object, getValue } = useHookData(props.name);
    return {
      text,
      object,
      getValue,
    };
  },
};

function useHookData(msg) { // 用于hook的方法前面加use区分
  const text = ref(msg);
  const object = reactive({ count: 1 });
  const getValue = computed(() => (object.count += 1));
  return {
    text,
    object,
    getValue,
  };
}
</script>
```
