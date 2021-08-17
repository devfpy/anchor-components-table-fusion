/*
 * @Author: devfpy
 * @Date: 2021-08-17 18:09:22
 * @LastEditTime: 2021-08-17 18:21:43
 * @LastEditors: devfpy
 * @Description:
 */
const {
  override,
  fixBabelImports,
  addWebpackModuleRule,
  addWebpackPlugin,
  disableEsLint
} = require('customize-cra')
const path = require('path')
const webpack = require('webpack')
const ThemePlugin = require('@alifd/next-theme-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = override(
  fixBabelImports('import', {
    libraryName: '@alifd/next',
    libraryDirectory: 'es'
  }),
  disableEsLint(),
  addWebpackModuleRule({
    test: /\.jsx?$/,
    use: {
      loader: 'babel-loader',
      options: {
        presets: ['@babel/preset-env', '@babel/preset-react'],
        plugins: [
          ['babel-plugin-import', { libraryName: '@alifd/next', style: true }]
        ]
      }
    },
    exclude: /node_modules/
  }),
  addWebpackModuleRule({
    test: /\.css$/,
    use: ExtractTextPlugin.extract({
      use: 'css-loader'
    })
  }),
  addWebpackModuleRule({
    test: /\.scss$/,
    use: ExtractTextPlugin.extract({
      use: [
        'css-loader',
        'fast-sass-loader',
        {
          // 添加 @alifd/next-theme-loader，引入自定义主题样式对应的 scss 变量
          loader: '@alifd/next-theme-loader',
          options: {
            theme: '@alifd/theme-2',
            // 基准包，默认是@alifd/next
            base: '@alifd/next'
            // 注入变量，来编译组件样式
            // 支持 Object 和 String ， 如果是 String 请写绝对路径 例如: modifyVars: path.join(__dirname, 'variable.scss')
            // 以下为Object
            // modifyVars: {
            //   '$css-prefix': '"myprefix-"'
            // }
          }
        }
      ]
    })
  }),
  addWebpackPlugin(
    new ThemePlugin({
      theme: '@alifd/theme-2',
      // 基准包，默认是@alifd/next
      libraryName: '@alifd/next',
      // 是否将内置的normalize样式添加到最终的样式包中，默认为true
      prependNormalizeCSS: true
      // 注入变量，来编译normalize和icon样式
      // 支持 Object 和 String ， 如果是 String 请写绝对路径 例如: modifyVars: path.join(__dirname, 'variable.scss')
      // 以下为Object
      // modifyVars: {
      //   '$css-prefix': '"myprefix-"'
      // }
    })
  ),
  addWebpackPlugin(new ExtractTextPlugin('[name].css'))
)
