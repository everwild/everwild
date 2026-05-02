# EVERWILD 极野 · 静态站点

多页静态站点（首页、富士招募、法务与条款、旅行规则与同意书等）。页面由 **模板 + 正文片段** 生成，样式由 **分文件源码** 合并为单文件 CSS，便于缓存与部署。

## 目录约定

| 路径 | 说明 |
|------|------|
| `templates/` | HTML 外壳（`document-shell.html`）与公共片段（`partials/`） |
| `src/mains/` | 各页 `<main>...</main>` 正文片段（构建输出会拼进根目录 HTML） |
| `assets/css/shared/`、`assets/css/pages/` | 样式源码 |
| `assets/css/site.css` | **`npm run build:css` 生成**，勿手改 |
| `assets/js/` | 脚本：`shared/`（导航、i18n）、`content/`（文案）、`pages/`（页逻辑） |

## 导航文案（单一数据源）

导航相关 key 仅在 **`assets/js/content/nav-copy.js`**（`EVERWILD_NAV_COPY` + `mergeNavIntoCopy`）。首页 / 富士 / 法务等页面的完整文案对象会在运行时合并导航字段，避免多处手写漂移。

## 常用命令

```bash
npm install
npm run build
```

- **`npm run build:css`**：合并 `shared/site-core.css` + `pages/*.css` → `assets/css/site.css`（并修正字体路径）。
- **`npm run build:html`**：根据 `templates/` + `src/mains/*.html` 生成根目录及各子目录 `index.html`。
- **`npm run extract:mains`**：从 **当前** 根目录 HTML 抽取 `<main>` 写回 `src/mains/`（调整正文后若需反向同步可运行；会覆盖对应 `src/mains` 文件）。
- **`npm run check:links`**：检查 HTML 内相对资源是否存在。

## 本地预览

在项目根目录：

```bash
npx --yes serve .
```

或使用 Python：

```bash
python -m http.server 8080
```

## 修改流程建议

1. **改样式**：编辑 `assets/css/shared/site-core.css` 或 `assets/css/pages/*.css`，再执行 `npm run build:css`。
2. **改顶栏/页脚/head**：编辑 `templates/` 下片段或 `scripts/build-html.mjs` 中的页面配置，再 `npm run build:html`。
3. **改正文**：编辑 `src/mains/` 下对应文件，再 `npm run build:html`。
4. **改导航翻译**：只改 `nav-copy.js`，必要时 `npm run build:html`（HTML 无需变也可跳过）。

更多资源说明见 [`docs/ASSETS.md`](docs/ASSETS.md)。
