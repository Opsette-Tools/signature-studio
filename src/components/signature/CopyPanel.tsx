import {
  CodeOutlined,
  CopyOutlined,
  FileTextOutlined,
  LayoutOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";
import { Button, Tabs, Tag, Tooltip, message } from "antd";
import { useMemo, useState } from "react";
import type { SignatureData } from "@/types/signature";
import type { SignatureTemplate } from "@/types/template";
import { useCopySignature } from "@/hooks/useCopySignature";
import { SectionCard } from "@/components/ui/SectionCard";
import { toKitJson } from "@/utils/brandKit";
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

  const handleExportToBrandBoard = async () => {
    if (!template) return;
    try {
      const payload = toKitJson(template, data);
      await navigator.clipboard.writeText(JSON.stringify(payload));
      message.success("Signature copied — paste it into Brand Board");
    } catch {
      message.error("Could not copy to clipboard");
    }
  };

  return (
    <SectionCard
      title="Copy & export"
      hint="Paste into Gmail, Outlook, Apple Mail, etc."
    >
      <div className="row" style={{ marginBottom: 16, alignItems: "center" }}>
        <Tag color={sizeColor}>
          {sizeKb} KB / 8 KB · {sizeLabel}
        </Tag>
        {sizeColor === "red" ? (
          <small style={{ color: "var(--color-text-muted)" }}>
            Tip: switch image uploads to "Paste URL", or remove the logo/photo.
          </small>
        ) : null}
      </div>

      <div className="action-group">
        <div className="group-label">Copy</div>
        <div className="row">
          <Button
            icon={<CopyOutlined />}
            disabled={disabled}
            onClick={() => copyRich(html, plain)}
          >
            Rich signature
          </Button>
          <Button
            icon={<CodeOutlined />}
            disabled={disabled}
            onClick={() => copyHtml(html)}
          >
            HTML
          </Button>
          <Button
            icon={<FileTextOutlined />}
            disabled={disabled}
            onClick={() => copyPlain(plain)}
          >
            Plain text
          </Button>
        </div>
      </div>

      <div className="action-group">
        <div className="group-label">Share</div>
        <div className="row">
          <Button
            icon={<ShareAltOutlined />}
            disabled={disabled}
            onClick={() => setShareOpen(true)}
          >
            Share link
          </Button>
          <Tooltip title="Copy as JSON to paste into Brand Board, or to reopen later">
            <Button
              icon={<LayoutOutlined />}
              disabled={disabled}
              onClick={handleExportToBrandBoard}
            >
              Export to Brand Board
            </Button>
          </Tooltip>
        </div>
      </div>
      <Tabs
        size="small"
        activeKey={tab}
        onChange={setTab}
        style={{ marginTop: 20 }}
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
