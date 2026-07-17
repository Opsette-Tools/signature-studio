import { AppstoreOutlined, CopyOutlined, EyeOutlined } from "@ant-design/icons";
import { App as AntApp, Drawer, Grid, Segmented } from "antd";
import { useEffect, useMemo, useRef, useState } from "react";
import { CopyPanel } from "@/components/signature/CopyPanel";
import { DemoBanner } from "@/components/signature/DemoBanner";
import { EmbedSaveBar } from "@/components/signature/EmbedSaveBar";
import { SavedSignatures } from "@/components/signature/SavedSignatures";
import { SignatureForm } from "@/components/signature/SignatureForm";
import { SignaturePreview, type PreviewCanvas } from "@/components/signature/SignaturePreview";
import { TemplateFilters, type FilterState } from "@/components/signature/TemplateFilters";
import { TemplateGallery } from "@/components/signature/TemplateGallery";
import { TemplateStrip } from "@/components/signature/TemplateStrip";
import { SectionCard } from "@/components/ui/SectionCard";
import { useFavorites } from "@/hooks/useFavorites";
import { useSignatureContext } from "@/app/SignatureContext";
import { fromKitJson, toKitJson } from "@/utils/brandKit";
import {
  isEmbedded,
  isTrustedEmbedMessage,
  embedSave,
  OPSETTE_TOOLS_ORIGIN,
} from "@/utils/opsette-kit-link";

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
  const [canvas, setCanvas] = useState<PreviewCanvas>("light");
  const { message } = AntApp.useApp();

  // ── Mechanism 3: running inside a Brand Board iframe ──────────────────────
  const embedded = useMemo(() => isEmbedded(), []);
  const trustedParentOrigins = useMemo(
    () => (import.meta.env.DEV ? [window.location.origin, "http://localhost:8124"] : []),
    [],
  );
  const [saving, setSaving] = useState(false);

  // Inbound: the parent hands us the current signature blob to revise. Restore
  // via the same context setters the reopen path uses — WITHOUT the router
  // navigate() the reopen modal does (surprising inside an iframe). Origin-checked.
  //
  // CRITICAL: this effect must bind exactly ONCE. `setSelectedTemplateId` (and
  // potentially `replaceAll`) are recreated every render by the context, so
  // depending on them would re-run this effect → re-post `ready` → the parent
  // re-sends `load` → resets state → re-render → an infinite load loop (the
  // "preview twitches, can't pick a template" bug). We stash the handler in a ref
  // and depend only on the stable embed flags, so `ready` fires once and a
  // template pick sticks.
  const applyLoadRef = useRef<(raw: string) => void>(() => {});
  applyLoadRef.current = (raw: string) => {
    const reopened = fromKitJson(raw);
    if (reopened) {
      replaceAll(reopened.signature);
      setSelectedTemplateId(reopened.templateId);
    }
  };
  // Only apply the FIRST load the parent sends. Later re-sends (e.g. if the
  // parent re-emits) must not clobber edits in progress inside the frame.
  const loadedOnceRef = useRef(false);
  useEffect(() => {
    if (!embedded) return;
    const onMessage = (event: MessageEvent) => {
      if (!isTrustedEmbedMessage(event, trustedParentOrigins)) return;
      if (event.data.kind === "load" && typeof event.data.payload === "string") {
        if (loadedOnceRef.current) return;
        loadedOnceRef.current = true;
        applyLoadRef.current(event.data.payload);
      }
    };
    window.addEventListener("message", onMessage);
    window.parent.postMessage({ source: "opsette-embed", kind: "ready" }, "*");
    return () => window.removeEventListener("message", onMessage);
  }, [embedded, trustedParentOrigins]);

  // Outbound: build the same blob "Export to Brand Board" produces and post it up.
  const saveToBrandBoard = () => {
    if (!selectedTemplate) {
      message.error("Pick a template first.");
      return;
    }
    setSaving(true);
    try {
      const payload = toKitJson(selectedTemplate, data);
      const targetOrigin = import.meta.env.DEV ? "*" : OPSETTE_TOOLS_ORIGIN;
      window.parent.postMessage(embedSave(JSON.stringify(payload)), targetOrigin);
      message.success("Updated in Brand Board");
    } catch {
      message.error("Couldn't send the signature back — try again.");
    } finally {
      setSaving(false);
    }
  };

  const canvasToggle = (
    <Segmented
      size="small"
      value={canvas}
      onChange={(v) => setCanvas(v as PreviewCanvas)}
      options={[
        { label: "Light inbox", value: "light" },
        { label: "Dark inbox", value: "dark" },
      ]}
    />
  );

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
    <SectionCard
      title={selectedTemplate ? `Preview · ${selectedTemplate.name}` : "Preview"}
      extra={canvasToggle}
    >
      <SignaturePreview template={selectedTemplate} data={data} canvas={canvas} />
    </SectionCard>
  );

  const copyBlock = <CopyPanel template={selectedTemplate} data={data} />;

  return (
    <div className="studio">
      {embedded && (
        <EmbedSaveBar
          onSave={saveToBrandBoard}
          saving={saving}
          disabled={!selectedTemplate}
        />
      )}
      <DemoBanner />
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
            onReopen={(templateId, reopened) => {
              replaceAll(reopened);
              setSelectedTemplateId(templateId);
            }}
          />
        </div>
        {isDesktop ? (
          <div className="studio__right stack">
            {previewBlock}
            {copyBlock}
          </div>
        ) : embedded ? (
          // Embedded but narrow: still show the preview inline so the user sees
          // the signature they're editing (the copy panel is replaced by the
          // embed save bar, so it's intentionally omitted here).
          <div className="studio__right stack">{previewBlock}</div>
        ) : null}
      </div>

      <Drawer
        title="Browse all templates"
        placement="right"
        width={Math.min(960, typeof window !== "undefined" ? window.innerWidth : 960)}
        open={browseOpen}
        onClose={() => setBrowseOpen(false)}
        styles={{ body: { padding: isDesktop ? 24 : 12 } }}
        destroyOnHidden
      >
        {browseGallery}
      </Drawer>

      <Drawer
        title={selectedTemplate ? `Preview · ${selectedTemplate.name}` : "Preview"}
        placement="bottom"
        height="92%"
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        // Trim the drawer's own body padding on mobile so the preview reclaims
        // the side space — the inbox frame supplies its own (smaller) padding.
        styles={{
          body: {
            overflowY: "auto",
            WebkitOverflowScrolling: "touch",
            padding: 12,
          },
        }}
        destroyOnHidden
      >
        <div style={{ marginBottom: 12 }}>{canvasToggle}</div>
        <SignaturePreview template={selectedTemplate} data={data} canvas={canvas} />
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
