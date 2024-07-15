import * as vscode from "vscode";
import { openedFileRegistry } from "./opened";
import { diffLocalRegistry, diffBranchRegistry } from "./diff";

export function activate(context: vscode.ExtensionContext) {
  const subscriptions = [
    vscode.commands.registerCommand(
      "extension.showOpenedFiles",
      openedFileRegistry
    ),
    vscode.commands.registerCommand(
      "extension.showChangedFiles",
      diffLocalRegistry
    ),
    vscode.commands.registerCommand(
      "extension.showChangedFilesWithBranch",
      diffBranchRegistry
    ),
  ];
  context.subscriptions.push(...subscriptions);
}

export function deactivate() {}
