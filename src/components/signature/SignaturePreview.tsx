import { Button } from "antd";
import { Link } from "react-router-dom";
import type { SignatureData } from "@/types/signature";
import type { SignatureTemplate } from "@/types/template";
import { hasAnyContent } from "@/utils/sanitizeSignatureData";

type Props = {
  template: SignatureTemplate | undefined;
  data: SignatureData;
};

export function SignaturePreview({ template, data }: Props) {
  if (!template) {
    return (
      <div className="signature-preview">
        <div className="signature-preview__empty">Select a template to preview your signature</div>
      </div>
    );
  }
  if (!hasAnyContent(data)) {
    return (
      <div className="signature-preview">
        <div className="signature-preview__empty">
          <p>
            This is the <strong>{template.name}</strong> template. Add your details to generate the final signature.
          </p>
          <Link to="/edit">
            <Button type="primary">Edit your info</Button>
          </Link>
        </div>
      </div>
    );
  }
  return (
    <div
      className="signature-preview"
      // Inline HTML from a template renderer — required to be email-safe markup
      dangerouslySetInnerHTML={{ __html: template.renderHtml(data) }}
    />
  );
}
