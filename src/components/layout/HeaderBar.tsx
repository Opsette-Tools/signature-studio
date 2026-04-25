import { MoonOutlined, SunOutlined } from "@ant-design/icons";
import { Badge, Button, Tooltip } from "antd";
import { Link } from "react-router-dom";
import { useThemeMode } from "@/hooks/useThemeMode";
import { useLocalSignatures } from "@/hooks/useLocalSignatures";

export function HeaderBar() {
  const { mode, toggle } = useThemeMode();
  const { items } = useLocalSignatures();
  return (
    <header className="app-header">
      <Link to="/templates" className="app-header__brand">
        <span className="app-header__brand-mark">@</span>
        <span>Signature Studio</span>
      </Link>
      <div className="app-header__actions">
        <Badge count={items.length} size="small" offset={[-4, 4]} color="var(--color-primary)">
          <Link to="/saved">
            <Button type="text">Saved</Button>
          </Link>
        </Badge>
        <Tooltip title={mode === "dark" ? "Switch to light mode" : "Switch to dark mode"}>
          <Button
            type="text"
            icon={mode === "dark" ? <SunOutlined /> : <MoonOutlined />}
            onClick={toggle}
            aria-label="Toggle theme"
          />
        </Tooltip>
      </div>
    </header>
  );
}
