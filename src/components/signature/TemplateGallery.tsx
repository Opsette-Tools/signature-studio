import { useMemo } from "react";
import { allTemplates } from "@/data/templates";
import type { SignatureData } from "@/types/signature";
import type { SignatureTemplate } from "@/types/template";
import { useFavorites } from "@/hooks/useFavorites";
import { SignatureCard } from "./SignatureCard";
import { EmptyState } from "@/components/ui/EmptyState";
import type { FilterState } from "./TemplateFilters";

type Props = {
  filters: FilterState;
  data: SignatureData;
  selectedId: string;
  onSelect: (id: string) => void;
};

function matches(t: SignatureTemplate, f: FilterState, isFav: (id: string) => boolean): boolean {
  if (f.category === "favorites" && !isFav(t.id)) return false;
  if (f.category !== "all" && f.category !== "favorites" && t.category !== f.category) return false;
  if (f.needsLogo && !t.supportsLogo) return false;
  if (f.needsPhoto && !t.supportsImage) return false;
  if (f.textOnly && (t.supportsImage || t.supportsLogo)) return false;
  if (f.query.trim()) {
    const q = f.query.toLowerCase();
    const hay = [t.name, t.category, t.description, ...t.tags].join(" ").toLowerCase();
    if (!hay.includes(q)) return false;
  }
  return true;
}

export function TemplateGallery({ filters, data, selectedId, onSelect }: Props) {
  const { isFavorite, toggle } = useFavorites();
  const filtered = useMemo(
    () => allTemplates.filter((t) => matches(t, filters, isFavorite)),
    [filters, isFavorite],
  );

  if (!filtered.length) {
    return <EmptyState title="No templates match your filters" />;
  }

  return (
    <div className="template-grid">
      {filtered.map((t) => (
        <SignatureCard
          key={t.id}
          template={t}
          data={data}
          active={t.id === selectedId}
          favorite={isFavorite(t.id)}
          onSelect={() => onSelect(t.id)}
          onToggleFavorite={() => toggle(t.id)}
        />
      ))}
    </div>
  );
}
