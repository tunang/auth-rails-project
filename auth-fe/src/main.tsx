import { createRoot } from "react-dom/client";
import "./index.css";
import { Toaster } from "sonner";
import { store } from "./store/index.ts";
import App from "./App.tsx";
import { Provider } from "react-redux";

createRoot(document.getElementById("root")!).render(
  <>
    <Provider store={store}>
      <App /> {/* Use App wrapper instead of AppRoutes directly */}
    </Provider>
    <Toaster
      position="top-left"
      richColors={false}
      expand={true}
      closeButton
      toastOptions={{
        duration: 4000,
        style: {
          fontSize: "14px",
          fontWeight: "500",
        },
        className: "toast",
      }}
      theme="light"
    />
  </>
);