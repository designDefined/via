import { createBrowserRouter } from "react-router-dom";
import FeConf from "../ui/fe-conf/FeConf";
import { HomePage } from "../ui/home/page";

export const router = createBrowserRouter([
  { path: "", element: <HomePage /> },
  { path: "fe-conf", element: <FeConf /> },
]);
