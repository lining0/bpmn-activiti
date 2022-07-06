// https://umijs.org/config/
import os from 'os';
import pageRoutes from './router.config';
import webpackPlugin from './plugin.config';
import defaultSettings from '../src/defaultSettings';
import slash from 'slash2';

const {pwa, primaryColor} = defaultSettings;
const {APP_TYPE, TEST} = process.env;

const plugins = [
    [
        'umi-plugin-react',
        {
            antd: true,
            dva: {
                hmr: true,
            },
            locale: {
                enable: true, // default false
                default: 'zh-CN', // default zh-CN
                baseNavigator: true, // default true, when it is true, will use `navigator.language` overwrite default
            },
            dynamicImport: {
                loadingComponent: './components/PageLoading/index',
                webpackChunkName: true,
                level: 3,
            },
            pwa: pwa
                ? {
                      workboxPluginMode: 'InjectManifest',
                      workboxOptions: {
                          importWorkboxFrom: 'local',
                      },
                  }
                : false,
            ...(!TEST && os.platform() === 'darwin'
                ? {
                      dll: {
                          include: ['dva', 'dva/router', 'dva/saga', 'dva/fetch'],
                          exclude: ['@babel/runtime'],
                      },
                      hardSource: false,
                  }
                : {}),
        },
    ],
];

// 针对 preview.pro.ant.design 的 GA 统计代码
// 业务上不需要这个
// if (APP_TYPE === 'site') {
//     plugins.push([
//         'umi-plugin-ga',
//         {
//             code: 'UA-72788897-6',
//         },
//     ]);
// }

export default {
    // add for transfer to umi
    // plugins,
    antd: {},
    dva: {
        hmr: true,
    },
    locale: {
        // default zh-CN
        default: 'zh-CN',
        antd: true,
        // default true, when it is true, will use `navigator.language` overwrite default
        baseNavigator: true,
    },
    // dynamicImport: {
    //     loadingComponent: './components/PageLoading/index',
    //     webpackChunkName: true,
    //     level: 3,
    // },
    define: {
        APP_TYPE: APP_TYPE || '',
        // 'process.env.apiUrl': 'http://192.168.1.154:5077', // 联调环境
        // 'process.env.apiUrl': 'http://192.168.0.24:5014',
        'process.env.apiUrl': 'http://localhost:8000',
    },
    history: {type: 'hash'}, // 默认是 browser
    targets: {
        ie: 11,
    },
    // 路由配置
    routes: pageRoutes,
    // Theme for antd
    // https://ant.design/docs/react/customize-theme-cn
    theme: {
        'primary-color': primaryColor,
    },
    // proxy: {
    //   '/server/api/': {
    //     target: 'https://preview.pro.ant.design/',
    //     changeOrigin: true,
    //     pathRewrite: { '^/server': '' },
    //   },
    // },
    ignoreMomentLocale: true,
    manifest: {
        basePath: '/',
    },
    chainWebpack: webpackPlugin,
};
