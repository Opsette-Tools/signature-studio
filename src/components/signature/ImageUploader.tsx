import { UploadOutlined } from "@ant-design/icons";
import { Button, message, Upload } from "antd";
import type { UploadProps } from "antd";
import { fileToBase64, isLikelyTooLarge } from "@/utils/imageToBase64";

type Props = {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  hint?: string;
};

export function ImageUploader({ value, onChange, label = "Upload image", hint }: Props) {
  const props: UploadProps = {
    accept: "image/*",
    showUploadList: false,
    beforeUpload: async (file) => {
      try {
        if (isLikelyTooLarge(file)) {
          message.warning("Image is large — many email clients may strip it. Consider a hosted URL instead.");
        }
        const dataUrl = await fileToBase64(file);
        onChange(dataUrl);
      } catch {
        message.error("Could not read image");
      }
      return false; // prevent network upload
    },
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
          <Upload {...props}>
            <Button icon={<UploadOutlined />} size="small">
              {label}
            </Button>
          </Upload>
          {value ? (
            <Button size="small" type="text" danger onClick={() => onChange("")}>
              Remove
            </Button>
          ) : null}
        </div>
        {hint ? <small style={{ color: "var(--color-text-muted)" }}>{hint}</small> : null}
      </div>
    </div>
  );
}
