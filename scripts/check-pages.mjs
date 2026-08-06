import { access, readFile } from "node:fs/promises";
import { constants } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const requiredFiles = [
  "docs/index.html",
  "docs/404.html",
  "docs/.nojekyll",
  "docs/foundation.css",
  "docs/foundation.js",
  "docs/project-preview.html",
  "docs/styles.css",
  "docs/app.js"
];

for (const file of requiredFiles) {
  await access(resolve(root, file), constants.R_OK);
}

const index = await readFile(resolve(root, "docs/index.html"), "utf8");
const requiredText = [
  "Programming Practice Lab",
  "./foundation.css",
  "./foundation.js",
  "Web開発基礎"
];

for (const text of requiredText) {
  if (!index.includes(text)) {
    throw new Error(`docs/index.html is missing required content: ${text}`);
  }
}

const projectPreview = await readFile(
  resolve(root, "docs/project-preview.html"),
  "utf8"
);

if (!projectPreview.includes("Programming Practice Lab")) {
  throw new Error("docs/project-preview.html is not a valid project UI preview");
}

console.log("GitHub Pages output is valid");
