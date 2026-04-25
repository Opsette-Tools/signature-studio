import { Checkbox, Input, Segmented } from "antd";
import { CATEGORY_LABELS, type TemplateCategory } from "@/types/template";

export type FilterState = {
  query: string;
  category: TemplateCategory | "all" | "favorites";
  needsLogo: boolean;
  needsPhoto: boolean;
  textOnly: boolean;
};

type Props = {
  value: FilterState;
  onChange: (next: FilterState) => void;
  favoritesCount: number;
};

const categoryOptions = [
  { label: "All", value: "all" },
  { label: `★ ${"Favorites"}`, value: "favorites" },
  ...Object.entries(CATEGORY_LABELS).map(([k, v]) => ({ label: v, value: k })),
];

export function TemplateFilters({ value, onChange, favoritesCount }: Props) {
  return (
    <div className="filters-bar">
      <Input.Search
        allowClear
        placeholder="Search by name, tag, or category"
        value={value.query}
        onChange={(e) => onChange({ ...value, query: e.target.value })}
      />
      <div style={{ overflowX: "auto" }}>
        <Segmented
          value={value.category}
          onChange={(v) => onChange({ ...value, category: v as FilterState["category"] })}
          options={categoryOptions.map((o) =>
            o.value === "favorites"
              ? { label: `★ Favorites (${favoritesCount})`, value: "favorites" }
              : o,
          )}
        />
      </div>
      <div className="filters-bar__row">
        <Checkbox
          checked={value.needsLogo}
          onChange={(e) => onChange({ ...value, needsLogo: e.target.checked })}
        >
          Supports logo
        </Checkbox>
        <Checkbox
          checked={value.needsPhoto}
          onChange={(e) => onChange({ ...value, needsPhoto: e.target.checked })}
        >
          Supports photo
        </Checkbox>
        <Checkbox
          checked={value.textOnly}
          onChange={(e) => onChange({ ...value, textOnly: e.target.checked })}
        >
          Text-only
        </Checkbox>
      </div>
    </div>
  );
}
