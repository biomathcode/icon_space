import { create } from "zustand";

import { insertIcon, deleteIconById, updateIconNameById } from "../db"; // Import your actual database functions

interface DatabaseState {
  icons: { id: number; name: string; svg: string }[];
  addIcon: (name: string, svg: string) => Promise<void>;
  removeIcon: (id: number) => Promise<void>;
  renameIcon: (id: number, newName: string) => Promise<void>;
}

export const useDatabaseStore = create<DatabaseState>((set) => ({
  icons: [],

  addIcon: async (name, svg) => {
    await insertIcon(name, svg);
    set((state) => ({
      icons: [...state.icons, { id: state.icons.length + 1, name, svg }],
    }));
  },

  renameIcon: async (id, newName) => {
    try {
      await updateIconNameById(id, newName);
      console.log(`Icon with id ${id} renamed to ${newName}.`);
    } catch (error) {
      console.error(`Error renaming icon with id ${id}:`, error);
    }
  },

  removeIcon: async (id) => {
    await deleteIconById(id);
    set((state) => ({ icons: state.icons.filter((icon) => icon.id !== id) }));
  },
}));
