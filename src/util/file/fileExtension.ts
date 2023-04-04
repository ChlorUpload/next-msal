import { last } from "../array/last";

export const musicxmlExtensions = ["musicxml", "xml"];
export const pdfExtensions = ["pdf"];
export const musescoreExtensions = ["mscz"];

export function getFileExtension(fileName: string) {
  return last(fileName.split(".")) ?? "";
}
