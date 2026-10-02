# CS2 Data Tools

基于 CSQAQ 数据的 CS2 武器箱与刀皮抓取、回测和诊断脚本集合。

## 目录

- `scripts/`：数据抓取、清洗、历史回测和报告生成脚本。
- `.env.example`：CSQAQ 环境变量模板，不包含密钥。

本公开目录只包含代码和配置模板，不包含原始市场数据、历史价格 CSV 或回测结果。

## 环境

- Python 3.10+，主要使用 `pandas`、`numpy`。
- Node.js 18+，用于 CSQAQ 抓取脚本。
- CSQAQ Token 只放在本地 `.env`：

```dotenv
CSQAQ_API_TOKEN=
```

不要提交 `.env`、Token、抓取缓存、依赖目录或生成结果。

## 数据目录约定

脚本默认使用项目根目录下的：

- `data/raw/`：本地历史 CSV。
- `data/source/`：API 响应缓存。
- `results/`：分析结果与报告。

这些目录未上传到本公开仓库，运行前需要自行准备合法数据。

## 仪表盘模板

`scripts/build_knife_market_dashboard.py` 默认读取项目根目录的 `knife-market-dashboard.html`，也可以通过环境变量 `KNIFE_DASHBOARD_TEMPLATE` 指定模板路径。

## 数据源

数据抓取逻辑面向 CSQAQ。使用者应自行获取 Token，并遵守数据源的授权、频率限制和使用条款。
