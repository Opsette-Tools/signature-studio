import { Alert, Button } from "antd";
import { useSignatureContext } from "@/app/SignatureContext";

/**
 * Shown while the form holds demo data (after "Try demo"). Mirrors the
 * "Viewing demo data" banner pattern used across the Opsette tool family
 * (e.g. receipt-maker) so the demo state is always obvious and one-click
 * clearable. Renders nothing when not in demo mode.
 */
export function DemoBanner() {
  const { isDemo, clearDemo } = useSignatureContext();
  if (!isDemo) return null;
  return (
    <Alert
      type="info"
      showIcon
      message="Viewing demo data — edit any field to make it yours, or clear it to start fresh."
      action={
        <Button size="small" onClick={clearDemo}>
          Clear
        </Button>
      }
    />
  );
}
