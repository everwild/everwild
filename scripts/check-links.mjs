import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const SKIP_DIRS = new Set(["templates", "content", "node_modules", "backup", ".git"]);

function walkHtmlFiles(dir, acc = []) {
  const rel = path.relative(root, dir);
  const top = rel.split(path.sep)[0];
  if (rel && SKIP_DIRS.has(top)) {
    return acc;
  }

  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const st = fs.statSync(full);
    if (st.isDirectory()) {
      walkHtmlFiles(full, acc);
    } else if (name.endsWith(".html")) {
      acc.push(full);
    }
  }

  return acc;
}

function stripQuery(href) {
  const q = href.indexOf("?");
  return q === -1 ? href : href.slice(0, q);
}

function collectRefs(htmlText) {
  const refs = [];
  const re = /\b(?:href|src)=["']([^"']+)["']/gi;
  let m;
  while ((m = re.exec(htmlText))) {
    refs.push(m[1]);
  }

  return refs;
}

function resolveLocalTarget(fromFile, raw) {
  if (/^(https?:|mailto:|tel:|data:|javascript:)/i.test(raw)) {
    return null;
  }

  if (raw.includes("{{")) {
    return null;
  }

  const noHash = stripQuery(raw.split("#")[0]);
  if (!noHash || noHash.startsWith("//")) {
    return null;
  }

  let resolved = path.normalize(path.join(path.dirname(fromFile), noHash));
  if (noHash.endsWith("/")) {
    resolved = path.join(resolved, "index.html");
  }

  if (!resolved.startsWith(root)) {
    return null;
  }

  return resolved;
}

const htmlFiles = walkHtmlFiles(root);

const missing = [];
let checked = 0;

for (const file of htmlFiles) {
  const text = fs.readFileSync(file, "utf8");

  for (const raw of collectRefs(text)) {
    const resolved = resolveLocalTarget(file, raw);
    if (!resolved) {
      continue;
    }

    checked++;
    if (!fs.existsSync(resolved)) {
      missing.push({ file: path.relative(root, file), ref: raw });
    }
  }
}

if (missing.length) {
  console.error("Missing local assets (" + missing.length + "):");
  for (const m of missing) {
    console.error(`  ${m.file} -> ${m.ref}`);
  }

  process.exit(1);
}

console.log("check-links ok (" + checked + " local href/src checked)");
