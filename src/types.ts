import { QuickPickItem } from "vscode";
export interface MyQuickPickItem extends QuickPickItem {
  fullPath: string;
  isFolder: boolean;
}
export interface FileNode {
  name: string;
  path: string;
  children?: FileNode[];
}
