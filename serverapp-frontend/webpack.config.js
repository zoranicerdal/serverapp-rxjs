// webpack.config.js
const { VueLoaderPlugin } = require('vue-loader')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')

let glob = require('glob')
let path = require('path')

module.exports = {
  entry: glob.sync('./application/packages/**/views/**/js/*.js').reduce(function(obj, el) {
    obj[path.parse(el).name] = el;
    return obj
  }, {}),
  output: {
    path: path.resolve(__dirname, './assets/static-generated/js'),
    filename: "[name].js"
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      // this will apply to both plain `.js` files
      // AND `<script>` blocks in `.vue` files
      {
        test: /\.js$/,
        loader: 'babel-loader'
      },
      // this will apply to both plain `.css` files
      // AND `<style>` blocks in `.vue` files
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader'
        ]
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'resolve-url-loader',
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true
            }
          }
        ]
      }
    ]
  },
  plugins: [
    // make sure to include the plugin for the magic
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({
      filename: '../css/[name].css',
      chunkFilename: '../css/[id].css'
    })
  ],
  resolve: {
    alias: {
      vue: process.env.NODE_ENV === 'development' ? 'vue/dist/vue.js' : 'vue/dist/vue.min.js'
    }
  },
  optimization: {
    minimize: process.env.NODE_ENV === 'development' ? false : true,
    minimizer: [
      new TerserPlugin({
        extractComments: false,
        terserOptions: {
          compress: {},
          mangle: true,
          toplevel: true,
          format: {
            comments: false,
          },
        },
      }),
      new CssMinimizerPlugin()
    ]
  }
}