import {
  AppstoreOutlined,
  ExperimentOutlined,
  FolderOpenOutlined,
  MoonOutlined,
  MoreOutlined,
  ShareAltOutlined,
  SunOutlined,
} from "@ant-design/icons";
import { Badge, Button, Dropdown, Grid, Tooltip, type MenuProps } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { ShareModal } from "@/components/signature/ShareModal";
import { useThemeMode } from "@/hooks/useThemeMode";
import { useLocalSignatures } from "@/hooks/useLocalSignatures";
import { useSignatureContext } from "@/app/SignatureContext";
import { OpsetteHeader } from "@/components/opsette-header";

export function HeaderBar() {
  const { mode, toggle } = useThemeMode();
  const { items } = useLocalSignatures();
  const { data, update, selectedTemplateId, isDemo, loadDemo } = useSignatureContext();
  const [shareOpen, setShareOpen] = useState(false);
  const navigate = useNavigate();
  const screens = Grid.useBreakpoint();
  // `md` (≥768px) is where the labeled button row comfortably fits. Below that
  // the shared header was never designed for — so the secondary actions fold
  // into a single overflow menu instead of overflowing the bar.
  const isCompact = !screens.md;

  // The brand-color swatch is quick and universal — it stays inline at every
  // width. It's the one control people reach for constantly.
  const accentSwatch = (
    <Tooltip title="Brand color — drives every template (also on the Brand tab)">
      <label className="accent-swatch" aria-label="Brand color">
        <input
          type="color"
          value={data.accentColor}
          onChange={(e) => update("accentColor", e.target.value)}
        />
        <span className="accent-swatch__dot" style={{ background: data.accentColor }} aria-hidden />
      </label>
    </Tooltip>
  );

  const themeToggle = (
    <Tooltip title={mode === "dark" ? "Switch to light mode" : "Switch to dark mode"}>
      <Button
        type="text"
        icon={mode === "dark" ? <SunOutlined /> : <MoonOutlined />}
        onClick={toggle}
        aria-label="Toggle theme"
      />
    </Tooltip>
  );

  // Secondary actions — inline buttons on desktop, a single kebab menu on mobile.
  const overflowItems: MenuProps["items"] = [
    ...(!isDemo
      ? [
          {
            key: "demo",
            icon: <ExperimentOutlined />,
            label: "Try demo",
            onClick: loadDemo,
          },
        ]
      : []),
    {
      key: "templates",
      icon: <AppstoreOutlined />,
      label: "Browse all templates",
      onClick: () => navigate("/templates"),
    },
    {
      key: "saved",
      icon: <FolderOpenOutlined />,
      label: `Saved${items.length ? ` (${items.length})` : ""}`,
      onClick: () => navigate("/saved"),
    },
    {
      key: "share",
      icon: <ShareAltOutlined />,
      label: "Share signature",
      onClick: () => setShareOpen(true),
    },
  ];

  const rightExtra = isCompact ? (
    <>
      {accentSwatch}
      {themeToggle}
      <Dropdown menu={{ items: overflowItems }} placement="bottomRight" trigger={["click"]}>
        <Button type="text" icon={<MoreOutlined />} aria-label="More actions" />
      </Dropdown>
      <ShareModal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        data={data}
        templateId={selectedTemplateId}
      />
    </>
  ) : (
    <>
      {accentSwatch}
      {!isDemo && (
        <Tooltip title="Fill the form with sample data to preview templates">
          <Button type="text" icon={<ExperimentOutlined />} onClick={loadDemo}>
            Try demo
          </Button>
        </Tooltip>
      )}
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
      {themeToggle}
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
