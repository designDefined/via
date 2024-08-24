import "./style/index.css";
import ReactDOM from "react-dom/client";
import { Via } from "viajs-react";
import { createStore } from "viajs-core";
import Home from "./ui/home/Home";

const store = createStore();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Via store={store}>
    <Home />
  </Via>,
);
