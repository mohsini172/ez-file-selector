import * as vscode from "vscode";

export function getOpenedFiles(): string[] {
  const editorGroups = vscode.window.tabGroups.all;

  return editorGroups.flatMap((group) =>
    group.tabs
      .filter((tab) => tab.input instanceof vscode.TabInputText)
      .map((tab) => (tab.input as vscode.TabInputText).uri.fsPath)
  );
}
