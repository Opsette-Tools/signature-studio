import { EditOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { Link } from "react-router-dom";
import { CopyPanel } from "@/components/signature/CopyPanel";
import { SignaturePreview } from "@/components/signature/SignaturePreview";
import { SectionCard } from "@/components/ui/SectionCard";
import { useSignatureContext } from "@/app/SignatureContext";

export function PreviewPage() {
  const { selectedTemplate, data } = useSignatureContext();
  return (
    <div className="stack">
      <SectionCard
        title={selectedTemplate ? `Preview · ${selectedTemplate.name}` : "Preview"}
        hint="Use the Edit info tab to fill in your name, company, contact details, images, social links, and CTA."
        extra={
          <Link to="/edit">
            <Button type="primary" icon={<EditOutlined />}>Edit info</Button>
          </Link>
        }
      >
        <SignaturePreview template={selectedTemplate} data={data} />
      </SectionCard>
      <CopyPanel template={selectedTemplate} data={data} />
    </div>
  );
}

