"use client";
import { createContext, useContext } from "react";

export const SupplierContext = createContext();
SupplierContext.displayName = "SupplierContext";

export const useSupplier = () => useContext(SupplierContext);
