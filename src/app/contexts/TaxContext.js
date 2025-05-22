"use client";
import { createContext, useContext } from "react";

export const TaxContext = createContext();
TaxContext.displayName = "TaxContext";

export const useTax = () => useContext(TaxContext);
