import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const source = resolve(root, "src", "static");
const output = resolve(root, "docs");

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await cp(source, output, { recursive: true });

const indexPath = resolve(output, "index.html");
const index = await readFile(indexPath, "utf8");

await writeFile(resolve(output, "404.html"), index, "utf8");
await writeFile(resolve(output, ".nojekyll"), "", "utf8");

console.log("Generated GitHub Pages files in /docs");
