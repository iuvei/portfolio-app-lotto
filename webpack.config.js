"use strict";
const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const nodeModulesPath = path.resolve(__dirname, 'node_modules');
const buildPath = path.resolve(__dirname, 'dist');
const indexPath = path.resolve(__dirname, 'src', 'index.js');

// for babel and other tool env
const ENV = process.env.NODE_ENV ? 'development' : 'production';
const isDev = (ENV === 'development') ? true : false;

const configJSON = require('./config.json');


let iwpquery = {
  bypassOnDebug: true,
  mozjpeg: {
    progressive: true
  },
  gifsicle: {
    interlaced: false
  },
  optipng: {
    optimizationLevel: 7
  }
};

const appConfig = {

  entry: [
    'eventsource-polyfill',
    'webpack-hot-middleware/client?reload=true',
    indexPath
  ],

  output: {
    path: buildPath,
    publicPath: '/',
    filename: 'bundle.js'
  },

  devtool: 'cheap-module-eval-source-map',

  // target: 'web',
  devServer: {
    contentBase: './src'
  },

  resolve: {
    extensions: ['', '.js', '.jsx', '.json', '.css', '.sass', '.scss']
  },

  plugins: [
    // new ExtractTextPlugin(isDev ? '[name].css' : '[chunkhash].[name].css'),

    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.NoErrorsPlugin(),
    new HtmlWebpackPlugin({
      title: 'LottoLand Asia',
      filename: 'index.html',
      template: './src/index.html'
    }),
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: "commons",
    //   filename: isDev ? 'commons.js' : '[chunkhash].[name].js',
    //   // (Modules must be shared between 2 entries)
    //   minChunks: 2,
    //   /* chunks: ["pageA", "pageB"], */
    //   // (Only use these entries)
    // }),

    // ...(!isDev ? [
      new webpack.optimize.UglifyJsPlugin({
        output: {
          comments: false
        },
        compress: {
          warnings: false,
          screw_ie8: true
        }
      })
    // ] : []),

  ],

  module: {
    loaders: [
      {
        test: /\.(jsx?)$/,
        include: path.join(__dirname, 'src'),
        loaders: ['babel'],
        exclude: nodeModulesPath
      },
      {
        test: /\.json$/,
        loaders: ['json']
      },
      // {
      //   test: /\.css$/,
      //   loader: ExtractTextPlugin.extract(
      //     'style-loader',
      //     'css-loader?' + (isDev ? 'sourceMap' : ''),
      //     'resolve-url-loader'
      //   )
      // },
      // {
      //   test: /\.(css)$/,
      //   include: path.join(__dirname, 'public/vendor/pickadatejs/'),
      //   loader: 'style!css!resolve-url',
      //   exclude: nodeModulesPath
      // },
      {
        test: /\.(s?css|sass)$/,
        loaders: [
          'style',
          'css',
          'resolve-url',
          'sass?' + (isDev ? 'sourceMap' : '')
        ],
        include: path.join(__dirname, 'src', 'styles'),
        exclude: nodeModulesPath
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        exclude: nodeModulesPath,
        include: /public/,
        loader: 'file&name=fonts/[name].[ext]'
      },
      {
        test: /\.(woff|woff2)$/,
        exclude: nodeModulesPath,
        include: /public/,
        loader: 'url-loader?prefix=font/&limit=30000&name=fonts/[name].[ext]'
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        exclude: /public/,
        loader: 'url?limit=30000&mimetype=application/font-woff'
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        exclude: /public/,
        loader: 'file-loader'
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        exclude: nodeModulesPath,
        include: /public/,
        loader: 'url-loader?limit=30000&mimetype=application/octet-stream&name=fonts/[name].[ext]'
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        exclude: nodeModulesPath,
        include: /public/,
        loader: 'url-loader?limit=30000&mimetype=image/svg+xml&name=images/[name].[ext]'
      },
      {
        test: /\.(jpe?g|gif|png)$/i,
        loaders: [
          'file?hash=sha512&digest=hex&name=images/[name].[ext]',
          `image-webpack?${JSON.stringify(iwpquery)}`
        ],
        include: /public/,
        exclude: nodeModulesPath
      }
    ]
  },

  externals: { 'Config': '' }
};


if (process.env.NODE_ENV === 'production') {
  appConfig.entry = [indexPath];
  // appConfig.output.path = path.join(__dirname, 'public/')
  appConfig.output.filename = '[hash].[name].bundle.js';
  appConfig.devtool = false;

  appConfig.plugins.push(new webpack.DefinePlugin({
    'process.env': {
      'NODE_ENV': '"production"'
    }
  }));

} else { // development
  appConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
}

appConfig.externals.Config = JSON.stringify({
  rngDesktopURL: configJSON.rngURLs.desktop,
  rngMobileURL: configJSON.rngURLs.mobile,
  hfgDesktopURL: configJSON.hfgURLs.desktop,
  hfgMobileURL: configJSON.hfgURLs.mobile
});


module.exports = appConfig;
