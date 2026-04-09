import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import Layout from "./components/Layout.tsx";
import "./index.css";

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- root element is guaranteed in index.html
createRoot(document.getElementById("root")!).render(
  <Layout>
    <App />
  </Layout>,
);
