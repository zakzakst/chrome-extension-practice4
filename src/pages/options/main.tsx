import { StrictMode } from "react";

import "../../global.css";
import App from "./App";
import { Toaster } from "@/components/ui/sonner";
import { createRoot } from "react-dom/client";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
    <Toaster />
  </StrictMode>,
);
