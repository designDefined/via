import "./style/index.css";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { createStore } from "@viable/via";
import { Via } from "@viable/via-react";

const store = createStore();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Via store={store}>
    <RouterProvider router={router} />
  </Via>,
);
