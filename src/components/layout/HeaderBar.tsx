import { AppstoreOutlined, MoonOutlined, ShareAltOutlined, SunOutlined } from "@ant-design/icons";
import { Badge, Button, Tooltip } from "antd";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ShareModal } from "@/components/signature/ShareModal";
import { useThemeMode } from "@/hooks/useThemeMode";
import { useLocalSignatures } from "@/hooks/useLocalSignatures";
import { useSignatureContext } from "@/app/SignatureContext";
import { OpsetteHeader } from "@/components/opsette-header";

export function HeaderBar() {
  const { mode, toggle } = useThemeMode();
  const { items } = useLocalSignatures();
  const { data, update, selectedTemplateId } = useSignatureContext();
  const [shareOpen, setShareOpen] = useState(false);

  const rightExtra = (
    <>
      <Tooltip title="Accent color (used by some templates)">
        <label className="accent-swatch" aria-label="Accent color">
          <input
            type="color"
            value={data.accentColor}
            onChange={(e) => update("accentColor", e.target.value)}
          />
          <span
            className="accent-swatch__dot"
            style={{ background: data.accentColor }}
            aria-hidden
          />
        </label>
      </Tooltip>
      <Tooltip title="Browse all templates">
        <Link to="/templates">
          <Button type="text" icon={<AppstoreOutlined />} />
        </Link>
      </Tooltip>
      <Badge count={items.length} size="small" offset={[-4, 4]} color="var(--color-primary)">
        <Link to="/saved">
          <Button type="text">Saved</Button>
        </Link>
      </Badge>
      <Tooltip title="Share signature">
        <Button icon={<ShareAltOutlined />} onClick={() => setShareOpen(true)}>
          Share
        </Button>
      </Tooltip>
      <Tooltip title={mode === "dark" ? "Switch to light mode" : "Switch to dark mode"}>
        <Button
          type="text"
          icon={mode === "dark" ? <SunOutlined /> : <MoonOutlined />}
          onClick={toggle}
          aria-label="Toggle theme"
        />
      </Tooltip>

      <ShareModal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        data={data}
        templateId={selectedTemplateId}
      />
    </>
  );

  return <OpsetteHeader theme={mode === "dark" ? "dark" : "light"} rightExtra={rightExtra} />;
}
