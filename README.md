# Twitter Bookmark Cleaner

 A CLI tool that logs into Twitter, navigates to your Bookmarks page, and removes all bookmarked tweets using headless browser automation.

Features

-  Command-line interface (CLI)
-  Twitter login via browser (manual, cookie-based session)
-  Automatic scrolling + bookmark removal
-  Persistent login with saved cookies
-  Progress output in terminal


Tech Stack
Node.js

Puppeteer — for browser automation

Inquirer — for CLI prompts

Chalk — for styled terminal output

fs-extra — for easier file handling

Installation
 - Clone the repository

git clone (https://github.com/iabdi328/Twitter-Bookmark-Remover.git) or git@github.com:iabdi328/Twitter-Bookmark-Remover.git
cd twitter-bookmark-cleaner
npm install

Usage
Run the CLI tool: node index.js
On first run, you'll be prompted to log in manually in a visible browser window.
After login, cookies will be saved so future runs don’t require logging in again.
The tool will then scroll through and remove all visible bookmarks.

