const path = require('path');
const { merge } = require('webpack-merge');

const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const HtmlWebpackPlugin = require('html-webpack-plugin')

const devConfig = require('./webpack.dev.config')
const prodConfig = require('./webpack.prod.config')

const env = process.env.NODE_ENV
const extendConfig = env === 'dev' ? devConfig : prodConfig

const defaultConfig = {
  entry: {
    index: './src/index.js',
  },
  output: {
    filename: '[name].bundle.[contenthash:8].js',
    clean: {
      keep: /\.html$/i
    },
    path: path.resolve(__dirname, '../dist'),
    // publicPath: '/'
  },
  optimization: {
    moduleIds: 'deterministic',
    runtimeChunk: 'single',   // webpack 自身编译过后的 runtime 代码单独打包，减小 index 文件体积
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        include: path.resolve(__dirname, 'src'),
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-transform-runtime']   // Babel 对一些公共方法使用了非常小的辅助代码，比如 _extend。默认情况下会被添加到每一个需要它的文件中。
          }
        }
      },
      // 样式
      {
        test: /\.css$/i,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  [
                    'postcss-preset-env',   // 用来转换 css 以适配更多的浏览器，生成一个独一无二的名字
                    {
                      // 其他选项
                    },
                  ],
                ],
              },
            },
          },
        ]
      },
      // 图片
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      // 字体
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[hash].css'
    }),
    // 自动引入打包好的文件
    new HtmlWebpackPlugin({
      title: '管理输出'
    }),
  ],
}

module.exports = merge(defaultConfig, extendConfig)