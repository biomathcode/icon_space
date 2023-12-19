import { create } from "zustand";

import {
  insertIcon,
  deleteIconById,
  updateIconNameById,
  insertFolder,
  updateFolderNameById,
  deleteFolderById,
} from "../db"; // Import your actual database functions

interface Icon {
  id?: number;
  name: string;
  svg: string;
  index: number; // index will depend on folder
}

interface Tag {
  id: number;
  name: string;
  color: string;
}

interface Folder {
  id: number;
  name: string;
}

interface IconTag {
  icon_id: number;
  tag_id: number;
}

interface FolderIcon {
  folder_id: number;
  icon_id: number;
}

interface FeatureFlags {
  enableNewIconFeature: boolean;
  enableNewTagFeature: boolean;
  // Add more feature flags as needed
}

interface RenameIcon {
  id: number;
  newName: string;
}

interface State extends FeatureFlags {
  icons: Icon[];
  tags: Tag[];
  folders: Folder[];
  iconTags: IconTag[];
  folderIcons: FolderIcon[];
  addIcon: (icon: Icon) => void;
  addTag: (tag: Tag) => void;
  addFolder: (folder: Folder) => void;
  addIconTagRelation: (iconId: number, tagId: number) => void;
  addFolderIconRelation: (folderId: number, iconId: number) => void;
  renameIcon: (RenameIcon: RenameIcon) => void;
}

const useAppStore = create<State & FeatureFlags>((set) => ({
  enableNewIconFeature: true,
  enableNewTagFeature: true,
  icons: [],
  tags: [],
  folders: [],
  iconTags: [],
  folderIcons: [],
  addIcon: async ({ name, svg, index }) => {
    await insertIcon(name, svg);
    set((state) => ({
      icons: [...state.icons, { id: state.icons.length + 1, name, svg, index }],
    }));
  },

  renameIcon: async ({ id, newName }) => {
    try {
      await updateIconNameById(id, newName);

      set((state) => ({
        icons: state.icons.map((icon) =>
          icon.id === id ? { ...icon, name: newName } : icon
        ),
      }));
      console.log(`Icon with id ${id} renamed to ${newName}.`);
    } catch (error) {
      console.error(`Error renaming icon with id ${id}:`, error);
    }
  },

  removeIcon: async (id: number) => {
    await deleteIconById(id);
    set((state) => ({ icons: state.icons.filter((icon) => icon.id !== id) }));
  },

  addTag: (tag) => set((state) => ({ tags: [...state.tags, tag] })),
  addFolder: async (folder: Folder) => {
    await insertFolder(folder.name);
    set((state) => ({ folders: [...state.folders, folder] }));
  },
  renameFolder: async ({ id, name }: Folder) => {
    try {
      // Assume updateFolderNameById is an asynchronous function that updates the folder name in the SQLite database
      await updateFolderNameById(id, name);

      set((state) => ({
        folders: state.folders.map((folder) =>
          folder.id === id ? { ...folder, name: name } : folder
        ),
      }));

      console.log(`Folder with id ${id} renamed to ${name}.`);
    } catch (error) {
      console.error(`Error renaming folder with id ${id}:`, error);
    }
  },

  removeFolder: async (id: number) => {
    try {
      // Assume deleteFolderById is an asynchronous function that deletes the folder in the SQLite database
      await deleteFolderById(id);

      set((state) => ({
        folders: state.folders.filter((folder) => folder.id !== id),
      }));

      console.log(`Folder with id ${id} removed.`);
    } catch (error) {
      console.error(`Error removing folder with id ${id}:`, error);
    }
  },

  addIconTagRelation: (iconId, tagId) =>
    set((state) => ({
      iconTags: [...state.iconTags, { icon_id: iconId, tag_id: tagId }],
    })),
  addFolderIconRelation: (folderId, iconId) =>
    set((state) => ({
      folderIcons: [
        ...state.folderIcons,
        { folder_id: folderId, icon_id: iconId },
      ],
    })),
}));

export default useAppStore;
