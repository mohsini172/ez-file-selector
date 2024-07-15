import path from "path";
import { FileNode, MyQuickPickItem } from "./types";
import * as vscode from "vscode";

export function flattenFileTree(
  tree: FileNode[],
  depth: number = 0
): { display: string; fullPath: string; isFolder: boolean }[] {
  let result: { display: string; fullPath: string; isFolder: boolean }[] = [];

  tree.forEach((node) => {
    const indent = "  ".repeat(depth);
    const isFolder = !!node.children && node.children.length > 0;
    result.push({
      display: `${indent}${node.name}`,
      fullPath: node.path,
      isFolder: isFolder,
    });

    if (node.children && node.children.length > 0) {
      result = result.concat(flattenFileTree(node.children, depth + 1));
    }
  });

  return result;
}

export function buildFileTree(files: string[]): FileNode[] {
  const root: FileNode[] = [];

  files.forEach((file) => {
    const parts = file.split(path.sep);
    let currentLevel = root;

    parts.forEach((part, index) => {
      let existingNode = currentLevel.find((node) => node.name === part);

      if (!existingNode) {
        existingNode = {
          name: part,
          path: parts.slice(0, index + 1).join(path.sep),
        };
        currentLevel.push(existingNode);
      }

      if (index === parts.length - 1) {
        existingNode.path = file; // Ensure we store the full path at the leaf nodes
      }

      if (!existingNode.children) {
        existingNode.children = [];
      }

      currentLevel = existingNode.children;
    });
  });

  // Collapse folders with only one child
  collapseSingleChildFolders(root);

  return root;
}

export function collapseSingleChildFolders(nodes: FileNode[]) {
  nodes.forEach((node, index) => {
    while (node.children && node.children.length === 1) {
      const child = node.children[0];
      node.name = path.join(node.name, child.name);
      node.path = child.path;
      node.children = child.children;
    }

    if (node.children) {
      collapseSingleChildFolders(node.children);
    }
  });
}

export function showQuickPicker(files: string[]) {
  // Get workspace folder path
  const workspaceFolder =
    vscode.workspace.workspaceFolders?.[0]?.uri?.fsPath || "";

  // Compute relative paths
  const relativePaths = files.map((file) =>
    path.relative(workspaceFolder, file)
  );

  // Build a nested structure
  const fileTree = buildFileTree(relativePaths);

  // Flatten the nested structure for display
  const flattenedItems = flattenFileTree(fileTree);

  const quickPick = vscode.window.createQuickPick<MyQuickPickItem>();
  quickPick.items = flattenedItems.map((file) => ({
    label: file.display,
    fullPath: file.fullPath,
    isFolder: file.isFolder,
    iconPath: file.isFolder ? vscode.ThemeIcon.Folder : vscode.ThemeIcon.File,
  }));
  quickPick.placeholder = "Select a file";

  quickPick.title = "Opened Files";
  quickPick.matchOnDescription = true;
  quickPick.matchOnDetail = true;

  quickPick.ignoreFocusOut = true;
  quickPick.show();

  quickPick.onDidChangeSelection((selection: readonly { label: string }[]) => {
    const selectedItem = selection[0] as MyQuickPickItem;
    if (selectedItem) {
      if (selectedItem.isFolder) {
        vscode.window.showWarningMessage(
          "Selected item is a folder: Please select a file instead."
        );
        return;
      }
      const selectedFilePath = path.join(
        workspaceFolder,
        selectedItem.fullPath
      );
      if (selectedFilePath) {
        vscode.workspace.openTextDocument(selectedFilePath).then((doc) => {
          vscode.window.showTextDocument(doc);
        });
        quickPick.hide();
      }
    }
  });
}
