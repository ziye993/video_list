const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  output: {
    publicPath: '/', // 打包后资源公共路径（需与 Node 静态资源路径一致）
    path: __dirname + '/dist',
    filename: 'bundle.[contenthash].js'
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'src/assets/json', // 源目录：存放 JSON 文件的目录（自定义路径）
          to: 'assets/json' // 输出目录：打包后 JSON 文件位于 dist/assets/json/
        }
      ]
    })
  ]
};