#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const site = require("../src/_data/site.js");
const discovery = require("../src/_data/discovery.js");

const args = process.argv.slice(2);

function argValue(name, fallback) {
  const index = args.indexOf(name);
  return index >= 0 && args[index + 1] ? args[index + 1] : fallback;
}

const dryRun = args.includes("--dry-run");
const source = argValue("--source", process.env.INDEXNOW_SOURCE || "live");
const endpoint = process.env.INDEXNOW_ENDPOINT || "https://api.indexnow.org/indexnow";
const key = process.env.INDEXNOW_KEY || discovery.indexNowKey;
const host = process.env.INDEXNOW_HOST || site.domain || new URL(site.url).host;
const keyLocation = new URL(`/${key}.txt`, site.url).toString();

async function loadSitemapXml() {
  if (source === "local") {
    return readFile("_site/sitemap.xml", "utf8");
  }

  if (source !== "live") {
    throw new Error(`Unsupported sitemap source "${source}". Use "live" or "local".`);
  }

  const response = await fetch(new URL("/sitemap.xml", site.url));
  if (!response.ok) {
    throw new Error(`Unable to fetch live sitemap: HTTP ${response.status}`);
  }

  return response.text();
}

function extractUrls(xml) {
  return [...xml.matchAll(/<loc>\s*([^<]+)\s*<\/loc>/g)]
    .map((match) => match[1].trim())
    .filter((url) => {
      try {
        return new URL(url).host === host;
      } catch {
        return false;
      }
    });
}

const sitemapXml = await loadSitemapXml();
const urlList = extractUrls(sitemapXml);

if (urlList.length === 0) {
  throw new Error(`No URLs for ${host} found in sitemap.`);
}

const payload = {
  host,
  key,
  keyLocation,
  urlList
};

if (dryRun) {
  console.log(JSON.stringify(payload, null, 2));
  process.exit(0);
}

const response = await fetch(endpoint, {
  method: "POST",
  headers: {
    "Content-Type": "application/json; charset=utf-8"
  },
  body: JSON.stringify(payload)
});

const responseText = await response.text();
console.log(`IndexNow submission: HTTP ${response.status}`);

if (responseText) {
  console.log(responseText);
}

if (!response.ok) {
  throw new Error("IndexNow submission failed.");
}
