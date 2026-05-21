import { StrictMode } from "react";
import { Toaster } from "@/components/ui/sonner";

import App from "./App";
import "../../global.css";
import { createRoot } from "react-dom/client";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
    <Toaster />
  </StrictMode>,
);
