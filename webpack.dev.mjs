import { merge } from 'webpack-merge'
import common from './webpack.common.mjs'
import path from 'path'

export default merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    port: 8080,
    static: path.join(process.cwd(), 'dist'),
    watchFiles: {
      paths: ['src/**/*.*'],
      options: {
        usePolling: true
      }
    }
  }
})
