#!/usr/bin/env node
const path = require('path');
const { existsSync } = require('fs');
const { QuickBuild } = require('../dist/cjs');
const configFilePath = path.resolve(process.cwd(), '.quicklyrc.js');

if (existsSync(configFilePath)) {
  const config = require(configFilePath);
  const job = new QuickBuild(config);
  job.start();
} else {
  console.log('.quicklyrc.js not found.');
}