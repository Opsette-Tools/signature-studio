import { CodeOutlined, CopyOutlined, FileTextOutlined } from "@ant-design/icons";
import { Button, Tabs } from "antd";
import { useMemo, useState } from "react";
import type { SignatureData } from "@/types/signature";
import type { SignatureTemplate } from "@/types/template";
import { useCopySignature } from "@/hooks/useCopySignature";
import { SectionCard } from "@/components/ui/SectionCard";

type Props = {
  template: SignatureTemplate | undefined;
  data: SignatureData;
};

export function CopyPanel({ template, data }: Props) {
  const { copyRich, copyHtml, copyPlain } = useCopySignature();
  const [tab, setTab] = useState("rich");

  const html = useMemo(() => (template ? template.renderHtml(data) : ""), [template, data]);
  const plain = useMemo(
    () => (template ? template.renderPlainText(data) : ""),
    [template, data],
  );

  const disabled = !template;

  return (
    <SectionCard
      title="Copy & export"
      hint="Paste into Gmail, Outlook, Apple Mail, etc."
    >
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
    </SectionCard>
  );
}
