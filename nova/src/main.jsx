import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./App/store.js";
import { GlobalContextProvider } from "./Context/GlobalContext.jsx";
import ErrorBoundary from "./Components/Common/ErrorBoundary.jsx";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <BrowserRouter>
      <StrictMode>
        <GlobalContextProvider>
          <ErrorBoundary>
            <App />
          </ErrorBoundary>
        </GlobalContextProvider>
      </StrictMode>
    </BrowserRouter>
  </Provider>,
);
