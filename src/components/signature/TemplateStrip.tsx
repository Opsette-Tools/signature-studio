import { AppstoreOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Button, Select, Tooltip } from "antd";
import { useEffect, useMemo, useRef, useState } from "react";
import { allTemplates } from "@/data/templates";
import type { SignatureData } from "@/types/signature";
import { CATEGORY_LABELS, type TemplateCategory } from "@/types/template";

type Props = {
  data: SignatureData;
  selectedId: string;
  onSelect: (id: string) => void;
  onBrowseAll: () => void;
};

type CategoryFilter = TemplateCategory | "all";

const categoryOptions: { value: CategoryFilter; label: string }[] = [
  { value: "all", label: "All categories" },
  ...(Object.entries(CATEGORY_LABELS) as [TemplateCategory, string][]).map(
    ([value, label]) => ({ value, label }),
  ),
];

export function TemplateStrip({ data, selectedId, onSelect, onBrowseAll }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [category, setCategory] = useState<CategoryFilter>("all");

  const items = useMemo(
    () => (category === "all" ? allTemplates : allTemplates.filter((t) => t.category === category)),
    [category],
  );

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const active = track.querySelector<HTMLButtonElement>(
      `[data-template-id="${selectedId}"]`,
    );
    if (active) {
      active.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }, [selectedId, category]);

  const scroll = (dir: -1 | 1) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: dir * 320, behavior: "smooth" });
  };

  return (
    <div className="template-strip">
      <div className="template-strip__head">
        <div className="template-strip__title">Template</div>
        <div className="template-strip__head-actions">
          <Select
            size="small"
            value={category}
            onChange={(v) => setCategory(v)}
            options={categoryOptions}
            style={{ minWidth: 150 }}
            popupMatchSelectWidth={false}
          />
          <Button size="small" icon={<AppstoreOutlined />} onClick={onBrowseAll}>
            Browse all {allTemplates.length}
          </Button>
        </div>
      </div>
      <div className="template-strip__body">
        <Tooltip title="Previous">
          <Button
            className="template-strip__nav template-strip__nav--left"
            shape="circle"
            size="small"
            icon={<LeftOutlined />}
            onClick={() => scroll(-1)}
            aria-label="Scroll templates left"
          />
        </Tooltip>
        <div className="template-strip__track" ref={trackRef}>
          {items.length === 0 ? (
            <div className="template-strip__empty">No templates in this category.</div>
          ) : (
            items.map((t) => {
              const active = t.id === selectedId;
              return (
                <button
                  key={t.id}
                  type="button"
                  data-template-id={t.id}
                  className={`template-strip__card${active ? " template-strip__card--active" : ""}`}
                  onClick={() => onSelect(t.id)}
                  aria-pressed={active}
                  title={t.name}
                >
                  <div className="template-strip__thumb">
                    <div
                      className="template-strip__thumb-inner"
                      dangerouslySetInnerHTML={{ __html: t.renderHtml(data) }}
                    />
                  </div>
                  <div className="template-strip__name">{t.name}</div>
                </button>
              );
            })
          )}
        </div>
        <Tooltip title="Next">
          <Button
            className="template-strip__nav template-strip__nav--right"
            shape="circle"
            size="small"
            icon={<RightOutlined />}
            onClick={() => scroll(1)}
            aria-label="Scroll templates right"
          />
        </Tooltip>
      </div>
    </div>
  );
}
