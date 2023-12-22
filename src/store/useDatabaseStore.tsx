import { create } from "zustand";

import {
  insertIcon,
  deleteIconById,
  updateIconNameById,
  insertFolder,
  updateFolderNameById,
  deleteFolderById,
  deleteTagById,
  swapIconIndexInDatabase,
  getAllIcons,
} from "../db"; // Import your actual database functions

interface Icon {
  id?: number;
  name: string;
  svg: string;
  indx?: number; // index will depend on folder
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

interface IconVersion {
  version_id: number;
  icon_id: number;
  parent_version_id?: number | null; // Nullable to represent the root
  name?: string;
  svg?: string;
  index?: number;
  created_at: string;
}

interface State extends FeatureFlags {
  icons: Icon[];
  tags: Tag[];
  folders: Folder[];
  iconTags: IconTag[];
  folderIcons: FolderIcon[];
  iconVersions: IconVersion[];
  setIcons: () => void;
  addIcon: (icon: Icon) => void;
  addTag: (tag: Tag) => void;
  addFolder: (folder: Folder) => void;
  addIconTagRelation: (iconId: number, tagId: number) => void;
  addFolderIconRelation: (folderId: number, iconId: number) => void;
  renameIcon: (RenameIcon: RenameIcon) => void;
  removeTag: (tagId: number) => void;
}

const useAppStore = create<State & FeatureFlags>((set) => ({
  enableNewIconFeature: true,
  enableNewTagFeature: true,
  icons: [],
  tags: [],
  folders: [],
  iconTags: [],
  folderIcons: [],
  iconVersions: [], // get the icon and get the first version

  setIcons: async () => {
    const getData = (await getAllIcons()) as Icon[];

    set((state) => ({
      icons: getData,
    }));
  },

  addIcon: async ({ name, svg, indx }) => {
    const data = (await getAllIcons()) as Icon[];
    await insertIcon(name, svg, data.length + 1);

    set((state) => ({
      icons: [...data],
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
  removeTag: async (tagId: number) => {
    await deleteTagById(tagId);
    set((state) => ({ tags: state.tags.filter((tag) => tag.id !== tagId) }));
  },
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

  swapIcons: async ({ index1, index2 }: { index1: number; index2: number }) => {
    try {
      set((state) => {
        // Find icons with the specified indices
        const icon1 = state.icons.find((icon) => icon.indx === index1);
        const icon2 = state.icons.find((icon) => icon.indx === index2);

        // If both icons are found, update their indices
        if (icon1?.id && icon2?.id) {
          swapIconIndexInDatabase(icon1.id, icon2.id, index1, index2);

          const updatedIcons = state.icons.map((icon) => {
            if (icon.id === icon1.id) {
              return { ...icon, index: index2 };
            } else if (icon.id === icon2.id) {
              return { ...icon, index: index1 };
            }
            return icon;
          });

          return { icons: updatedIcons };
        }

        // If either icon is not found, return the current state
        return state;
      });

      console.log(`Icons with indices ${index1} and ${index2} swapped.`);
    } catch (error) {
      console.error("Error swapping icons:", error);
    }
  },
}));

export default useAppStore;
