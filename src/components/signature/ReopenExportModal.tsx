import { Alert, Input, Modal, Typography, message } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { SignatureData } from "@/types/signature";
import { getTemplateById } from "@/data/templates";
import { fromKitJson } from "@/utils/brandKit";

type Props = {
  open: boolean;
  onClose: () => void;
  /** Restore the reopened signature into the editor. */
  onReopen: (templateId: string, data: SignatureData) => void;
};

/**
 * Paste-to-reopen for Signature Studio's own Brand Kit export shape (the
 * `type:"signature"` blob emitted by "Export to Brand Board"). This is the
 * second half of the interop contract's "triple duty": the same JSON that goes
 * to Brand Board pastes back here to revise a signature weeks later, with no
 * backend. See docs/BRAND-KIT-INTEROP-CONTRACT.md.
 */
export function ReopenExportModal({ open, onClose, onReopen }: Props) {
  const navigate = useNavigate();
  const [raw, setRaw] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    if (open) {
      setRaw("");
      setError(false);
    }
  }, [open]);

  const handleReopen = () => {
    const result = fromKitJson(raw);
    if (!result) {
      setError(true);
      return;
    }
    // The exporting template still needs to exist in this build. If the blob
    // names an unknown template (renamed/removed), keep the data but fall back
    // to the default so the user isn't stuck on a blank template.
    const template = getTemplateById(result.templateId);
    const templateId = template ? result.templateId : "modern-card-style";
    onReopen(templateId, result.signature);
    message.success(
      template
        ? "Signature reopened in the editor"
        : "Signature reopened (its template was unavailable, using the default)",
    );
    onClose();
    // Reopen edits the shared signature state, which is shown on the Studio
    // (editor) page. Send the user there so the result is actually visible —
    // otherwise a reopen from the standalone /saved page appears to do nothing.
    navigate("/");
  };

  return (
    <Modal
      title="Reopen a saved signature"
      open={open}
      onOk={handleReopen}
      onCancel={onClose}
      okText="Reopen"
      okButtonProps={{ disabled: !raw.trim() }}
      destroyOnHidden
    >
      <div className="stack">
        <Typography.Paragraph type="secondary" style={{ marginBottom: 0 }}>
          Paste the JSON from an <strong>Export to Brand Board</strong> to bring a
          signature back into the editor and tweak it.
        </Typography.Paragraph>
        <Input.TextArea
          rows={6}
          placeholder='{"type":"signature","v":1,"source":"opsette",…}'
          value={raw}
          onChange={(e) => {
            setRaw(e.target.value);
            if (error) setError(false);
          }}
        />
        {error ? (
          <Alert
            type="error"
            showIcon
            message="That doesn't look like a Signature Studio export"
            description="Copy the JSON from the Export to Brand Board button and paste the whole thing."
          />
        ) : null}
      </div>
    </Modal>
  );
}
