"use client";
import { createContext, useContext } from "react";

export const ItemContext = createContext();
ItemContext.displayName = "ItemContext";

export const useItem = () => useContext(ItemContext);
