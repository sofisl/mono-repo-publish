const { Octokit } = require('@octokit/rest');
const { createAppAuth } = require('@octokit/auth-app');
const { readFileSync } = require('fs');

// TODO: this is a URL; split into owner, repo, and PR
// const prNumber = process.env.AUTORELEASE_PR;
// https://github.com/googleapis/releasetool/blob/master/releasetool/commands/publish_reporter.sh
function parseURL (prURL) {
  // looking for URLs that match this pattern: https://github.com/googleapis/release-please/pull/707
  const match = prURL.match(/^https:\/\/github\.com\/(?<owner>.+)\/(?<repo>.+)\/pull\/(?<number>\d+)$/);
  if (match) {
    return {
      owner: match.groups.owner,
      repo: match.groups.repo,
      number: Number(match.groups.number)
    };
  }
}

function getOctokitInstance () {
  const appId = readFileSync(process.env.APP_ID_PATH, 'utf8');
  const privateKey = readFileSync(process.env.GITHUB_PRIVATE_KEY_PATH, 'utf8');
  const installationId = readFileSync(process.env.INSTALLATION_ID_PATH, 'utf8');

  return new Octokit({
    authStrategy: createAppAuth,
    auth: {
      appId,
      privateKey,
      installationId
    }
  });
}

// pull in files in PR
async function getsPRFiles (prObject, octokit) {
  const files = (await octokit.pulls.listFiles({
    owner: prObject.owner,
    repo: prObject.repo,
    pull_number: prObject.number
  })).data;
  return files.map(e => e.filename);
}

// list out the submodules that were changed
//TODO: actually return the list of submodules, not just the files
async function listChangedSubmodules (prFiles) {
  // Only checking for package.jsons in submodules that were changed
  // Not checking the top-level package.json
  return prFiles.filter(file => file.match(/\/package\.json$/));
}

module.exports = { parseURL, getOctokitInstance, getsPRFiles, listChangedSubmodules };
