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
            <SectionCard hint="Images must already be online — paste a link to one. This keeps your signature tiny and prevents Gmail from clipping it (an embedded image would bloat it 10×).">
              <Form layout="vertical">
                <Form.Item label="Logo" style={{ marginBottom: 12 }}>
                  <ImageUploader
                    value={data.logoUrl}
                    onChange={(v) => onChange("logoUrl", v)}
                    label="Logo URL"
                    hint="Your logo is usually already on your website — paste that link."
                  />
                </Form.Item>
                <Form.Item label="Profile photo" style={{ marginBottom: 12 }}>
                  <ImageUploader
                    value={data.profileImageDataUrl}
                    onChange={(v) => onChange("profileImageDataUrl", v)}
                    label="Photo URL"
                    hint="A link to a square photo works best (e.g. your LinkedIn photo URL)."
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
