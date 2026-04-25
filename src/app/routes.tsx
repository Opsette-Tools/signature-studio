import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { EditPage } from "./pages/EditPage";
import { HomePage } from "./pages/HomePage";
import { PreviewPage } from "./pages/PreviewPage";
import { SavedPage } from "./pages/SavedPage";
import { TemplatesPage } from "./pages/TemplatesPage";

const DESKTOP_BREAKPOINT = 1024;

function useIsDesktop(): boolean {
  const [isDesktop, setIsDesktop] = useState<boolean>(() =>
    typeof window !== "undefined" ? window.innerWidth >= DESKTOP_BREAKPOINT : false,
  );
  useEffect(() => {
    const mql = window.matchMedia(`(min-width: ${DESKTOP_BREAKPOINT}px)`);
    const onChange = () => setIsDesktop(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);
  return isDesktop;
}

/**
 * On desktop (≥1024px) every section route renders the combined two-column
 * HomePage so the live preview is always visible alongside templates/edit/saved.
 * On mobile/tablet, each tab renders its focused per-section page.
 */
export function AppRoutes() {
  const isDesktop = useIsDesktop();
  const Templates = isDesktop ? HomePage : TemplatesPage;
  const Edit = isDesktop ? HomePage : EditPage;
  const Preview = isDesktop ? HomePage : PreviewPage;
  const Saved = isDesktop ? HomePage : SavedPage;

  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<Navigate to="/templates" replace />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/templates" element={<Templates />} />
        <Route path="/edit" element={<Edit />} />
        <Route path="/preview" element={<Preview />} />
        <Route path="/saved" element={<Saved />} />
        <Route path="*" element={<Navigate to="/templates" replace />} />
      </Route>
    </Routes>
  );
}
