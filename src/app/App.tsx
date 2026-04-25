import { App as AntApp, ConfigProvider, theme } from "antd";
import { BrowserRouter } from "react-router-dom";
import { useThemeMode } from "@/hooks/useThemeMode";
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
  return <ThemedApp />;
}
