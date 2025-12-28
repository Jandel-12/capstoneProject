const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    // Entry point - where Webpack starts bundling
    entry: './src/js/app.js',

    // Output configuration
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: isProduction ? 'js/[name].[contenthash].js' : 'js/bundle.js',
      clean: true, // Clean dist folder before each build
    },

    // Development server configuration
    devServer: {
      static: {
        directory: path.join(__dirname, 'dist'),
      },
      compress: true,
      port: 3000,
      hot: true, // Hot Module Replacement
      open: true, // Open browser automatically
    },

    // Module rules - how to process different file types
    module: {
      rules: [
        // JavaScript - Use Babel for modern JS
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
            },
          },
        },
        // CSS - Extract to separate file in production
        {
          test: /\.css$/,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader',
          ],
        },
      ],
    },

    // Plugins
    plugins: [
      // Generate HTML file with bundled assets
      new HtmlWebpackPlugin({
        template: './src/index.html',
        filename: 'index.html',
        minify: isProduction,
      }),
      // Extract CSS to separate file in production
      ...(isProduction
        ? [
            new MiniCssExtractPlugin({
              filename: 'css/[name].[contenthash].css',
            }),
          ]
        : []),
    ],

    // Optimization
    optimization: {
      minimize: isProduction,
      minimizer: [
        new TerserPlugin(), // Minify JavaScript
        new CssMinimizerPlugin(), // Minify CSS
      ],
    },

    // Source maps for debugging
    devtool: isProduction ? 'source-map' : 'eval-source-map',

    // Resolve extensions
    resolve: {
      extensions: ['.js'],
    },
  };
};