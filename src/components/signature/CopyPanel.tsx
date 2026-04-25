import { CodeOutlined, CopyOutlined, FileTextOutlined, ShareAltOutlined } from "@ant-design/icons";
import { Button, Tabs, Tag } from "antd";
import { useMemo, useState } from "react";
import type { SignatureData } from "@/types/signature";
import type { SignatureTemplate } from "@/types/template";
import { useCopySignature } from "@/hooks/useCopySignature";
import { SectionCard } from "@/components/ui/SectionCard";
import { ShareModal } from "./ShareModal";

type Props = {
  template: SignatureTemplate | undefined;
  data: SignatureData;
};

const SAFE_LIMIT = 8 * 1024; // 8 KB — fits Outlook + Gmail comfortably
const WARN_LIMIT = 6 * 1024;

export function CopyPanel({ template, data }: Props) {
  const { copyRich, copyHtml, copyPlain } = useCopySignature();
  const [tab, setTab] = useState("rich");
  const [shareOpen, setShareOpen] = useState(false);

  const html = useMemo(() => (template ? template.renderHtml(data) : ""), [template, data]);
  const plain = useMemo(
    () => (template ? template.renderPlainText(data) : ""),
    [template, data],
  );

  const sizeBytes = useMemo(() => new Blob([html]).size, [html]);
  const sizeKb = (sizeBytes / 1024).toFixed(1);
  const sizeColor: "green" | "orange" | "red" =
    sizeBytes < WARN_LIMIT ? "green" : sizeBytes < SAFE_LIMIT ? "orange" : "red";
  const sizeLabel =
    sizeColor === "green"
      ? "Fits all email clients"
      : sizeColor === "orange"
        ? "Approaching Outlook limit"
        : "Too large — likely to be clipped";

  const disabled = !template;

  return (
    <SectionCard
      title="Copy & export"
      hint="Paste into Gmail, Outlook, Apple Mail, etc."
    >
      <div className="row" style={{ marginBottom: 12, alignItems: "center" }}>
        <Tag color={sizeColor}>
          {sizeKb} KB / 8 KB · {sizeLabel}
        </Tag>
        {sizeColor === "red" ? (
          <small style={{ color: "var(--color-text-muted)" }}>
            Tip: switch image uploads to "Paste URL", or remove the logo/photo.
          </small>
        ) : null}
      </div>
      <div className="row" style={{ marginBottom: 12 }}>
        <Button
          type="primary"
          icon={<CopyOutlined />}
          disabled={disabled}
          onClick={() => copyRich(html, plain)}
        >
          Copy rich signature
        </Button>
        <Button
          icon={<CodeOutlined />}
          disabled={disabled}
          onClick={() => copyHtml(html)}
        >
          Copy HTML
        </Button>
        <Button
          icon={<FileTextOutlined />}
          disabled={disabled}
          onClick={() => copyPlain(plain)}
        >
          Copy plain text
        </Button>
        <Button
          icon={<ShareAltOutlined />}
          disabled={disabled}
          onClick={() => setShareOpen(true)}
        >
          Share link
        </Button>
      </div>
      <Tabs
        size="small"
        activeKey={tab}
        onChange={setTab}
        items={[
          {
            key: "rich",
            label: "Rich preview",
            children: (
              <div
                className="signature-preview"
                dangerouslySetInnerHTML={{ __html: html || "" }}
              />
            ),
          },
          {
            key: "html",
            label: "HTML",
            children: <pre className="code-block">{html}</pre>,
          },
          {
            key: "plain",
            label: "Plain text",
            children: <pre className="code-block">{plain}</pre>,
          },
        ]}
      />
      {template ? (
        <ShareModal
          open={shareOpen}
          onClose={() => setShareOpen(false)}
          data={data}
          templateId={template.id}
        />
      ) : null}
    </SectionCard>
  );
}
