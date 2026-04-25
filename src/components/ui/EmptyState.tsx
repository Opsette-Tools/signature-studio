import { Empty, type EmptyProps } from "antd";
import { forwardRef, type ReactNode } from "react";

type Props = {
  title?: string;
  description?: ReactNode;
  image?: EmptyProps["image"];
  children?: ReactNode;
};

export const EmptyState = forwardRef<HTMLDivElement, Props>(function EmptyState(
  { title, description, image, children },
  ref,
) {
  return (
    <div className="empty-state" ref={ref}>
      <Empty image={image} description={description || title || "Nothing here yet"} />
      {children ? <div style={{ marginTop: 12 }}>{children}</div> : null}
    </div>
  );
});
