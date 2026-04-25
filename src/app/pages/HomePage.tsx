import { useState } from "react";
import { CopyPanel } from "@/components/signature/CopyPanel";
import { SignatureForm } from "@/components/signature/SignatureForm";
import { SignaturePreview } from "@/components/signature/SignaturePreview";
import { TemplateFilters, type FilterState } from "@/components/signature/TemplateFilters";
import { TemplateGallery } from "@/components/signature/TemplateGallery";
import { SavedSignatures } from "@/components/signature/SavedSignatures";
import { SectionCard } from "@/components/ui/SectionCard";
import { useFavorites } from "@/hooks/useFavorites";
import { useSignatureContext } from "@/app/SignatureContext";

const initial: FilterState = {
  query: "",
  category: "all",
  needsLogo: false,
  needsPhoto: false,
  textOnly: false,
};

/** Single-page desktop view shown at /home (≥1024px). */
export function HomePage() {
  const {
    data,
    update,
    replaceAll,
    selectedTemplateId,
    setSelectedTemplateId,
    selectedTemplate,
  } = useSignatureContext();
  const { favorites } = useFavorites();
  const [filters, setFilters] = useState<FilterState>(initial);

  return (
    <div className="layout-grid">
      <div className="stack">
        <SectionCard title="Templates">
          <TemplateFilters value={filters} onChange={setFilters} favoritesCount={favorites.length} />
        </SectionCard>
        <TemplateGallery
          filters={filters}
          data={data}
          selectedId={selectedTemplateId}
          onSelect={setSelectedTemplateId}
        />
        <SignatureForm data={data} onChange={update} />
      </div>
      <div className="stack layout-grid__sticky">
        <SectionCard
          title={selectedTemplate ? `Preview · ${selectedTemplate.name}` : "Preview"}
        >
          <SignaturePreview template={selectedTemplate} data={data} />
        </SectionCard>
        <CopyPanel template={selectedTemplate} data={data} />
        <SavedSignatures
          currentTemplateId={selectedTemplateId}
          currentData={data}
          onLoad={(entry) => {
            replaceAll(entry.data);
            setSelectedTemplateId(entry.templateId);
          }}
        />
      </div>
    </div>
  );
}
