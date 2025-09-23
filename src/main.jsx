import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

import { BrowserRouter } from "react-router-dom";
import { ThemeWrapper } from "./context/theme.context.jsx";
import { UserProvider } from "./context/UserContext.jsx"; // <-- importar UserProvider


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <UserProvider>         
        <ThemeWrapper>
          <App />
        </ThemeWrapper>
      </UserProvider>
    </BrowserRouter>
  </StrictMode>
);
