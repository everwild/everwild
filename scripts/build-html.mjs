import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

function render(template, vars) {
  let out = template;
  for (const [key, value] of Object.entries(vars)) {
    out = out.split(`{{${key}}}`).join(value ?? "");
  }

  const leftover = out.match(/\{\{(\w+)\}\}/g);
  if (leftover) {
    throw new Error(`Unset placeholders: ${leftover.join(", ")}`);
  }

  return out;
}

const shell = fs.readFileSync(path.join(root, "templates/document-shell.html"), "utf8");
const headerRoot = fs.readFileSync(path.join(root, "templates/partials/site-header.html"), "utf8");
const headerFuji = fs.readFileSync(path.join(root, "templates/partials/site-header-fuji.html"), "utf8");
const footerTpl = fs.readFileSync(path.join(root, "templates/partials/site-footer.html"), "utf8");

const pages = [
  {
    out: "index.html",
    metaDesc:
      "EVERWILD 极野品牌矩阵主网页，整合户外活动、训练体系、跑团社群与内容媒体。",
    pageTitle: "EVERWILD 极野",
    P: "./",
    BODY_ATTRS: "",
    BRAND_HREF: "#top",
    HP: "",
    FUJI_HREF: "./fuji-climbing/",
    JOIN_HREF: "#join",
    headerTpl: headerRoot,
    footerLegal: "./legal/index.html",
    footerPrivacy: "./privacy/index.html",
    footerTerms: "./terms/index.html",
    mainFile: "home.html",
    scripts: `  <script src="./assets/js/shared/site-nav.js"></script>
  <script src="./assets/js/shared/site-i18n.js"></script>
  <script src="./assets/js/content/nav-copy.js"></script>
  <script src="./assets/js/content/home-copy.js"></script>
  <script src="./assets/js/pages/home.js"></script>
  <script src="./assets/js/shared/formspree-everwild.js"></script>
  <script>
    initEverwildFormspree({ formElement: "#everwild-home-inquiry", formId: "xjglkzwd" });
  </script>
  <script src="https://unpkg.com/@formspree/ajax@1" defer></script>`
  },
  {
    out: "fuji-climbing/index.html",
    metaDesc:
      "2026 年 EVERWILD 极野富士山登山季招募，面向真正想走进富士山的朋友，说明开放季、双语向导、富士山讲解、适合人群、规则与报名方式。",
    pageTitle: "2026 年富士山登山招募 · EVERWILD 极野",
    P: "../",
    BODY_ATTRS: ' class="fuji-page"',
    BRAND_HREF: "../index.html",
    HP: "../",
    headerTpl: headerFuji,
    footerLegal: "../legal/index.html",
    footerPrivacy: "../privacy/index.html",
    footerTerms: "../terms/index.html",
    mainFile: "fuji-climbing.html",
    scripts: `  <script src="../assets/js/shared/site-i18n.js"></script>
  <script src="../assets/js/content/nav-copy.js"></script>
  <script src="../assets/js/content/fuji-copy.js"></script>
  <script src="../assets/js/shared/site-nav.js"></script>
  <script src="../assets/js/pages/fuji-climbing.js"></script>
  <script src="../assets/js/shared/formspree-everwild.js"></script>
  <script>
    initEverwildFormspree({ formElement: "#everwild-fuji-inquiry", formId: "mgodvqzy" });
  </script>
  <script src="https://unpkg.com/@formspree/ajax@1" defer></script>`
  },
  {
    out: "legal/index.html",
    metaDesc: "EVERWILD 法务信息页面，说明网站运营主体、内容使用规则与对外联络方式。",
    pageTitle: "EVERWILD · 法务信息",
    P: "../",
    BODY_ATTRS: ' class="legal-page"',
    BRAND_HREF: "../",
    HP: "../",
    FUJI_HREF: "../fuji-climbing/",
    JOIN_HREF: "../#join",
    headerTpl: headerRoot,
    footerLegal: "./index.html",
    footerPrivacy: "../privacy/index.html",
    footerTerms: "../terms/index.html",
    mainFile: "legal.html",
    scripts: `  <script src="../assets/js/shared/site-i18n.js"></script>
  <script src="../assets/js/content/nav-copy.js"></script>
  <script src="../assets/js/shared/site-nav.js"></script>
  <script src="../assets/js/pages/legal-shell.js"></script>
  <script src="../assets/js/pages/legal.js"></script>`
  },
  {
    out: "terms/index.html",
    metaDesc:
      "EVERWILD 网站使用条款：免责声明、活动变更规则、健康安全说明与外部链接说明。",
    pageTitle: "EVERWILD · 使用条款",
    P: "../",
    BODY_ATTRS: ' class="legal-page"',
    BRAND_HREF: "../",
    HP: "../",
    FUJI_HREF: "../fuji-climbing/",
    JOIN_HREF: "../#join",
    headerTpl: headerRoot,
    footerLegal: "../legal/index.html",
    footerPrivacy: "../privacy/index.html",
    footerTerms: "./index.html",
    mainFile: "terms.html",
    scripts: `  <script src="../assets/js/shared/site-i18n.js"></script>
  <script src="../assets/js/content/nav-copy.js"></script>
  <script src="../assets/js/shared/site-nav.js"></script>
  <script src="../assets/js/pages/legal-shell.js"></script>
  <script src="../assets/js/pages/terms.js"></script>`
  },
  {
    out: "privacy/index.html",
    metaDesc:
      "EVERWILD 隐私政策：说明信息收集范围、使用目的、保存期限及第三方平台提示。",
    pageTitle: "EVERWILD · 隐私政策",
    P: "../",
    BODY_ATTRS: ' class="legal-page"',
    BRAND_HREF: "../",
    HP: "../",
    FUJI_HREF: "../fuji-climbing/",
    JOIN_HREF: "../#join",
    headerTpl: headerRoot,
    footerLegal: "../legal/index.html",
    footerPrivacy: "./index.html",
    footerTerms: "../terms/index.html",
    mainFile: "privacy.html",
    scripts: `  <script src="../assets/js/shared/site-i18n.js"></script>
  <script src="../assets/js/content/nav-copy.js"></script>
  <script src="../assets/js/shared/site-nav.js"></script>
  <script src="../assets/js/pages/legal-shell.js"></script>
  <script src="../assets/js/pages/privacy.js"></script>`
  },
  {
    out: "travel-rules/index.html",
    metaDesc:
      "EVERWILD极野旅行规则 · Travel Terms and Conditions · 旅行約款 · EVERWILD极野",
    pageTitle: "EVERWILD极野旅行规则 · EVERWILD极野",
    P: "../",
    BODY_ATTRS: ' class="legal-page" data-shell="nav-only"',
    BRAND_HREF: "../index.html",
    HP: "../",
    FUJI_HREF: "../fuji-climbing/",
    JOIN_HREF: "../#join",
    headerTpl: headerRoot,
    footerLegal: "../legal/index.html",
    footerPrivacy: "../privacy/index.html",
    footerTerms: "../terms/index.html",
    mainFile: "travel-rules.html",
    scripts: `  <script src="../assets/js/shared/site-i18n.js"></script>
  <script src="../assets/js/content/nav-copy.js"></script>
  <script src="../assets/js/shared/site-nav.js"></script>
  <script src="../assets/js/pages/legal-shell.js"></script>`
  },
  {
    out: "fuji-consent/index.html",
    metaDesc:
      "富士山活动规则及同意书 · 富士山登山ツアー参加同意書 · EVERWILD极野",
    pageTitle: "富士山活动规则及同意书 · EVERWILD极野",
    P: "../",
    BODY_ATTRS: ' class="legal-page" data-shell="nav-only"',
    BRAND_HREF: "../index.html",
    HP: "../",
    FUJI_HREF: "../fuji-climbing/",
    JOIN_HREF: "../#join",
    headerTpl: headerRoot,
    footerLegal: "../legal/index.html",
    footerPrivacy: "../privacy/index.html",
    footerTerms: "../terms/index.html",
    mainFile: "fuji-consent.html",
    scripts: `  <script src="../assets/js/shared/site-i18n.js"></script>
  <script src="../assets/js/content/nav-copy.js"></script>
  <script src="../assets/js/shared/site-nav.js"></script>
  <script src="../assets/js/pages/legal-shell.js"></script>`
  }
];

for (const page of pages) {
  const mainPath = path.join(root, "content/mains", page.mainFile);
  const main = fs.readFileSync(mainPath, "utf8").trimEnd();

  const headerVars = {
    P: page.P,
    BRAND_HREF: page.BRAND_HREF,
    HP: page.HP,
    FUJI_HREF: page.FUJI_HREF,
    JOIN_HREF: page.JOIN_HREF
  };

  const header = page.headerTpl === headerFuji ? render(headerFuji, headerVars) : render(headerRoot, headerVars);

  const footer = render(footerTpl, {
    FOOTER_LEGAL: page.footerLegal,
    FOOTER_PRIVACY: page.footerPrivacy,
    FOOTER_TERMS: page.footerTerms
  });

  const html = render(shell, {
    META_DESC: page.metaDesc,
    PAGE_TITLE: page.pageTitle,
    P: page.P,
    BODY_ATTRS: page.BODY_ATTRS,
    HEADER: header,
    MAIN: main,
    FOOTER: footer,
    SCRIPTS: page.scripts
  });

  const outPath = path.join(root, page.out);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, `${html.trimEnd()}\n`);
  console.log("build-html ->", page.out);
}
