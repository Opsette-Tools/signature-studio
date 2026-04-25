import { ArrowLeftOutlined, CheckOutlined } from "@ant-design/icons";
import { Alert, Button, Tag, message } from "antd";
import { useMemo } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { SignaturePreview } from "@/components/signature/SignaturePreview";
import { SectionCard } from "@/components/ui/SectionCard";
import { useSignatureContext } from "@/app/SignatureContext";
import { getTemplateById } from "@/data/templates";
import { applySharePayload, decodeShare } from "@/utils/shareLink";

export function SharePage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { replaceAll, setSelectedTemplateId } = useSignatureContext();

  const token = params.get("d") ?? "";
  const payload = useMemo(() => (token ? decodeShare(token) : null), [token]);
  const template = payload ? getTemplateById(payload.t) : undefined;
  const previewData = useMemo(() => (payload ? applySharePayload(payload) : null), [payload]);

  if (!token) {
    return (
      <SectionCard title="No share link found">
        <p>This page expects a share link. Try opening the link your sender gave you again.</p>
        <Link to="/">
          <Button type="primary" icon={<ArrowLeftOutlined />}>Go to studio</Button>
        </Link>
      </SectionCard>
    );
  }

  if (!payload || !previewData) {
    return (
      <SectionCard title="Couldn't read this link">
        <Alert
          type="error"
          showIcon
          message="The share link is invalid or corrupted"
          description="Ask the sender to copy and resend it."
        />
        <div style={{ marginTop: 12 }}>
          <Link to="/">
            <Button icon={<ArrowLeftOutlined />}>Go to studio</Button>
          </Link>
        </div>
      </SectionCard>
    );
  }

  if (!template) {
    return (
      <SectionCard title="Template not available">
        <Alert
          type="warning"
          showIcon
          message={`The sender used a template ("${payload.t}") that isn't in this version of Signature Studio.`}
          description="The data is fine — pick a template in the studio and we'll apply the shared fields."
        />
        <div style={{ marginTop: 12 }} className="row">
          <Button
            type="primary"
            onClick={() => {
              replaceAll(previewData);
              message.success("Shared fields loaded");
              navigate("/");
            }}
          >
            Load fields anyway
          </Button>
          <Link to="/">
            <Button>Discard</Button>
          </Link>
        </div>
      </SectionCard>
    );
  }

  const isKit = payload.mode === "kit";

  const accept = () => {
    replaceAll(previewData);
    setSelectedTemplateId(template.id);
    message.success(isKit ? "Brand kit loaded — add your details" : "Template loaded");
    navigate("/");
  };

  return (
    <div className="share-page stack">
      <Alert
        type={isKit ? "info" : "warning"}
        showIcon
        message={
          isKit
            ? "You've received a brand kit"
            : "You've received a complete signature"
        }
        description={
          isKit
            ? "Company branding, logo, and colors will load. You'll add your own name, title, photo, and contact details."
            : "Every field from the sender's signature will load — including their name, photo, and contact info. Edit before using."
        }
      />

      <div className="share-page__grid">
        <SectionCard title="Preview">
          <SignaturePreview template={template} data={previewData} />
        </SectionCard>

        <SectionCard
          title={isKit ? "What you'll get" : "Included fields"}
          extra={<Tag color={isKit ? "blue" : "orange"}>{isKit ? "Brand kit" : "Full template"}</Tag>}
        >
          <div className="share-page__field-list">
            {Object.entries(previewData)
              .filter(([, v]) => typeof v === "string" && v.length > 0)
              .map(([k, v]) => (
                <div className="share-page__field" key={k}>
                  <span className="share-page__field-key">{k}</span>
                  <span className="share-page__field-val">{String(v).slice(0, 60)}</span>
                </div>
              ))}
          </div>
          <div className="share-page__actions row">
            <Button type="primary" icon={<CheckOutlined />} onClick={accept}>
              Use this template
            </Button>
            <Link to="/">
              <Button>Discard</Button>
            </Link>
          </div>
          {payload.stripped ? (
            <p className="share-page__hint">
              Note: the sender removed an uploaded logo to keep this link short.
            </p>
          ) : null}
        </SectionCard>
      </div>
    </div>
  );
}
