export function openUrlInNewTab(url: string) {
  const popup = window.open(url, "_blank");
  if (!popup) return null;
  else {
    popup.focus();
    return popup;
  }
}
