import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { SavedPage } from "./pages/SavedPage";
import { SharePage } from "./pages/SharePage";
import { StudioPage } from "./pages/StudioPage";
import { TemplatesPage } from "./pages/TemplatesPage";

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<StudioPage />} />
        <Route path="/templates" element={<TemplatesPage />} />
        <Route path="/saved" element={<SavedPage />} />
        <Route path="/share" element={<SharePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
