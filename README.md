# Mono-repo-publish

## TO-DO:
1. Figure out  the repository which is calling the script in order to get the owner and repo 
2. Find the last release PR of the repo that called our tool, and figure out which submodules were updated.
3. Assemble a list of submodules that need to be updated
4. Add a new npm token that has permission to publish to submodules and overwrite token that publishes mono-repo 
5. From the command line, run `npm run publish` sequentially on each submodule