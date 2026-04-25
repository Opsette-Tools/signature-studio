import { Alert } from "antd";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { BottomNav } from "./BottomNav";
import { HeaderBar } from "./HeaderBar";

const PRIVACY_KEY = "esg.privacy-dismissed.v1";

const navItems = [
  { to: "/templates", label: "Templates" },
  { to: "/edit", label: "Edit info" },
  { to: "/preview", label: "Preview" },
  { to: "/saved", label: "Saved" },
];

type Props = { children?: ReactNode };

export function AppShell({ children }: Props) {
  const [showPrivacy, setShowPrivacy] = useState(false);

  useEffect(() => {
    try {
      setShowPrivacy(!localStorage.getItem(PRIVACY_KEY));
    } catch {
      /* ignore */
    }
  }, []);

  return (
    <div className="app-shell">
      <HeaderBar />
      <main className="app-main">
        <nav className="top-tabs" aria-label="Signature generator steps">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `top-tabs__item${isActive ? " top-tabs__item--active" : ""}`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        {showPrivacy ? (
          <Alert
            type="info"
            showIcon
            closable
            className="privacy-alert"
            message="Your signature data stays on this device. Images are only stored locally unless you paste an external image URL."
            onClose={() => {
              try {
                localStorage.setItem(PRIVACY_KEY, "1");
              } catch {
                /* ignore */
              }
            }}
          />
        ) : null}
        {children ?? <Outlet />}
        <p className="privacy-note">100% local · No accounts · No tracking</p>
      </main>
      <BottomNav />
    </div>
  );
}

