import { createBrowserRouter } from "react-router-dom";
import FeConf from "../ui/fe-conf/FeConf";
import Home from "../ui/home/Home";

export const router = createBrowserRouter([
  { path: "", element: <Home /> },
  { path: "fe-conf", element: <FeConf /> },
]);
