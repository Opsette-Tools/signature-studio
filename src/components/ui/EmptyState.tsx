import { Empty, type EmptyProps } from "antd";
import type { ReactNode } from "react";

type Props = {
  title?: string;
  description?: ReactNode;
  image?: EmptyProps["image"];
  children?: ReactNode;
};

export function EmptyState({ title, description, image, children }: Props) {
  return (
    <div className="empty-state">
      <Empty image={image} description={description || title || "Nothing here yet"} />
      {children ? <div style={{ marginTop: 12 }}>{children}</div> : null}
    </div>
  );
}
