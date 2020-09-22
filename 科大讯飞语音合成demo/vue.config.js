module.exports = {
  publicPath: './',
  chainWebpack: config => {
    // worker Loader
    config.module
      .rule('worker')
      .test(/\.worker\.js$/)
      .use('worker-loader')
      .loader('worker-loader')
      .options({filename: 'worker.[hash].js'})
  },
}