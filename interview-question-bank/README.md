# FOC学习题库

一个不依赖服务器、登录或数据库的原生微信小程序，用于个人学习和面试复习，覆盖 PMSM、BLDC、FOC、PI、SVPWM、LADRC 与 MATLAB Simulink 等内容。

## 运行

1. 使用微信开发者工具导入当前目录 `项目目录`。
2. 项目类型选择「小程序」，AppID 可使用 `touristappid` 进行本地预览，也可以在 `project.config.json` 中替换成自己的 AppID。
3. 编译即可打开首页。

## 目录说明

- `data/questions.js`：本地题库。每道题包含 `id`、`category`、`tags`、`question`、`shortAnswer`、`answer`、`difficulty`，后续直接追加对象即可扩展到几百道题。
- `data/categories.js`：一级大类和二级专题名称、说明。新增题目时，`question.category` 填二级专题名称。
- `utils/storage.js`：收藏、已掌握、待复习、个人备注和随机题目队列的本地缓存封装。
- `pages/index`：首页、统计、一级大类入口、快捷入口。
- `pages/category`：一级大类下的二级专题、题目列表、收藏/待复习/易错题列表。
- `pages/detail`：问题、答案、状态、备注与上一题/下一题/随机一题。
- `pages/search`：全文搜索题目、答案、短答案、标签和分类。
- `pages/random`：随机 10 题，支持“会了 / 模糊 / 不会”。

所有数据和学习状态都保存在微信本地缓存中，不会联网。

## 浏览器版（手机局域网访问）

项目同时包含一个纯前端浏览器版，入口是 `web/index.html`。它与小程序共用 `data/questions.js` 和 `data/categories.js`，收藏、掌握状态、待复习和备注使用浏览器 `localStorage` 保存。`serve-lan.js` 是配套的局域网静态文件服务器。

在 Windows 上双击 `start-lan.bat`，或在 PowerShell 中运行：

```powershell
.\start-lan.ps1
```

脚本会显示电脑和手机访问地址。手机连接同一个 Wi-Fi 后，用浏览器打开显示的手机地址即可。默认端口是 `8080`，也可以运行 `.\start-lan.ps1 -Port 9000`。
