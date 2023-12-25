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
  getAllFolders,
  linkIconToFolder,
} from "../db"; // Import your actual database functions

interface Icon {
  id?: number;
  name: string;
  svg: string;
  indx?: number; // index will depend on folder
  folderId?: number;
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

interface FolderSelected {
  folder_id: number;
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
  iconSelected: number;
  setIconSelected: (icon_id: number) => void;

  folderSelected: number;
  setFolderSelected: (folder_id: number) => void;
  setIcons: () => void;
  setFolders: () => void;
  addIcon: (icon: Icon) => void;
  addTag: (tag: Tag) => void;
  addFolder: (folder: { name: string }) => void;
  addIconTagRelation: (iconId: number, tagId: number) => void;
  addFolderIconRelation: (folderId: number, iconId: number) => void;
  renameIcon: (RenameIcon: RenameIcon) => void;
  removeIcon: (id: number) => void;
  removeTag: (tagId: number) => void;
  swapIcons: (indices: { index1: number; index2: number }) => Promise<void>;
}

const useAppStore = create<State & FeatureFlags>((set, get) => ({
  enableNewIconFeature: true,
  enableNewTagFeature: true,
  icons: [],
  tags: [],
  folders: [],
  iconTags: [],
  folderIcons: [],
  iconVersions: [], // get the icon and get the first version
  folderSelected: 1,
  iconSelected: 1,
  setIconVersions: () => {
    // TODO: get data from database and seticons
  },
  addIconVersion: () => {
    // TODO: addbranch to the iconversion
  },
  removeIconVersion: () => {
    // TODO: removeicon from the iconversion
  },
  setFolderSelected: (folder_id) => {
    set({ folderSelected: folder_id });
  },
  setIconSelected: (icon_id) => {
    set({ iconSelected: icon_id });
  },
  setFolders: async () => {
    const getFolders = (await getAllFolders()) as Folder[];
    set({ folders: getFolders });
  },

  setIcons: async () => {
    const getData = (await getAllIcons(get().folderSelected)) as Icon[];

    set({
      icons: getData,
    });
  },

  addIcon: async ({ name, svg, indx }) => {
    const icons = get().icons as Icon[];

    const icon = await insertIcon(name, svg, icons.length + 1);

    console.log("insertIcons", icon.lastInsertId);

    if (icon.lastInsertId) {
      await linkIconToFolder(get().folderSelected, icon.lastInsertId);
    }

    const data = (await getAllIcons(get().folderSelected)) as Icon[];

    set({
      icons: [...data],
    });
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
  addFolder: async ({ name }: { name: string }) => {
    await insertFolder(name);

    get().setFolders();
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
        console.log(
          "outside closure icon1",
          icon1?.id,
          icon2?.id,
          index1,
          index2
        );

        // If both icons are found, update their indices
        if (icon1?.id && icon2?.id) {
          console.log(
            "inside closure icon1",
            icon1.id,
            icon2.id,
            index1,
            index2
          );
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
