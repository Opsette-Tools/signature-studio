import { App as AntApp, ConfigProvider, theme } from "antd";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider, useThemeMode } from "@/hooks/useThemeMode";
import { AppRoutes } from "./routes";
import { SignatureProvider } from "./SignatureContext";

const baseUrl = (import.meta.env.BASE_URL || "/").replace(/\/$/, "") || "/";

function ThemedApp() {
  const { mode } = useThemeMode();
  return (
    <ConfigProvider
      theme={{
        algorithm: mode === "dark" ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: "#4f46e5",
          borderRadius: 10,
          // Global size dial (see docs/MOBILE_AND_POLISH_REFACTOR.md, Tier 1).
          // Lifts every Ant input/button/select/tab/label app-wide; taller
          // controls give bigger tap targets on mobile. App UI only — the
          // signature render HTML stays hardcoded px on purpose.
          fontSize: 15,
          fontSizeLG: 17,
          fontSizeSM: 13,
          controlHeight: 40,
          controlHeightLG: 46,
          controlHeightSM: 32,
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
        },
      }}
    >
      <AntApp>
        <SignatureProvider>
          <BrowserRouter basename={baseUrl}>
            <AppRoutes />
          </BrowserRouter>
        </SignatureProvider>
      </AntApp>
    </ConfigProvider>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ThemedApp />
    </ThemeProvider>
  );
}
