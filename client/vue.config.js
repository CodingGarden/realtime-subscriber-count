module.exports = {
  configureWebpack: {
    module: {
      rules: [{
        test: require.resolve('jquery'),
        use: [{
          loader: 'expose-loader',
          options: '$'
        }, {
          loader: 'expose-loader',
          options: 'jQuery'
        }]
      }]
    }
  }
}