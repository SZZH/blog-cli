const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');

const app = express();
const configInit = require('../config/webpack.config')
const config = configInit({production: false})
const compiler = webpack(config);

app.use(
  webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath,
  })
);

// 模块热替换
app.use(require("webpack-hot-middleware")(compiler));

// 将文件 serve 到 port 3000。
app.listen(3000, function () {
  console.log('http://localhost:3000\n');
});