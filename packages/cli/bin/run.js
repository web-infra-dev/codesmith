#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const pkgInfo = require(path.join(__dirname, '../package.json'));
const srcPath = pkgInfo['jsnext:source'];
const distPath = pkgInfo.main;
const project = path.join(__dirname, '../tsconfig.json');
let env = 'production';
if (fs.existsSync(project)) {
  env = 'development';
}
if (process.env.NODE_ENV) {
  env = process.env.NODE_ENV;
}

if (env === 'development') {
  require('ts-node').register({
    project,
    transpileOnly: true,
    typeCheck: false,
  });
}

try {
  require(`../${env === 'development' ? srcPath : distPath}`).default();
} catch (e) {
  console.error(e);
}
