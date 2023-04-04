export async function copyClipboard(text: string) {
  await window.navigator.clipboard.writeText(text);
}
