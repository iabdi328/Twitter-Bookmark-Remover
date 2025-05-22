#!/usr/bin/env node

import puppeteer from "puppeteer";
import fs from "fs-extra";
import path from "path";
import chalk from "chalk";
import inquirer from "inquirer";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const COOKIE_PATH = path.join(__dirname, "cookies.json");

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function loadCookies(page) {
  if (await fs.pathExists(COOKIE_PATH)) {
    const cookies = await fs.readJSON(COOKIE_PATH);
    await page.setCookie(...cookies);
    return true;
  }
  return false;
}

async function saveCookies(page) {
  const cookies = await page.cookies();
  await fs.writeJSON(COOKIE_PATH, cookies, { spaces: 2 });
}

async function login(page) {
  console.log(chalk.yellow("Please log in to Twitter manually..."));
  await page.goto("https://twitter.com/login", { waitUntil: "networkidle2" });
  await inquirer.prompt([
    {
      type: "input",
      name: "continue",
      message: "Press Enter after login is complete...",
    },
  ]);
  await saveCookies(page);
  console.log(chalk.green("✅ Cookies saved."));
}

async function removeBookmarks(page) {
  await page.goto("https://twitter.com/i/bookmarks", {
    waitUntil: "networkidle2",
  });

  let totalRemoved = 0;
  let prevHeight = 0;

  while (true) {
    const removeButtons = await page.$$('[data-testid="removeBookmark"]');
    console.log(
      chalk.blue(`🔍 Found ${removeButtons.length} bookmark(s) to remove...`)
    );

    for (const btn of removeButtons) {
      try {
        await btn.click();
        await delay(300); 
        totalRemoved++;
        process.stdout.write(chalk.green("."));
      } catch (err) {
        console.log(chalk.red("\n⚠️  Could not remove one bookmark."));
      }
    }

    const newHeight = await page.evaluate(() => {
      window.scrollBy(0, window.innerHeight);
      return document.body.scrollHeight;
    });

    if (newHeight === prevHeight) break;
    prevHeight = newHeight;
    await delay(1500); 
  }

  console.log(`\n✅ Removed ${totalRemoved} bookmark(s).`);
}

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  const hasCookies = await loadCookies(page);
  if (!hasCookies) await login(page);

  await removeBookmarks(page);

  await browser.close();
})();
