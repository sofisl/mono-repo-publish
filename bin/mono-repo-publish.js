#!/usr/bin/env node

const yargs = require('yargs');
const core = require('../src/main.js');
//Get testing repo that touches submodules that we would want to publish
//Once we have the list, actually calling npm publish on those modules
yargs.usage('$0', 'publish packages affected by a pull request', () => {}, async (argv) => {
  console.log(argv);
  const pr = core.parseURL(argv.prUrl);
  const octokit = core.getOctokitInstance();
  const files = await core.getsPRFiles(pr, octokit);
  console.log(files);
}).option('pr-url', { description: 'the URL of the GH PR for submodules you wish to publish, e.g., https://github.com/googleapis/release-please/pull/707', type: 'string', demand: true }).parse();


