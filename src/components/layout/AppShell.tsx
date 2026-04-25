import { Alert } from "antd";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Outlet } from "react-router-dom";
import { BottomNav } from "./BottomNav";
import { HeaderBar } from "./HeaderBar";

const PRIVACY_KEY = "esg.privacy-dismissed.v1";

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
        {showPrivacy ? (
          <Alert
            type="info"
            showIcon
            closable
            style={{ marginBottom: 16 }}
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
        <p className="privacy-note">
          100% local · No accounts · No tracking
        </p>
      </main>
      <BottomNav />
    </div>
  );
}
