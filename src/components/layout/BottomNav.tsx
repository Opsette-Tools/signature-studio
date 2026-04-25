import {
  AppstoreOutlined,
  EditOutlined,
  EyeOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";

const items = [
  { path: "/templates", label: "Templates", icon: <AppstoreOutlined /> },
  { path: "/edit", label: "Edit", icon: <EditOutlined /> },
  { path: "/preview", label: "Preview", icon: <EyeOutlined /> },
  { path: "/saved", label: "Saved", icon: <SaveOutlined /> },
];

export function BottomNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  return (
    <nav className="bottom-nav" role="navigation" aria-label="Primary">
      {items.map((it) => {
        const active = pathname.startsWith(it.path);
        return (
          <button
            key={it.path}
            type="button"
            onClick={() => navigate(it.path)}
            className={`bottom-nav__item${active ? " bottom-nav__item--active" : ""}`}
            aria-current={active ? "page" : undefined}
          >
            <span className="bottom-nav__icon">{it.icon}</span>
            <span>{it.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
