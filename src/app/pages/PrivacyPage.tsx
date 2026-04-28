import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button, Card, Typography } from "antd";
import { Link } from "react-router-dom";
import { OpsetteFooterLogo } from "@/components/opsette-share";

const { Title, Paragraph } = Typography;

export function PrivacyPage() {
  return (
    <div style={{ padding: "20px 16px 60px" }}>
      <Link to="/">
        <Button type="text" icon={<ArrowLeftOutlined />} style={{ marginBottom: 16 }}>
          Back
        </Button>
      </Link>
      <Card style={{ borderRadius: 14, maxWidth: 640, margin: "0 auto" }}>
        <Title level={3}>Privacy</Title>
        <Paragraph>
          <strong>No personal data is collected.</strong> Signature Studio does not require an
          account, login, or any personal information to use.
        </Paragraph>
        <Paragraph>
          <strong>Everything stays on your device.</strong> Your saved signatures, uploaded photos
          and logos, theme preference, and template favorites are stored locally in your browser
          (localStorage and IndexedDB). Nothing is uploaded to any server.
        </Paragraph>
        <Paragraph>
          <strong>Share links are encoded in the URL itself.</strong> When you generate a share
          link, the signature data is compressed into the link's hash — it does not pass through
          any backend. Anyone with the link can view the signature, so only share it with people
          you trust.
        </Paragraph>
        <Paragraph>
          <strong>External image URLs.</strong> If you paste an external image URL (instead of
          uploading a photo or logo), your mail client will load that image from its original
          host. That host may see the request — Signature Studio does not.
        </Paragraph>
        <Paragraph>
          <strong>No tracking or analytics.</strong> We do not use cookies, analytics tools, or any
          form of user tracking.
        </Paragraph>
        <Paragraph>
          <strong>No data is sold or shared.</strong> Since we don't collect any data, there is
          nothing to sell or share with third parties.
        </Paragraph>

        <OpsetteFooterLogo />
      </Card>
    </div>
  );
}
