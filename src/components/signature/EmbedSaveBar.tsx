import { Button, Typography } from "antd";
import { CheckOutlined } from "@ant-design/icons";

/**
 * EmbedSaveBar — the slim top bar shown ONLY when Signature Studio runs inside a
 * Brand Board iframe (Mechanism 3, ?embed=1). It replaces the app's own header so
 * the drawer reads as one surface, and pushes the revised signature back to the
 * board on Save. Closing the drawer is the parent's job.
 */
export function EmbedSaveBar({
  onSave,
  saving,
  disabled,
}: {
  onSave: () => void;
  saving: boolean;
  disabled?: boolean;
}) {
  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 10,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        padding: "10px 16px",
        background: "#2f4f46",
        color: "#fff",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.25 }}>
        <Typography.Text style={{ color: "#fff", fontWeight: 600, fontSize: 14 }}>
          Editing your signature
        </Typography.Text>
        <Typography.Text style={{ color: "rgba(255,255,255,0.72)", fontSize: 12 }}>
          Changes stay here until you send them back to the board.
        </Typography.Text>
      </div>
      <Button
        type="primary"
        icon={<CheckOutlined />}
        loading={saving}
        disabled={disabled}
        onClick={onSave}
        style={{ background: "#fff", color: "#2f4f46", borderColor: "#fff", flexShrink: 0 }}
      >
        Save to Brand Board
      </Button>
    </div>
  );
}
