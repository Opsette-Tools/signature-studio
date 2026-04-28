import { CopyOutlined, ShareAltOutlined } from "@ant-design/icons";
import { Alert, Button, Input, Modal, Space, Tabs, Tag, Tooltip, message } from "antd";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useMemo, useState } from "react";
import type { SignatureData } from "@/types/signature";
import { ShareAppModal } from "@/components/opsette-share";
import {
  PERSONAL_FIELDS,
  SHARED_FIELDS,
  URL_HARD_CEILING,
  buildPayload,
  buildShareUrl,
  classifyUrlLength,
  estimateUrlLength,
  type ShareMode,
} from "@/utils/shareLink";

type Props = {
  open: boolean;
  onClose: () => void;
  data: SignatureData;
  templateId: string;
};

const FIELD_LABELS: Partial<Record<keyof SignatureData, string>> = {
  fullName: "Full name",
  pronouns: "Pronouns",
  jobTitle: "Job title",
  company: "Company",
  tagline: "Tagline",
  email: "Email",
  phone: "Phone",
  website: "Website",
  bookingLink: "Booking link",
  address: "Address",
  logoUrl: "Logo URL",
  logoDataUrl: "Uploaded logo",
  profileImageDataUrl: "Profile photo",
  linkedin: "LinkedIn",
  twitter: "X / Twitter",
  instagram: "Instagram",
  facebook: "Facebook",
  youtube: "YouTube",
  tiktok: "TikTok",
  ctaLabel: "CTA label",
  ctaUrl: "CTA URL",
  disclaimer: "Disclaimer",
  accentColor: "Accent color",
};

