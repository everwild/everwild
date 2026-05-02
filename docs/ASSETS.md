# 静态资源清单（EVERWILD）

本仓库 HTML/CSS 中引用的 **`assets/` 下文件** 应在部署前全部存在。下方为常见引用路径（不含外链与 `mailto:`）。

## 图片与图标（常见）

| 路径 | 用途 |
|------|------|
| `assets/images/logo/favicon-e.svg` | 站点 favicon |
| `assets/images/logo/everwild-logo-horizontal-black.svg` | 顶栏 Logo |
| `assets/images/logo/everwild-logo-vertical-black.png` | Apple Touch Icon |
| `assets/images/logo/everwild-logo-horizontal-black.png` | 首页品牌卡等 |
| `assets/images/logo/everwild-gear-horizontal-black.png` | G.E.A.R. 标识 |
| `assets/images/logo/logo-bird-mark-centered.png` | 鸟形标记 |
| `assets/images/hero/yarigatake-skyline.svg` | 首页 hero 装饰 |

## 富士子站图片（`assets/images/fuji-climbing/`）

页面引用：`fuji-hero.jpg`、`fuji-sunrise.jpg`、`fuji-climber.jpg`、`fuji-summit.jpg`、`fuji-back.jpg` 等。请将实拍或设计导出文件放入该目录，否则富士页图片会 404。

## 字体

| 路径 | 用途 |
|------|------|
| `assets/fonts/Marcellus-Regular.ttf` | `site-core.css` / 合并后的 `site.css` 中 `@font-face` |

若字体尚未入库，浏览器会回退到 Georgia / 宋体等栈内字体。

## 校验命令

在项目根目录执行：

```bash
npm run check:links
```

将对所有 `.html` 中的相对 `href` / `src` 做存在性检查（不含网络 URL）。
