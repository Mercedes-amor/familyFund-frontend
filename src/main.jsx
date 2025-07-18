import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

import { BrowserRouter } from "react-router-dom";
import { ThemeWrapper } from "./context/theme.context.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ThemeWrapper>
      <App />
    </ThemeWrapper>
  </BrowserRouter>
);
