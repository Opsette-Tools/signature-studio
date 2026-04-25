import { Drawer } from "antd";
import type { ReactNode } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  children: ReactNode;
  height?: string | number;
};

export function MobileDrawer({ open, onClose, title, children, height = "85%" }: Props) {
  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={title}
      placement="bottom"
      height={height}
      destroyOnClose
    >
      {children}
    </Drawer>
  );
}
