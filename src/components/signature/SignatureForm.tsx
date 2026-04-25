import { Form, Input, Tabs } from "antd";
import { ImageUploader } from "./ImageUploader";
import { SectionCard } from "@/components/ui/SectionCard";
import type { SignatureData } from "@/types/signature";

type Props = {
  data: SignatureData;
  onChange: <K extends keyof SignatureData>(key: K, value: SignatureData[K]) => void;
};

export function SignatureForm({ data, onChange }: Props) {
  const F = (label: string, field: keyof SignatureData, placeholder = "", type: "text" | "url" | "email" | "tel" = "text") => (
    <Form.Item label={label} style={{ marginBottom: 12 }}>
      <Input
        value={data[field] as string}
        type={type}
        placeholder={placeholder}
        onChange={(e) => onChange(field, e.target.value as never)}
      />
    </Form.Item>
  );

  return (
    <Tabs
      defaultActiveKey="identity"
      items={[
        {
          key: "identity",
          label: "Identity",
          children: (
            <SectionCard>
              <Form layout="vertical">
                {F("Full name", "fullName", "Jane Doe")}
                {F("Pronouns", "pronouns", "she/her")}
                {F("Job title", "jobTitle", "Senior Designer")}
                {F("Company", "company", "Acme Inc.")}
                {F("Tagline", "tagline", "Designing calm interfaces")}
              </Form>
            </SectionCard>
          ),
        },
        {
          key: "contact",
          label: "Contact",
          children: (
            <SectionCard>
              <Form layout="vertical">
                {F("Email", "email", "jane@acme.com", "email")}
                {F("Phone", "phone", "+1 555 123 4567", "tel")}
                {F("Website", "website", "acme.com", "url")}
                {F("Booking link", "bookingLink", "cal.com/jane", "url")}
                {F("Address / location", "address", "Berlin, DE")}
              </Form>
            </SectionCard>
          ),
        },
        {
          key: "media",
          label: "Media",
          children: (
            <SectionCard hint="Logo URL is recommended for best email-client compatibility. Uploaded images are stored locally as base64 and may be stripped by some clients.">
              <Form layout="vertical">
                <Form.Item label="Logo URL" style={{ marginBottom: 12 }}>
                  <Input
                    value={data.logoUrl}
                    placeholder="https://your-cdn.com/logo.png"
                    onChange={(e) => onChange("logoUrl", e.target.value)}
                  />
                </Form.Item>
                <Form.Item label="Logo (local upload or URL)" style={{ marginBottom: 12 }}>
                  <ImageUploader
                    value={data.logoDataUrl}
                    onChange={(v) => onChange("logoDataUrl", v)}
                    label="Choose logo"
                    preset="logo"
                    hint="Used only if no Logo URL above is set."
                  />
                </Form.Item>
                <Form.Item label="Profile photo (local upload or URL)" style={{ marginBottom: 12 }}>
                  <ImageUploader
                    value={data.profileImageDataUrl}
                    onChange={(v) => onChange("profileImageDataUrl", v)}
                    label="Choose photo"
                    preset="profile"
                    hint="Square photos work best."
                  />
                </Form.Item>
              </Form>
            </SectionCard>
          ),
        },
        {
          key: "social",
          label: "Social",
          children: (
            <SectionCard>
              <Form layout="vertical">
                {F("LinkedIn", "linkedin", "linkedin.com/in/jane", "url")}
                {F("X / Twitter", "twitter", "x.com/jane", "url")}
                {F("Instagram", "instagram", "instagram.com/jane", "url")}
                {F("Facebook", "facebook", "facebook.com/jane", "url")}
                {F("YouTube", "youtube", "youtube.com/@jane", "url")}
                {F("TikTok", "tiktok", "tiktok.com/@jane", "url")}
              </Form>
            </SectionCard>
          ),
        },
        {
          key: "cta",
          label: "CTA & Footer",
          children: (
            <SectionCard>
              <Form layout="vertical">
                {F("CTA label", "ctaLabel", "Book a call")}
                {F("CTA URL", "ctaUrl", "cal.com/jane", "url")}
                <Form.Item label="Disclaimer / footer" style={{ marginBottom: 12 }}>
                  <Input.TextArea
                    rows={3}
                    value={data.disclaimer}
                    placeholder="This email and any attachments are confidential…"
                    onChange={(e) => onChange("disclaimer", e.target.value)}
                  />
                </Form.Item>
              </Form>
            </SectionCard>
          ),
        },
      ]}
    />
  );
}
