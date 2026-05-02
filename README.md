# EVERWILD 极野 · 静态站点

多页静态站点（首页、富士招募、法务与条款、旅行规则与同意书等）。页面由 **模板 + 正文片段** 生成，样式由 **分文件 CSS 源码** 合并为 `site.css`，便于缓存与部署。

## 目录结构（仓库根）

```
everwild/
├── content/mains/          # 各页 <main> 正文源码（改这里后 npm run build:html）
├── templates/              # HTML 外壳与 header/footer 片段
├── scripts/                # build-css / build-html / extract-mains / check-links
├── assets/
│   ├── css/
│   │   ├── shared/site-core.css    # 全局样式源码
│   │   ├── pages/*.css             # 按页拆分样式源码
│   │   └── site.css                # npm run build:css 生成（勿手改）
│   ├── js/content/         # 文案（nav-copy、home-copy、fuji-copy）
│   ├── js/shared/          # site-i18n、site-nav
│   ├── js/pages/           # 各页入口脚本
│   ├── images/、fonts/     # 静态资源
├── docs/                   # 说明文档（ASSETS、子页说明）
├── index.html              # 及各子目录 index.html（均由构建生成）
├── package.json
└── README.md
```

## 导航文案（单一数据源）

导航相关 key 仅在 **`assets/js/content/nav-copy.js`**（`EVERWILD_NAV_COPY` + `mergeNavIntoCopy`）。其他页面的文案对象会在运行时合并导航字段。

## 常用命令

```bash
npm install
npm run build
```

| 命令 | 作用 |
|------|------|
| `npm run build:css` | 合并 CSS → `assets/css/site.css` |
| `npm run build:html` | 合并模板 + `content/mains/*.html` → 根目录及各子目录 `index.html` |
| `npm run extract:mains` | 从当前已生成的 HTML 抽取 `<main>` 写回 `content/mains/`（会覆盖） |
| `npm run check:links` | 检查站点 HTML 内相对资源是否存在 |

## 本地预览

```bash
npx --yes serve .
```

或 `python -m http.server 8080`。

## 修改流程

1. **样式**：改 `assets/css/shared/` 或 `pages/*.css` → `npm run build:css`。
2. **顶栏 / 页脚 / head**：改 `templates/` 或 `scripts/build-html.mjs` → `npm run build:html`。
3. **正文**：改 `content/mains/` 下对应文件 → `npm run build:html`。
4. **导航翻译**：只改 `assets/js/content/nav-copy.js`。

更多见 **[docs/README.md](docs/README.md)** 与 **[docs/ASSETS.md](docs/ASSETS.md)**。
