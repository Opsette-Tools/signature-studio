import { Alert } from "antd";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Outlet } from "react-router-dom";
import { readString, storageKeys, writeString } from "@/utils/storage";
import { Footer } from "./Footer";
import { HeaderBar } from "./HeaderBar";

type Props = { children?: ReactNode };

export function AppShell({ children }: Props) {
  const [showPrivacy, setShowPrivacy] = useState(false);

  useEffect(() => {
    setShowPrivacy(!readString(storageKeys.privacyDismissed));
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
            className="privacy-alert"
            message="Your signature data stays on this device. Images are only stored locally unless you paste an external image URL."
            onClose={() => writeString(storageKeys.privacyDismissed, "1")}
          />
        ) : null}
        {children ?? <Outlet />}
      </main>
      <Footer />
    </div>
  );
}
