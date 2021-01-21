const core = require('../src/main.js');

const assert = require('assert');
const {describe, before, after, it} = require('mocha');
const nock = require('nock');


describe('mono-repo publish', () => {
   it('should parse owner, user, and number from the URL', () => {
        const parsed = core.parseURL('https://github.com/googleapis/release-please/pull/707');
        assert.deepStrictEqual(parsed, {owner: 'googleapis', repo: 'release-please', number: 707});
   })
})