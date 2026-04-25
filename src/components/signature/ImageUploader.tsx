import { LinkOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, Input, message, Segmented, Upload } from "antd";
import type { UploadProps } from "antd";
import { useState } from "react";
import {
  byteSizeOfDataUrl,
  LOGO_PRESET,
  PROFILE_PRESET,
  resizeImage,
} from "@/utils/imageToBase64";

type Props = {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  hint?: string;
  preset?: "profile" | "logo";
};

export function ImageUploader({
  value,
  onChange,
  label = "Upload image",
  hint,
  preset = "profile",
}: Props) {
  const [mode, setMode] = useState<"upload" | "url">(
    value.startsWith("http") ? "url" : "upload",
  );
  const [urlInput, setUrlInput] = useState(value.startsWith("http") ? value : "");

  const resizePreset = preset === "logo" ? LOGO_PRESET : PROFILE_PRESET;

  const props: UploadProps = {
    accept: "image/*",
    showUploadList: false,
    beforeUpload: async (file) => {
      try {
        const dataUrl = await resizeImage(file, resizePreset);
        onChange(dataUrl);
        const kb = Math.round(byteSizeOfDataUrl(dataUrl) / 1024);
        message.success(`Auto-resized for email compatibility (~${kb} KB)`);
      } catch {
        message.error("Could not read image");
      }
      return false; // prevent network upload
    },
  };

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
        <Segmented
          size="small"
          value={mode}
          onChange={(v) => setMode(v as "upload" | "url")}
          options={[
            { label: "Upload", value: "upload", icon: <UploadOutlined /> },
            { label: "Paste URL", value: "url", icon: <LinkOutlined /> },
          ]}
        />
        {mode === "upload" ? (
          <div className="row">
            <Upload {...props}>
              <Button icon={<UploadOutlined />} size="small">
                {label}
              </Button>
            </Upload>
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
        ) : (
          <div className="row">
            <Input
              size="small"
              placeholder="https://your-cdn.com/image.png"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onPressEnter={applyUrl}
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
        )}
        {hint ? <small style={{ color: "var(--color-text-muted)" }}>{hint}</small> : null}
        {mode === "upload" ? (
          <small style={{ color: "var(--color-text-muted)" }}>
            Uploaded images are auto-resized to keep your signature under email-client limits.
          </small>
        ) : (
          <small style={{ color: "var(--color-text-muted)" }}>
            Hosted URLs keep your signature smallest and most compatible.
          </small>
        )}
      </div>
    </div>
  );
}
