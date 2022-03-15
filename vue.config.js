const path = require('path');
const dayjs = require('dayjs');
const webpack = require('webpack');
const WebpackBar = require('webpackbar');
const TerserPlugin = require('terser-webpack-plugin');
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
    .BundleAnalyzerPlugin;
const resolve = dir => path.join(__dirname, dir);
const pkg = require('./package.json');
const IS_PROD = ["production", "prod"].includes(process.env.NODE_ENV);
const IS_DEV = ["development"].includes(process.env.NODE_ENV);
['dependencies', 'devDependencies'].forEach((name) => {
    Object.keys(pkg[name]).forEach((key) => {
        const devPkg = require(`./node_modules/${key}/package.json`);
        pkg[name][key] = {
            url: devPkg.repository.url || devPkg.repository || devPkg.homepage,
            version: pkg[name][key],
        };
    });
});
const __APP_INFO__ = {
    pkg,
    lastBuildTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
};

module.exports = {
    publicPath: IS_PROD ? './' : '/', // 署应用包时的基本 URL。 vue-router hash 模式使用
    outputDir: 'dist',
    assetsDir: '',
    indexPath: 'index.html',
    filenameHashing: false,
    lintOnSave: IS_DEV,
    runtimeCompiler: true,
    productionSourceMap: false,
    devServer: {
        host: 'localhost',
        port: 8080,
        https: false,
        open: true,
        allowedHosts: 'auto',
        hot: true,
        magicHtml: true,
        client: {
            logging: 'info',
            progress: false,
            overlay: {
                errors: true,
                warnings: false
            }
        },
        proxy: {
            '/api': {
                target: 'http://localhost:8080',
                changeOrigin: true,
                ws: false,
                secure: false,
                pathReWrite: {
                    '^/api': ''
                }
            },
        }
    },
    css: {
        sourceMap: false,
        loaderOptions: {
            less: {
                prependData: `@import "~@/styles/global.less";`
            },
        }
    },
    pwa: {
        iconPaths: {
            favicon32: 'favicon.ico',
            favicon16: 'favicon.ico',
            appleTouchIcon: 'favicon.ico',
            maskIcon: 'favicon.ico',
            msTileImage: 'favicon.ico',
        },
    },
    configureWebpack: config => {
        return {
            mode: 'production',
            cache: {
                type: "filesystem",
                name: "prod-cache"
            },
            experiments: {
                topLevelAwait: true
            },
            performance: {
                hints: false
            },
            output: {
                clean: true,
                filename: 'js/[name]-[hash:8].js',
                chunkFilename: (pathData) => {
                    // console.warn(pathData.chunk.id)
                    const temp = pathData.chunk.id.split('_')
                    if (temp.length >= 3 && (temp[1] === 'pages' || temp[1] === 'utils')) {
                        return `js/${temp[2]}-${temp[3]}-[chunkhash:8].js`
                    } else {
                        return 'js/[id]-[chunkhash:8].js'
                    }
                }
            },
            externals: {
                'AMap': 'AMap',
            },
            plugins: [
                // 编译进度条
                new WebpackBar({
                    name: 'H5',
                    color: '#07c160'
                }),
                // 为项目注入全局变量
                new webpack.DefinePlugin({
                    'process.env': {
                        AXIOS_BASE_URL: JSON.stringify(process.env.AXIOS_BASE_URL),
                        AXIOS_BASE_API: JSON.stringify(process.env.AXIOS_BASE_API),
                        AMAP_KEY: JSON.stringify(process.env.AMAP_KEY),
                        IS_MOCK: JSON.stringify(process.env.IS_MOCK),
                    },
                    __APP_INFO__: JSON.stringify(__APP_INFO__)
                }),
                // 开启HMR
                new webpack.HotModuleReplacementPlugin(),
                // 作用域提升，提成代码在浏览器执行速度
                new webpack.optimize.ModuleConcatenationPlugin(),
                // 代码压缩
                new TerserPlugin({
                    terserOptions: {
                        warnings: false,
                        format: {
                            comments: false,
                        },
                        compress: {
                            drop_debugger: true, // 注释console
                            drop_console: true,
                            pure_funcs: ['console.log'], // 移除console
                        },
                    },
                    extractComments: false, // 是否将注释提取到一个单独的文件中
                    parallel: true,
                })
            ],
            // 优化策略
            optimization: {
                chunkIds: "named",
                // 代码压缩
                minimize: true,
                // 文件分割
                splitChunks: {
                    chunks: 'all',
                    minSize: 30000,
                    // minRemainingSize: 0,
                    // minChunks: 1,
                    // maxAsyncRequests: 6,
                    // maxInitialRequests: 4,
                    // automaticNameDelimiter: '~',
                    cacheGroups: {
                        vendors: {
                            name: `chunk-venders`,
                            test: /[\\/]node_modules[\\/]/,
                            priority: -10,
                            chunks: 'initial'
                        },
                        vue: {
                            name: `chunk-vue`,
                            test: /([\\/]node_modules[\\/]vue)/,
                            priority: -8,
                            chunks: 'initial'
                        }
                    }
                }
            }
        }
    },
    chainWebpack: config => {
        // 添加别名
        config.resolve.alias
            .set('@', resolve('src'))
            .set('@assets', resolve('src/assets'))
            .set('@components', resolve('src/components'))
            .set('@router', resolve('src/utils/router'))
            .set('@store', resolve('src/utils/store'))
            .set('@api', resolve('src/utils/api'))
            .set('@config', resolve('config'))
            .set('@mock', resolve('mock'));

        // config.module.rules.clear();

        if (IS_PROD) {
            // 压缩图片
            // config.module
            //     .rule("images")
            //     .test(/\.(png|jpe?g|gif|svg)(\?.*)?$/)
            //     .use("image-webpack-loader")
            //     .loader("image-webpack-loader")
            //     .options({
            //         mozjpeg: { progressive: true, quality: 65 },
            //         optipng: { enabled: false },
            //         pngquant: { quality: [0.65, 0.90], speed: 4 },
            //         gifsicle: { interlaced: false }
            //     });

            // 打包分析
            config.plugin("webpack-report").use(BundleAnalyzerPlugin, [
                {
                    analyzerMode: "static"
                }
            ]);
        }

        // config.plugin('html').tap((args) => {
        //     args[0].title = 'H5通用工程';
        //     return args;
        // });
    }
}