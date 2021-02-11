const core = require('../src/main.js');

const assert = require('assert');
const { describe, it, afterEach } = require('mocha');
const nock = require('nock');
const sinon = require('sinon');
const { Octokit } = require('@octokit/rest');

const sandbox = sinon.createSandbox();

const changedFiles = require('./fixtures/pull-request-payloads/many-files.json');
nock.disableNetConnect();

describe('mono-repo publish', () => {
  afterEach(() => {
    sandbox.restore();
  });

  it('should parse owner, user, and number from the URL', () => {
    const parsed = core.parseURL('https://github.com/googleapis/release-please/pull/707');
    assert.deepStrictEqual(parsed, { owner: 'googleapis', repo: 'release-please', number: 707 });
  });

  it('should get authenticated Octokit instance', () => {
    sinon.stub(process, 'env').value({
      APP_ID_PATH: './test/fixtures/app-id',
      INSTALLATION_ID_PATH: './test/fixtures/installation-id',
      GITHUB_PRIVATE_KEY_PATH: './test/fixtures/private-key'
    });

    const octokit = core.getOctokitInstance();

    assert.ok(octokit instanceof Octokit);
  });

  it('lists all files on a PR', async () => {
    const octokit = new Octokit();
    const fileRequest = nock('https://api.github.com').get('/repos/testOwner/testRepo/pulls/1/files').reply(200, changedFiles);
    const files = await core.getsPRFiles({ owner: 'testOwner', repo: 'testRepo', number: 1 }, octokit);
    fileRequest.done();
    assert.deepStrictEqual(files, changedFiles.map(l => l.filename));
  });

  it('identifies submodules that have been changed', async () => {
    const submodules = await core.listChangedSubmodules(changedFiles.map(l => l.filename));
    assert.deepStrictEqual(submodules, ['packages/firstPackage/package.json', 'packages/secondPackage/package.json']);
  });
});
