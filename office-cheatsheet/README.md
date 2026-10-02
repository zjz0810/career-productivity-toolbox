# 办公技巧速查

一个无需登录、无需后端的微信原生小程序，用于快速查询 Word、Excel 的常用操作。

## 在微信开发者工具运行

1. 打开微信开发者工具，选择「导入项目」。
2. 项目目录选择当前仓库根目录 `E:\DeepSeekProjects\EWPS`。
3. `project.config.json` 已将 `miniprogram` 配置为小程序根目录；首次运行可使用测试号或替换为自己的 AppID。
4. 编译后从首页搜索「删除空格」「两栏」「冻结首行」等词，检查详情、收藏和返回路径。

## 网页试玩版

网页试玩版位于 `web/`，会直接读取小程序的两份 JSON 数据。推荐在项目根目录启动一个本地静态 HTTP 服务：

```text
node web/serve.js
```

然后打开 <http://localhost:8080/web/>。不要直接双击 `web/index.html`，浏览器会阻止它读取 JSON 数据。

## 目录结构

```text
miniprogram/
  config/app.js             应用配置模块
  config/app.json           网页版与小程序共用的应用配置
  data/word.json            Word 技巧数据
  data/excel.json           Excel 技巧数据
  utils/data.js             数据加载、分类和本地搜索
  utils/storage.js          收藏与最近查看的本地 storage
  components/search-bar/    公用搜索框
  pages/index/              首页
  pages/category/           分类与二级分类
  pages/detail/             统一技巧详情页
  pages/favorites/          收藏页
web/
  index.html                网页试玩入口
  app.js / styles.css       网页版交互与视觉
```

## 新增一条技巧

在 `miniprogram/data/word.json` 或 `miniprogram/data/excel.json` 增加一条对象即可。保持以下字段：

`id`、`title`、`category`、`subcategory`、`keywords`、`aliases`、`summary`、`steps`、`path`、`tips`、`images`、`relatedIds`、`platform`、`version`。

图片建议使用如下结构，列表页不会读取图片，详情页才会懒加载：

```json
"images": [
  {
    "thumb": "/assets/images/word-columns-2-thumb.jpg",
    "full": "/assets/images/word-columns-2.jpg",
    "caption": "在布局选项卡中选择两栏"
  }
]
```

以后迁移 CDN 时，只需要把 `thumb` / `full` 改成合法的 HTTPS 图片地址，并在微信公众平台配置业务域名即可。图片加载失败时，详情页会保留文字教程。

## 当前范围

已实现首页、Word/Excel 分类、实时本地搜索、统一详情页、收藏、最近查看、本地图片懒加载与预览接口。当前数据中的 `images` 暂为空数组，演示图位置已在详情页预留，后续补图只需修改 JSON 和加入图片资源。

