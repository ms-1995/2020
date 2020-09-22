### vue-cli3.0+ 引入 loader

vue-cli3 中移除了 webpack.config.js 文件，我们需要手动新建 vue.config.js 文件作为 vue 项目的打包配置项文件。

loader 是 webpack 对引入模块的预处理。在引入一个模块前，会使用 loader 处理模块的内容。

现在以引入 worker-loader 为例，添加这个 loader 有两种写法

- chainWebpack 是一个函数，会接收一个基于 webpack-chain 的 `ChainableConfig` 实例。使用链式操作的方式来配置 webpack

  ```js
  module.exports = {
    chainWebpack: (config) => {
      // worker Loader
      config.module
        .rule("worker")
        .test(/\.worker\.js$/)
        .use("worker-loader")
        .loader("worker-loader")
        .options({filename: 'worker.[hash].js'});
    },
  };
  ```

- configureWebpack 为一个对象时，会通过 webpack-merge 合并到最终的配置中(只能新增loader配置)。而这个值是一个函数时，可以有条件的配置行为，同时可以通过config参数覆盖webpack配置

  ```js
  module.exports = {
    configureWebpack: (config) => {
      if (process.env.NODE_ENV === "production") {
        config.module.rules.push({
          test: /\.worker\.js$/,
          use: {
            loader: "worker-loader",
          },
        });
      }
    },
    //configureWebpack: {
    //  plugins: [new MyAwesomeWebpackPlugin()],
    //},
  };
  ```
### 使用 websocket

### worker 多线程
