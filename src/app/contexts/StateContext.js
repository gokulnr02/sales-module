"use client";
import { createContext, useContext } from "react";

export const StateContext = createContext();
StateContext.displayName = "StateContext";

export const useStateContext = () => useContext(StateContext);
