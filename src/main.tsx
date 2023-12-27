import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";

import { defaultTheme, Provider } from "@adobe/react-spectrum";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <Provider theme={defaultTheme}>
    <App />
  </Provider>
);
