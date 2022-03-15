# H5 通用 vue-cli5 工程

基于 vue-cli5 + vue2.0 + vant，构建通用移动端项目模板

### Node 版本

本示例 Node.js 12.13.0

### 启动项目

```bash

yarn

yarn dev
```

### 目录

- √ Vue-cli5
- [√ 配置多环境变量](#env)
- [√ rem 适配方案](#rem)
- [√ VantUI 组件按需加载](#vant)
- [√ Less 全局样式](#Less)
- [√ Vuex 状态管理](#vuex)
- [√ Vue-router](#router)
- [√ Axios 封装及接口管理](#axios)
- [√ Webpack 5 vue.config.js 基础配置](#base)
- [√ 配置 alias 别名](#alias)
- [√ 配置 proxy 跨域](#proxy)

### <span id="env">✅ 配置多环境变量 </span>

`package.json` 里的 `scripts` 配置 `dev` `test` `staging` `prod`，通过 `--mode xxx` 来执行不同环境

- 通过 `yarn dev` 启动开发环境 , 执行 `development`
- 通过 `yarn test` 打包 环境测试 , 执行 `test`
- 通过 `yarn staging` 打包 准生产测试 , 执行 `staging`
- 通过 `yarn prod` 打包生产环境 , 执行 `production`

```bash
yarn dev

yarn test

yarn staging

yarn prod
```

##### 配置介绍

&emsp;&emsp;以 `VUE_APP_` 开头的变量，在代码中可以通过 `process.env.VUE_APP_` 访问。
&emsp;&emsp;比如,`VUE_APP_ENV = 'development'` 通过`process.env.VUE_APP_ENV` 访问。
&emsp;&emsp;除了 `VUE_APP_*` 变量之外，在你的应用代码中始终可用的还有两个特殊的变量`NODE_ENV` 和`BASE_URL`

在项目根目录中新建`.env.*`

### <span id="rem">✅ rem 适配方案 </span>

不用担心，项目已经配置好了 `rem` 适配

[▲ 回顶部](#top)

### <span id="vant">✅ VantUI 组件按需加载 </span>

项目采
用[Vant 自动按需引入组件 (推荐)](https://youzan.github.io/vant/#/zh-CN/quickstart#fang-shi-yi.-zi-dong-an-xu-yin-ru-zu-jian-tui-jian)下
面安装插件介绍：

[babel-plugin-import](https://github.com/ant-design/babel-plugin-import) 是一款 `babel` 插件，它会在编译过程中将
`import` 的写法自动转换为按需引入的方式

[▲ 回顶部](#top)

### <span id="router">✅ Vue-router </span>

本案例采用 `hash` 模式，开发者根据需求修改 `mode` `base`

**注意**：如果你使用了 `history` 模式，`vue.config.js` 中的 `publicPath` 要做对应的**修改**

前往:[vue.config.js 基础配置](#base)

```javascript
import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);
export const router = [
  {
    path: "/",
    name: "index",
    component: () => import("@/pages/home/index"), // 路由懒加载
    meta: {
      title: "首页", // 页面标题
      keepAlive: false // keep-alive 标识
    }
  }
];
const createRouter = () =>
  new Router({
    // mode: 'history', // 如果你是 history模式 需要配置 vue.config.js publicPath
    // base: '/app/',
    scrollBehavior: () => ({ y: 0 }),
    routes: router
  });

export default createRouter();
```

更多:[Vue Router](https://router.vuejs.org/zh/)

#### 接口管理

在`config/adapter.conf.js` 文件中统一管理接口

#### 如何调用

```javascript
// 请求接口
import { rpc } from "@api";

const params = { user: "1001" };
rpc("接口编号", params)
  .then(() => {})
  .catch(() => {});
```

[▲ 回顶部](#top)

### <span id="base">✅ Webpack 5 vue.config.js 基础配置 </span>

#### router 配置

如果你的 `Vue Router` 模式是 hash

```javascript
publicPath: './',
```

如果你的 `Vue Router` 模式是 history 这里的 publicPath 和你的 `Vue Router` `base` **保持一致**

```javascript
publicPath: '/app/',
```

#### webpack5 配置

- 在`devServer`中配置开发模式参数
- 在`configureWebpack`中配置编译、插件等 webpack 配置

[▲ 回顶部](#top)

### <span id="proxy">✅ 配置 proxy 跨域 </span>

如果你的项目需要跨域设置，你需要打来 `vue.config.js` `proxy` 注释 并且配置相应参数

```javascript
module.exports = {
  devServer: {
    // ....
    proxy: {
      //配置跨域
      "/api": {
        target: "https://test.xxx.com", // 接口的域名
        // ws: true, // 是否启用websockets
        changOrigin: true, // 开启代理，在本地创建一个虚拟服务端
        pathRewrite: {
          "^/api": "/"
        }
      }
    }
  }
};
```

[▲ 回顶部](#top)

### CDN 配置

在 public/index.html 中添加

```javascript
    <!-- 使用CDN的CSS文件 -->
    <% for (var i in
      htmlWebpackPlugin.options.cdn&&htmlWebpackPlugin.options.cdn.css) { %>
      <link href="<%= htmlWebpackPlugin.options.cdn.css[i] %>" rel="preload" as="style" />
      <link href="<%= htmlWebpackPlugin.options.cdn.css[i] %>" rel="stylesheet" />
    <% } %>
     <!-- 使用CDN加速的JS文件，配置在vue.config.js下 -->
    <% for (var i in
      htmlWebpackPlugin.options.cdn&&htmlWebpackPlugin.options.cdn.js) { %>
      <script src="<%= htmlWebpackPlugin.options.cdn.js[i] %>"></script>
    <% } %>
```

[▲ 回顶部](#top)
