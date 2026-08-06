import { access, readFile } from "node:fs/promises";
import { constants } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const requiredFiles = [
  "docs/index.html",
  "docs/404.html",
  "docs/.nojekyll",
  "docs/styles.css",
  "docs/app.js"
];

for (const file of requiredFiles) {
  await access(resolve(root, file), constants.R_OK);
}

const index = await readFile(resolve(root, "docs/index.html"), "utf8");
const requiredText = [
  "Programming Practice Lab",
  "./styles.css",
  "./app.js"
];

for (const text of requiredText) {
  if (!index.includes(text)) {
    throw new Error(`docs/index.html is missing required content: ${text}`);
  }
}

console.log("GitHub Pages output is valid");
