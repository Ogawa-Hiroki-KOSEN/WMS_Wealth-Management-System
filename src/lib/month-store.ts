import { create } from "zustand";

type MonthState = {
  year: number;
  month: number;
  setMonth: (year: number, month: number) => void;
};

const now = new Date();

export const useMonth = create<MonthState>((set) => ({
  year: now.getFullYear(),
  month: now.getMonth(),
  setMonth: (year, month) => set({ year, month }),
}));
