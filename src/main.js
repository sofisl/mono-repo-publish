//TODO: this is a URL; split into owner, repo, and PR
//const prNumber = process.env.AUTORELEASE_PR;
function parseURL (prURL) {
    // looking for URLs that match this pattern: https://github.com/googleapis/release-please/pull/707
    const match = prURL.match(/^https:\/\/github\.com\/(?<owner>.+)\/(?<repo>.+)\/pull\/(?<number>\d+)$/);
    if (match) {
        return {owner: match.groups.owner,
                repo: match.groups.repo, 
                number: Number(match.groups.number)};
    }
}

// pull in files in PR 
async function getsPRFiles (prObject) {

}

// list out the submodules that were changed
async function listChangedSubmodules (prFiles) {

}

module.exports = {parseURL}


