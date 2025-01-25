import path from 'path'
import fs from 'fs'

import CssMinimizerPlugin from 'css-minimizer-webpack-plugin'
import HtmlBundlerPlugin from 'html-bundler-webpack-plugin'
import { FaviconsBundlerPlugin } from 'html-bundler-webpack-plugin/plugins'

import data from './src/data.mjs'

const packageJson = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'package.json'), 'utf-8'))
const name = packageJson.name.toUpperCase()
const fullName = 'Choose Your Own Board Game'
const description = packageJson.description
const keywords = packageJson.keywords.join(', ')
const author = packageJson.author
const version = packageJson.version

export default {
  plugins: [
    new HtmlBundlerPlugin({
      entry: {
        index: {
          import: './src/index.eta',
          data: {
            title: fullName,
            description,
            keywords,
            author,
            data
          }
        },
        404: {
          import: './src/404.html'
        }
      },
      css: {
        inline: false,
        filename: '[name].[contenthash:8].css'
      },
      js: {
        inline: false,
        filename: '[name].[contenthash:8].js'
      },
      minify: 'auto'
    }),
    new FaviconsBundlerPlugin({
      enabled: true,
      faviconOptions: {
        path: '',
        appName: fullName,
        appShortName: name,
        appDescription: description,
        developerName: author,
        start_url: '/',
        version,
        icons: {
          android: true,
          appleIcon: true,
          favicons: true,
          windows: true
        }
      }
    })
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          {
            loader: 'css-loader',
            options: {
              import: false // HtmlBundlerPlugin does not support @import url() in CSS
            }
          }
        ]
      },
      {
        test: /\.(gif|ico|jp?g|png|svg)$/i,
        type: 'asset/resource',
        generator: {
          filename: '[name]-[width]w.[ext]'
        },
        parser: {
          dataUrlCondition: {
            maxSize: 2 * 1024 // Inline images < 2 KB
          }
        }
      },
      {
        test: /\.(eot|otf|ttf|woff|woff2)$/i,
        type: 'asset/resource'
      }
    ]
  },
  optimization: {
    minimizer: [
      '...', // Extend existing minimizers
      new CssMinimizerPlugin()
    ]
  },
  output: {
    assetModuleFilename: '[name][ext]',
    clean: true,
    path: path.join(process.cwd(), 'dist')
  }
}