export function ShareModal({ open, onClose, data, templateId }: Props) {
  const [mode, setMode] = useState<ShareMode>("kit");
  // Default ON for kit mode — shipping a base64 logo over a brand-kit link almost always blows past Outlook URL limits.
  const [stripLogoData, setStripLogoData] = useState(true);
  const [shareAppOpen, setShareAppOpen] = useState(false);

  useEffect(() => {
    if (open) {
      setMode("kit");
      setStripLogoData(true);
    }
  }, [open]);

  const hasUploadedLogo = Boolean(data.logoDataUrl);
  const hasLogoUrl = Boolean(data.logoUrl);

  const payload = useMemo(
    () => buildPayload({ mode, templateId, data, stripLogoData: mode === "kit" && stripLogoData }),
    [mode, templateId, data, stripLogoData],
  );

  const url = useMemo(() => buildShareUrl(payload), [payload]);
  const length = useMemo(() => estimateUrlLength(payload), [payload]);
  const band = classifyUrlLength(length);
  const overCeiling = length > URL_HARD_CEILING;

  const sizeColor: "green" | "orange" | "red" =
    band === "ok" ? "green" : band === "warn" ? "orange" : "red";
  const sizeLabel =
    band === "ok"
      ? "Fits everywhere"
      : band === "warn"
        ? "Long URL — works in most clients"
        : band === "tight"
          ? "Very long — Outlook may truncate"
          : "Too long to share — strip the logo or paste a hosted URL";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      message.success("Share link copied");
    } catch {
      message.error("Could not copy link");
    }
  };

  // QR codes max out at ~2,953 bytes (level L) / ~2,331 (M). Above ~2,000 we skip rendering
  // entirely to avoid the qrcode.react throw. Copy-link still works far past this.
  const QR_MAX_LEN = 2000;
  const qrTooLarge = length > QR_MAX_LEN;

  const kitTab = (
    <div className="stack">
      <Alert
        type="info"
        showIcon
        message="Brand kit"
        description="Sends company branding only. The recipient adds their own name, title, photo, and contact details."
      />

      {hasUploadedLogo && stripLogoData ? (
        <Alert
          type="success"
          showIcon
          message="Uploaded logo will be removed from the link"
          description={
            hasLogoUrl
              ? "Your hosted Logo URL will be used instead — keeps the link short and safe."
              : "Add a hosted Logo URL in Edit info → Media so recipients see your logo. Otherwise the link will load with no logo."
          }
          action={
            <Button size="small" onClick={() => setStripLogoData(false)}>
              Keep logo
            </Button>
          }
        />
      ) : null}
      {hasUploadedLogo && !stripLogoData ? (
        <Alert
          type="warning"
          showIcon
          message="Embedding the uploaded logo"
          description="Base64 logos make share links long. Outlook and some browsers may reject very long URLs."
          action={
            <Button size="small" type="primary" onClick={() => setStripLogoData(true)}>
              Strip logo
            </Button>
          }
        />
      ) : null}

      <FieldList
        title="Will be shared"
        fields={SHARED_FIELDS.filter((f) => {
          if (f === "logoDataUrl" && stripLogoData) return false;
          return Boolean(data[f]);
        })}
      />
      <FieldList
        title="Recipient fills in"
        fields={[...PERSONAL_FIELDS]}
        muted
      />
    </div>
  );

  const fullTab = (
    <div className="stack">
      <Alert
        type="warning"
        showIcon
        message="Full template"
        description="Sends every field, including your name, photo, and contact info. Use this to hand off a finished signature, not as a brand kit."
      />
      <FieldList
        title="Included in the link"
        fields={(Object.keys(data) as (keyof SignatureData)[]).filter((f) => Boolean(data[f]))}
      />
    </div>
  );

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title={
        <Space>
          <ShareAltOutlined />
          <span>Share signature</span>
        </Space>
      }
      footer={null}
      width={620}
      destroyOnHidden
    >
      <div className="stack">
        <Tabs
          activeKey={mode}
          onChange={(k) => setMode(k as ShareMode)}
          items={[
            { key: "kit", label: "Brand kit", children: kitTab },
            { key: "full", label: "Full template", children: fullTab },
          ]}
        />

        <div className="row" style={{ justifyContent: "space-between" }}>
          <Tag color={sizeColor}>
            {length.toLocaleString()} chars · {sizeLabel}
          </Tag>
          <small style={{ color: "var(--color-text-muted)" }}>
            {mode === "kit" ? "Recipient fills in personal fields." : "Everything is included."}
          </small>
        </div>

        {overCeiling ? (
          <Alert
            type="error"
            showIcon
            message="This link is too long to share reliably"
            description="Strip the uploaded logo above, or add a hosted Logo URL in Edit info → Media."
          />
        ) : null}

        <Input.TextArea readOnly rows={3} value={url} />
        <div className="row">
          <Tooltip title={overCeiling ? "Reduce link size first" : ""}>
            <Button
              type="primary"
              icon={<CopyOutlined />}
              onClick={handleCopy}
              disabled={overCeiling}
            >
              Copy link
            </Button>
          </Tooltip>
        </div>

        {!overCeiling && !qrTooLarge ? (
          <div className="share-modal__qr">
            <QRCodeSVG value={url} size={160} level="L" marginSize={2} />
            <p className="share-modal__qr-caption">Scan to open on another device</p>
          </div>
        ) : !overCeiling ? (
          <div className="share-modal__qr share-modal__qr--placeholder">
            <p className="share-modal__qr-caption">
              QR code unavailable — link is too long to encode. Copy the link instead.
            </p>
          </div>
        ) : null}

        <div style={{ borderTop: "1px solid var(--color-border, #eee)", paddingTop: 12, marginTop: 4, textAlign: "center" }}>
          <Button type="link" size="small" onClick={() => setShareAppOpen(true)}>
            Or share the Signature Studio app itself →
          </Button>
        </div>
      </div>

      <ShareAppModal open={shareAppOpen} onClose={() => setShareAppOpen(false)} />
    </Modal>
  );
}

function FieldList({
  title,
  fields,
  muted = false,
}: {
  title: string;
  fields: readonly (keyof SignatureData)[];
  muted?: boolean;
}) {
  return (
    <div>
      <div className="share-modal__list-title">{title}</div>
      {fields.length === 0 ? (
        <div className="share-modal__list-empty">No fields</div>
      ) : (
        <div className="share-modal__chips">
          {fields.map((f) => (
            <Tag key={f} color={muted ? "default" : "blue"}>
              {FIELD_LABELS[f] ?? f}
            </Tag>
          ))}
        </div>
      )}
    </div>
  );
}

