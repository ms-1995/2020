#### require.context 模块自动化导入

需要导入模块非常多时

* require.context(directory, useSudirectories = false, regExp = /^\.\//)
* directory: 要扫描的目录
* useSudirectories: 是否扫描所有的子级文件夹
* regExp: 要扫描的文件，做正则匹配

```js
const context = require.context('./', false, /\.vue$/)

context.keys().forEach(key => {
  // 获取key对应文件export default导出的内容
  component = context(key).default
  // 安装vue组件
  Vue.component(component.name, component)
})
```

#### mixin混入规则

```js
export default {
  // mixins属性用于导入混入，是一个数组，数组可以传入多个混入对象
  mixins: [echartMixins],
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.chart = echarts.init(this.$el)
  }
}

```

* data属性发生冲突时，以组件自身为主。
* 生命周期钩子函数发生冲突时，会将同名钩子函数放入数组中，按照优先执行混入函数的原则依次执行。
* methods,components等其他选项时，会合并为一个对象，并在键名冲突时，取组件对象的键值对。