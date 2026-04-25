import { EyeOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { Link } from "react-router-dom";
import { SignatureForm } from "@/components/signature/SignatureForm";
import { SectionCard } from "@/components/ui/SectionCard";
import { useSignatureContext } from "@/app/SignatureContext";

export function EditPage() {
  const { data, update } = useSignatureContext();
  return (
    <div className="stack">
      <SectionCard
        title="Edit your information"
        hint="Enter your details once. Blank fields are automatically hidden in every template."
        extra={
          <Link to="/preview">
            <Button type="primary" icon={<EyeOutlined />}>Preview</Button>
          </Link>
        }
      >
        <SignatureForm data={data} onChange={update} />
      </SectionCard>
    </div>
  );
}
