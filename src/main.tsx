import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createHashRouter, RouterProvider } from "react-router-dom";

import { ThemeProvider } from "@/hooks/theme-provider.tsx";
import "@/i18n.ts";
import "@/index.css";
import App from "@/routes/app.tsx";
import PalApp from "@/routes/pal.tsx";
import Root from "@/routes/root.tsx";
import Swd2eApp from "@/routes/swd-2e.tsx";

const router = createHashRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "",
        element: <App />,
      },
      {
        path: "pal",
        element: <PalApp />,
      },
      {
        path: "swd-2e",
        element: <Swd2eApp />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>,
);
