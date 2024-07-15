import { getChangedFiles } from "./helpers";
import { showQuickPicker } from "../utils";
import * as vscode from "vscode";

export async function diffLocalRegistry() {
  try {
    const changedFiles = await getChangedFiles();
    if (!changedFiles || changedFiles.length === 0) {
      vscode.window.showInformationMessage(
        "No local changes. Working tree clean."
      );
      return;
    }
    showQuickPicker(changedFiles);
  } catch (error) {
    const errorMessage = error instanceof Error || "Unknown error";
    vscode.window.showErrorMessage(
      "Failed to get changed files: " + errorMessage
    );
  }
}

export async function diffBranchRegistry() {
  try {
    const branchToCompare = vscode.workspace
      .getConfiguration()
      .get<string>("branchToCompare");

    const changedFiles = await getChangedFiles(branchToCompare);
    if (!changedFiles || changedFiles.length === 0) {
      vscode.window.showInformationMessage(
        `No changes found between the current branch and the ${branchToCompare} branch.`
      );
      return;
    }
    showQuickPicker(changedFiles);
  } catch (error) {
    const errorMessage = error instanceof Error || "Unknown error";
    vscode.window.showErrorMessage(
      "Failed to get changed files: " + errorMessage
    );
  }
}
