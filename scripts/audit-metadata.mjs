#!/usr/bin/env node

import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const args = process.argv.slice(2);
const siteDir = args.includes("--site")
  ? args[args.indexOf("--site") + 1]
  : "_site";
const strict = args.includes("--strict");

const limits = {
  titleMin: Number(process.env.META_TITLE_MIN || 20),
  titleMax: Number(process.env.META_TITLE_MAX || 65),
  descriptionMin: Number(process.env.META_DESCRIPTION_MIN || 70),
  descriptionMax: Number(process.env.META_DESCRIPTION_MAX || 160)
};

function htmlFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return htmlFiles(path);
    return entry.name.endsWith(".html") ? [path] : [];
  });
}

function textMatch(html, regex) {
  const match = html.match(regex);
  return match ? match[1].trim().replace(/\s+/g, " ") : "";
}

const rows = htmlFiles(siteDir).map((file) => {
  const html = readFileSync(file, "utf8");
  const title = textMatch(html, /<title>(.*?)<\/title>/is);
  const description = textMatch(
    html,
    /<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i
  );
  const issues = [];
  if (title.length < limits.titleMin) issues.push("title_short");
  if (title.length > limits.titleMax) issues.push("title_long");
  if (description.length < limits.descriptionMin) issues.push("description_short");
  if (description.length > limits.descriptionMax) issues.push("description_long");
  return { file, title, description, titleLength: title.length, descriptionLength: description.length, issues };
});

const issueRows = rows.filter((row) => row.issues.length > 0);

console.log(`Metadata audit: ${rows.length} HTML files`);
console.log(
  `Thresholds: title ${limits.titleMin}-${limits.titleMax}, description ${limits.descriptionMin}-${limits.descriptionMax}`
);

if (issueRows.length === 0) {
  console.log("No metadata length issues found.");
} else {
  for (const row of issueRows) {
    console.log("");
    console.log(`${row.file}`);
    console.log(`  issues: ${row.issues.join(", ")}`);
    console.log(`  title (${row.titleLength}): ${row.title}`);
    console.log(`  description (${row.descriptionLength}): ${row.description}`);
  }
}

if (strict && issueRows.length > 0) {
  process.exitCode = 1;
}
