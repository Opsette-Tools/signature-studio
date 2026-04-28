import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button, Card, Typography } from "antd";
import { Link } from "react-router-dom";
import { OpsetteFooterLogo } from "@/components/opsette-share";

const { Title, Paragraph } = Typography;

export function AboutPage() {
  return (
    <div style={{ padding: "20px 16px 60px" }}>
      <Link to="/">
        <Button type="text" icon={<ArrowLeftOutlined />} style={{ marginBottom: 16 }}>
          Back
        </Button>
      </Link>
      <Card style={{ borderRadius: 14, maxWidth: 640, margin: "0 auto" }}>
        <Title level={3}>About Signature Studio</Title>
        <Paragraph type="secondary" style={{ marginBottom: 12 }}>
          A free email signature builder from Opsette Marketplace.
        </Paragraph>
        <Paragraph>
          Signature Studio helps anyone — freelancers, founders, sales reps, support teams — put
          together a polished email signature in a couple of minutes. Browse a gallery of 35+
          templates, fill in your details once, and copy the result as rich HTML or plain text into
          Gmail, Outlook, Apple Mail, or anywhere else.
        </Paragraph>

        <Title level={5} style={{ marginTop: 16 }}>How it works</Title>
        <Paragraph>
          <ol style={{ paddingLeft: 20, margin: 0 }}>
            <li>Pick a template from the gallery.</li>
            <li>Fill in your name, title, contact info, and (optionally) a photo or logo.</li>
            <li>Tweak the accent color to match your brand.</li>
            <li>Copy as rich HTML for your mail client, or as plain text.</li>
            <li>Save it locally — come back later and edit or pick a different template.</li>
          </ol>
        </Paragraph>

        <Paragraph type="secondary" italic style={{ fontSize: 12, marginTop: 16 }}>
          Everything runs in your browser. Your saved signatures, photos, and preferences are
          stored locally — nothing is sent to any server.
        </Paragraph>

        <OpsetteFooterLogo />
      </Card>
    </div>
  );
}
