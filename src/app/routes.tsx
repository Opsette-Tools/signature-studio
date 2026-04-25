import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { EditPage } from "./pages/EditPage";
import { HomePage } from "./pages/HomePage";
import { PreviewPage } from "./pages/PreviewPage";
import { SavedPage } from "./pages/SavedPage";
import { TemplatesPage } from "./pages/TemplatesPage";

/**
 * On desktop (≥1024px) we show HomePage as a single combined view at all four
 * routes via CSS — but to keep things simple we always render route-specific
 * pages here. The bottom nav is hidden on desktop in CSS, and HomePage isn't
 * routed; the per-section pages are designed to look good at any width.
 */
export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<Navigate to="/templates" replace />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/templates" element={<TemplatesPage />} />
        <Route path="/edit" element={<EditPage />} />
        <Route path="/preview" element={<PreviewPage />} />
        <Route path="/saved" element={<SavedPage />} />
        <Route path="*" element={<Navigate to="/templates" replace />} />
      </Route>
    </Routes>
  );
}
