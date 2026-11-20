import { Provider } from "@/components/ui/provider";
import { Toaster } from "@/components/ui/toaster";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

document.querySelectorAll("[data-initial-ogp]").forEach((element) => element.remove());

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <Provider>
            <App />
            <Toaster />
        </Provider>
    </StrictMode>,
);
