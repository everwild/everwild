import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const outDir = path.join(root, "content/mains");
fs.mkdirSync(outDir, { recursive: true });

const pages = [
  ["index.html", "home.html"],
  ["legal/index.html", "legal.html"],
  ["terms/index.html", "terms.html"],
  ["privacy/index.html", "privacy.html"],
  ["fuji-climbing/index.html", "fuji-climbing.html"],
  ["travel-rules/index.html", "travel-rules.html"],
  ["fuji-consent/index.html", "fuji-consent.html"]
];

for (const [rel, name] of pages) {
  const htmlPath = path.join(root, rel);
  const html = fs.readFileSync(htmlPath, "utf8");
  const m = html.match(/<main[\s\S]*?<\/main>/);
  if (!m) {
    throw new Error(`No <main> in ${rel}`);
  }

  fs.writeFileSync(path.join(outDir, name), `${m[0]}\n`);
  console.log("extracted", rel, "->", path.join("content/mains", name));
}
