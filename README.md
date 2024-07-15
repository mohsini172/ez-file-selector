# ez-file-selector

The ez-file-selector is an exention which helps you select the files from

- Currently opened files in editor
- The file changes that have not been committed
- The file changes from the main/master branch(You can configure the main branch name)

## Why

When working on a very large project, we often want to focus on files we're working on. For example the files I have currently opened, I want to select one for those. Although the same can be done with mouse and UI but this is more keyboard oriented file selection.

## Requirements

In order to see file changes with respect to git, you need to open workspace with git repo.

## Extension Settings

You can add configuration `branchToCompare` to configure branch to compare when running git diff.

For example:

## Running the commands

This extension offers three commands

`showOpenedFiles`: Shows selector for opened files.

`showChangedFiles`: Shows changed files that are not committed yet.

`showChangedFilesWithBranch`: Shows changed files from configured branch.

## Known Issues

Need more testing.
