let path = require('path')
const ThemeColorReplacer = require('webpack-theme-color-replacer')
//const CopyWebpackPlugin = require('copy-webpack-plugin')
const { getThemeColors, modifyVars } = require('./src/utils/themeUtil')
const { resolveCss } = require('./src/utils/theme-color-replacer-extend')
function resolve (dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: process.env.VUE_APP_API_BASE_URL,
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  },
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [path.resolve(__dirname, "./src/theme/theme.less")],
    }
  },
  configureWebpack: config => {
    //"babel-polyfill",
    config.entry.app = [ "whatwg-fetch", "./src/main.js"];
    config.plugins.push(
      new ThemeColorReplacer({
        fileName: 'css/theme-colors-[contenthash:8].css',
        matchColors: getThemeColors(),
        injectCss: true,
        resolveCss
      })
    )/* ,
    config.plugins.push(
      new CopyWebpackPlugin([
        { from: path.resolve(__dirname, '../public'), to: config.build.assetsSubDirectory, ignore: ['.*'] },
      ])
    ) */
  },
  chainWebpack: config => {
    // 生产环境下关闭css压缩的 colormin 项，因为此项优化与主题色替换功能冲突
   
    if (process.env.NODE_ENV === 'production') {
      config.plugin('optimize-css')
        .tap(args => {
          args[0].cssnanoOptions.preset[1].colormin = false
          return args
        })
    }

    //排除icons目录中svg文件处理
    config.module.rules.delete("svg");
    //设置svg-sprite-loader处理icons目录中的svg
    config.module
      .rule('svg')
      .test(/\.svg$/)
      .include.add(resolve('src/assets'))
      .end()
      .use('svg-sprite-loader')
      .loader("svg-sprite-loader")
      .options({ symbolId: 'icon-[name]' })
      .end()
  },
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          modifyVars: modifyVars(),
          javascriptEnabled: true
        }
      }
    }
  },
  
  publicPath:  '/',
  outputDir: 'dist',
  assetsDir: 'static',
  productionSourceMap: false
}
