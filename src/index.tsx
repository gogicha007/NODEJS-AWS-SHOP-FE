import React from "react";
import { createRoot } from "react-dom/client";
import App from "~/components/App/App";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { BrowserRouter } from "react-router-dom";
import { QueryCache, QueryClient, QueryClientProvider, MutationCache } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { theme } from "~/theme";
import axios from "axios";

const handleAuthError = (error: unknown) => {
  if (!axios.isAxiosError(error)) return;
  const status = error.response?.status;
  if (status === 401) window.alert("Unauthorized");
  if (status === 403) window.alert("Forbidden");
};

const queryClient = new QueryClient({
  queryCache: new QueryCache({ onError: handleAuthError}),
  mutationCache: new MutationCache({ onError: handleAuthError}),
  defaultOptions: {
    queries: { refetchOnWindowFocus: false, retry: false, staleTime: Infinity },
  },
});

if (import.meta.env.DEV) {
  const { worker } = await import("./mocks/browser");
  worker.start({ onUnhandledRequest: "bypass" });
}

localStorage.setItem("authorization_token", "Z29naWNoYTAwNzpURVNUX1BBU1NXT1JE");

const container = document.getElementById("app");
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <BrowserRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <App />
        </ThemeProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
