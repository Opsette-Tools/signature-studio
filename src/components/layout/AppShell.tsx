import { Alert } from "antd";
import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Outlet } from "react-router-dom";
import { readString, storageKeys, writeString } from "@/utils/storage";
import { isEmbedded } from "@/utils/opsette-kit-link";
import { Footer } from "./Footer";
import { HeaderBar } from "./HeaderBar";

type Props = { children?: ReactNode };

export function AppShell({ children }: Props) {
  const [showPrivacy, setShowPrivacy] = useState(false);
  // Mechanism 3: inside a Brand Board iframe, hide the app's own header, footer,
  // and privacy alert so the drawer reads as one surface. The StudioPage renders
  // its own "Save to Brand Board" bar in place of the header.
  const embedded = useMemo(() => isEmbedded(), []);

  useEffect(() => {
    setShowPrivacy(!readString(storageKeys.privacyDismissed));
  }, []);

  if (embedded) {
    return (
      <div className="app-shell app-shell--embedded">
        <main className="app-main">{children ?? <Outlet />}</main>
      </div>
    );
  }

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
