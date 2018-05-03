const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');
const webpack = require('webpack');


const jsonServer = require('json-server');
var server = jsonServer.create();

var data = require('./mock/db.js');
var router = jsonServer.router(data);
var middlewares = jsonServer.defaults();
server.use(middlewares);
server.use('/mock', router);
server.listen(9097, function () {
  console.log('Mock API Server is running!')
});


module.exports = {
  context: path.join(__dirname, './src'),
  entry: {
    app: './app/index.js'
  },
  output: {
    filename: '[name].[hash:7].js',
    path: path.join(__dirname, './dist'),
  },
  module: {
    rules: [{
        test: /.jsx?$/,
        include: [
          path.resolve(__dirname, 'app')
        ],
        exclude: [
          path.resolve(__dirname, 'node_modules'),
          path.resolve(__dirname, 'bower_components')
        ],
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      },
      {
        test: /\.js$/,
        exclude: path.resolve(__dirname, 'node_modules'),
        use: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.scss$/,
        use: [{
            loader: 'style-loader'
          },
          {
            loader: 'css-loader?sourceMap'
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true
            }
          },
          {
            loader: 'sass-loader?sourceMap'
          }
        ]
      },
      {
        test: /\.(png|jpg|gif|svg|ico)$/,
        use: ['url-loader?limit=4096&name=[path][name].[ext]?[hash:7]', 'image-webpack-loader']
      }, {
        test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
        use: "file-loader",
      }
    ]
  },
  resolve: {
    extensions: ['.json', '.js', '.jsx', '.css'],
  },
  resolveLoader: {
    modules: [
      path.join(__dirname, "src"),
      "node_modules"
    ]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: ({
        resource
      }) => (
        resource &&
        resource.indexOf('node_modules') >= 0 &&
        resource.match(/\.js$/)
      ),
    }),
    new HtmlWebpackPlugin({
      template: './index.html',
      inject: true,
      minify: {
        minifyJS: true,
        removeComments: true,
        collapseWhitespace: true
      }
    }),
    // 注入webpack运行的环境变量（是否为开发环境）
    new webpack.DefinePlugin({
      __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'false'))
    }),
    new webpack.optimize.ModuleConcatenationPlugin()
  ],
  devServer: {
    host: '127.0.0.1',
    port: 8091,
    historyApiFallback: true,
    noInfo: true,
    watchOptions: {
      poll: true
    },
    contentBase: './src'
  },
  devtool: '#eval-source-map'
};