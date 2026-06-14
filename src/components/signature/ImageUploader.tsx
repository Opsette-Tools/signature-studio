import { Button, Input, message } from "antd";
import { useState } from "react";

type Props = {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  hint?: string;
  preset?: "profile" | "logo";
};

/**
 * Image input — URL only, by design.
 *
 * This is a standalone, backend-free tool: there is nowhere to host an uploaded
 * file, so embedding one inline (base64) would balloon the signature to 10+ KB
 * and get it clipped by Gmail. So we deliberately DON'T offer file upload — the
 * image must already live at a public URL (a company site, a CDN, Drive "anyone
 * with link", etc.). A hosted `<img src="https://…">` weighs ~60 bytes in the
 * signature regardless of the real image size, exactly how WiseStamp et al. do it.
 */
export function ImageUploader({ value, onChange, label = "Image URL", hint }: Props) {
  const [urlInput, setUrlInput] = useState(value.startsWith("http") ? value : "");

  const applyUrl = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) {
      onChange("");
      return;
    }
    if (!/^https?:\/\//i.test(trimmed)) {
      message.error("URL must start with http:// or https://");
      return;
    }
    onChange(trimmed);
    message.success("Image URL set — keeps signature small");
  };

  return (
    <div className="image-uploader">
      <div
        className="image-uploader__preview"
        style={value ? { backgroundImage: `url(${value})` } : undefined}
        aria-label="Image preview"
      />
      <div className="stack-sm" style={{ flex: 1, minWidth: 0 }}>
        <div className="row">
          <Input
            size="small"
            placeholder="https://your-site.com/logo.png"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onPressEnter={applyUrl}
            aria-label={label}
            style={{ flex: 1 }}
          />
          <Button size="small" onClick={applyUrl}>
            Set
          </Button>
          {value ? (
            <Button
              size="small"
              type="text"
              danger
              onClick={() => {
                onChange("");
                setUrlInput("");
              }}
            >
              Remove
            </Button>
          ) : null}
        </div>
        <small style={{ color: "var(--color-text-muted)" }}>
          {hint ?? "Paste a link to an image that's already online (your website, a CDN, etc.) — keeps your signature small and Gmail-safe."}
        </small>
      </div>
    </div>
  );
}
