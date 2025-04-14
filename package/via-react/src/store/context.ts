import { Store } from "@viable/via";
import { createContext } from "react";

export const ViaContext = createContext<Store | null>(null);
