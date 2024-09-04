import "./style/index.css";
import ReactDOM from "react-dom/client";
import { Via } from "viajs-react";
import { createStore } from "viajs-core";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";

const store = createStore();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Via store={store}>
    <RouterProvider router={router} />
  </Via>,
);
