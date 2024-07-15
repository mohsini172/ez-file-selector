import { getOpenedFiles } from "./helpers";
import { showQuickPicker } from "../utils";

export function openedFileRegistry() {
  const openedFiles = getOpenedFiles();
  showQuickPicker(openedFiles);
}
