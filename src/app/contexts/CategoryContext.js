"use client";
import { createContext, useContext } from "react";

export const CategoryContext = createContext();
CategoryContext.displayName = "CategoryContext";

export const useCategory = () => useContext(CategoryContext);
