import { AppstoreOutlined, CopyOutlined, EyeOutlined } from "@ant-design/icons";
import { Drawer, Grid } from "antd";
import { useState } from "react";
import { CopyPanel } from "@/components/signature/CopyPanel";
import { SavedSignatures } from "@/components/signature/SavedSignatures";
import { SignatureForm } from "@/components/signature/SignatureForm";
import { SignaturePreview } from "@/components/signature/SignaturePreview";
import { TemplateFilters, type FilterState } from "@/components/signature/TemplateFilters";
import { TemplateGallery } from "@/components/signature/TemplateGallery";
import { TemplateStrip } from "@/components/signature/TemplateStrip";
import { SectionCard } from "@/components/ui/SectionCard";
import { useFavorites } from "@/hooks/useFavorites";
import { useSignatureContext } from "@/app/SignatureContext";

const initialFilters: FilterState = {
  query: "",
  category: "all",
  needsLogo: false,
  needsPhoto: false,
  textOnly: false,
};

export function StudioPage() {
  const {
    data,
    update,
    replaceAll,
    selectedTemplateId,
    setSelectedTemplateId,
    selectedTemplate,
  } = useSignatureContext();
  const { favorites } = useFavorites();
  const screens = Grid.useBreakpoint();
  const isDesktop = Boolean(screens.lg);

  const [browseOpen, setBrowseOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [copyOpen, setCopyOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  const browseGallery = (
    <div className="stack">
      <TemplateFilters value={filters} onChange={setFilters} favoritesCount={favorites.length} />
      <TemplateGallery
        filters={filters}
        data={data}
        selectedId={selectedTemplateId}
        onSelect={(id) => {
          setSelectedTemplateId(id);
          setBrowseOpen(false);
        }}
      />
    </div>
  );

  const previewBlock = (
    <SectionCard title={selectedTemplate ? `Preview · ${selectedTemplate.name}` : "Preview"}>
      <SignaturePreview template={selectedTemplate} data={data} />
    </SectionCard>
  );

  const copyBlock = <CopyPanel template={selectedTemplate} data={data} />;

  return (
    <div className="studio">
      <TemplateStrip
        data={data}
        selectedId={selectedTemplateId}
        onSelect={setSelectedTemplateId}
        onBrowseAll={() => setBrowseOpen(true)}
      />

      <div className="studio__grid">
        <div className="studio__left stack">
          <SignatureForm data={data} onChange={update} />
          <SavedSignatures
            currentTemplateId={selectedTemplateId}
            currentData={data}
            onLoad={(entry) => {
              replaceAll(entry.data);
              setSelectedTemplateId(entry.templateId);
            }}
          />
        </div>
        {isDesktop ? (
          <div className="studio__right stack">
            {previewBlock}
            {copyBlock}
          </div>
        ) : null}
      </div>

      <Drawer
        title="Browse all templates"
        placement="right"
        width={Math.min(960, typeof window !== "undefined" ? window.innerWidth : 960)}
        open={browseOpen}
        onClose={() => setBrowseOpen(false)}
        destroyOnHidden
      >
        {browseGallery}
      </Drawer>

      <Drawer
        title={selectedTemplate ? `Preview · ${selectedTemplate.name}` : "Preview"}
        placement="bottom"
        height="85%"
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        destroyOnHidden
      >
        <SignaturePreview template={selectedTemplate} data={data} />
      </Drawer>

      <Drawer
        title="Copy & export"
        placement="bottom"
        height="90%"
        open={copyOpen}
        onClose={() => setCopyOpen(false)}
        destroyOnHidden
      >
        {copyBlock}
      </Drawer>

      {!isDesktop ? (
        <nav className="mobile-action-bar" aria-label="Signature actions">
          <button type="button" onClick={() => setBrowseOpen(true)}>
            <AppstoreOutlined />
            <span>Templates</span>
          </button>
          <button type="button" onClick={() => setPreviewOpen(true)}>
            <EyeOutlined />
            <span>Preview</span>
          </button>
          <button
            type="button"
            className="mobile-action-bar__primary"
            onClick={() => setCopyOpen(true)}
          >
            <CopyOutlined />
            <span>Copy</span>
          </button>
        </nav>
      ) : null}
    </div>
  );
}
