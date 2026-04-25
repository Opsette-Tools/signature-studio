import { message } from "antd";
import { useCallback } from "react";

async function copyHtmlAndText(html: string, text: string): Promise<void> {
  // Modern path: Clipboard API with multiple types
  if (typeof ClipboardItem !== "undefined" && navigator.clipboard?.write) {
    const item = new ClipboardItem({
      "text/html": new Blob([html], { type: "text/html" }),
      "text/plain": new Blob([text], { type: "text/plain" }),
    });
    await navigator.clipboard.write([item]);
    return;
  }
  // execCommand fallback — copies rendered HTML as rich text
  const container = document.createElement("div");
  container.contentEditable = "true";
  container.style.position = "fixed";
  container.style.left = "-9999px";
  container.style.top = "0";
  container.innerHTML = html;
  document.body.appendChild(container);
  const range = document.createRange();
  range.selectNodeContents(container);
  const sel = window.getSelection();
  sel?.removeAllRanges();
  sel?.addRange(range);
  document.execCommand("copy");
  sel?.removeAllRanges();
  document.body.removeChild(container);
}

async function copyText(text: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.style.position = "fixed";
  ta.style.left = "-9999px";
  document.body.appendChild(ta);
  ta.select();
  document.execCommand("copy");
  document.body.removeChild(ta);
}

export function useCopySignature() {
  const copyRich = useCallback(async (html: string, text: string) => {
    try {
      await copyHtmlAndText(html, text);
      message.success("Rich signature copied — paste into your email client");
    } catch {
      message.error("Could not copy. Try the HTML option instead.");
    }
  }, []);

  const copyHtml = useCallback(async (html: string) => {
    try {
      await copyText(html);
      message.success("HTML code copied");
    } catch {
      message.error("Could not copy HTML");
    }
  }, []);

  const copyPlain = useCallback(async (text: string) => {
    try {
      await copyText(text);
      message.success("Plain text copied");
    } catch {
      message.error("Could not copy plain text");
    }
  }, []);

  return { copyRich, copyHtml, copyPlain };
}
