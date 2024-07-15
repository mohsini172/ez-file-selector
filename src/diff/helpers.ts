import * as cp from "child_process";
import * as vscode from "vscode";

export async function getChangedFiles(branch?: string): Promise<string[]> {
  const workspaceFolder =
    vscode.workspace?.workspaceFolders?.[0]?.uri?.fsPath || "";
  if (!workspaceFolder) {
    vscode.window.showErrorMessage("No workspace folder found.");
    Promise.reject("No workspace folder found.");
  }

  return new Promise((resolve, reject) => {
    cp.exec(
      branch
        ? `git diff --name-only $(git merge-base HEAD ${branch}) HEAD`
        : "git diff --name-only",
      { cwd: workspaceFolder },
      (err, stdout, stderr) => {
        if (err) {
          reject(stderr);
          return;
        }

        if (!stdout) {
          return resolve([]);
        }

        const files = stdout
          .split("\n")
          .filter((file) => file.length > 0)
          .map((file) => `${workspaceFolder}/${file.trim()}`);

        resolve(files);
      }
    );
  });
}
