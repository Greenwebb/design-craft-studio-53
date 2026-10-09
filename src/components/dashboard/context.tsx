import { createContext, useContext } from "react";
import { getStudio, type PreviewState } from "@/data/dashboard";
export type StudioContextValue = ReturnType<typeof getStudio> & {
  state: PreviewState;
  openCreate: () => void;
};
export const StudioContext = createContext<StudioContextValue | null>(null);
export function useStudio() {
  const value = useContext(StudioContext);
  if (!value) throw new Error("Studio layout is required");
  return value;
}
