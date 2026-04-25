import { EyeOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { Link } from "react-router-dom";
import { SignatureForm } from "@/components/signature/SignatureForm";
import { useSignatureContext } from "@/app/SignatureContext";

export function EditPage() {
  const { data, update } = useSignatureContext();
  return (
    <div className="stack">
      <div className="page-action-bar">
        <div>
          <h1 className="page-action-bar__title">Edit your information</h1>
          <p className="page-action-bar__hint">Enter your details once. Blank fields are hidden in every template.</p>
        </div>
        <Link to="/preview">
          <Button type="primary" icon={<EyeOutlined />}>Preview</Button>
        </Link>
      </div>
      <SignatureForm data={data} onChange={update} />
    </div>
  );
}

