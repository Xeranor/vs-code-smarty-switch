import * as vscode from "vscode";

const pattern = /define\s*\(\s*'TEMPLATE'\s*,\s*'(.*?)(?=')/;

function find_template(editor: vscode.TextEditor) {
  const match = pattern.exec(editor.document.getText());
  if (match) {
    return match[1];
  }
  return null;
}

export function activate(context: vscode.ExtensionContext) {
  const config = vscode.workspace.getConfiguration("smarty-switch");
  const disposable = vscode.commands.registerCommand(
    "smarty-switch.findTplFile",
    () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showErrorMessage("No active editor found!");
        return;
      }
      const ext = editor.document.fileName.split(".").pop();
      if (ext?.toLowerCase() === "php") {
        const template = find_template(editor);
        if (!template) {
          vscode.window.showErrorMessage("No template found!");
          return;
        }
        const templateFolder: string | undefined = config.get("templateFolder");
        if (!templateFolder) {
          vscode.window.showErrorMessage("No template folder configured!");
          return;
        }
        const workspace = vscode.workspace.workspaceFolders?.[0].uri;
        if (!workspace) {
          vscode.window.showErrorMessage("No workspace found!");
          return;
        }
        const tplPath = vscode.Uri.joinPath(
          workspace,
          templateFolder,
          template
        );
        vscode.window.showTextDocument(tplPath);
      } else if (ext?.toLowerCase() === "tpl") {
        vscode.window.showErrorMessage("Not implemented yet!");
        return;
      }
    }
  );

  context.subscriptions.push(disposable);
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export function deactivate() {}
