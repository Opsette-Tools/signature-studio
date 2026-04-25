import type { ReactNode } from "react";

type Props = {
  title?: ReactNode;
  hint?: ReactNode;
  extra?: ReactNode;
  children: ReactNode;
};

export function SectionCard({ title, hint, extra, children }: Props) {
  return (
    <section className="section-card">
      {title || extra ? (
        <header className="section-card__title" style={{ justifyContent: "space-between" }}>
          <span>{title}</span>
          {extra}
        </header>
      ) : null}
      {hint ? <p className="section-card__hint">{hint}</p> : null}
      {children}
    </section>
  );
}
