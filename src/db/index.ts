import toast from "react-hot-toast";
import Database from "tauri-plugin-sql-api";

export const databaseName = "track3.db";

let dbInstance: Database;

export async function getDatabase(): Promise<Database> {
  if (dbInstance) {
    return dbInstance;
  }
  dbInstance = await Database.load(`sqlite:${databaseName}`);
  return dbInstance;
}

export const handleInitializeDatabase = async () => {
  const db = await getDatabase();

  try {
    await db.execute(`
    CREATE TABLE IF NOT EXISTS icons (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      svg TEXT NOT NULL,
      indx INTEGER 
    );
  `);

    await db.execute(`
      CREATE TABLE IF NOT EXISTS folders (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        indx INTEGER 
      );
`);

    await db.execute(`
    CREATE TABLE IF NOT EXISTS folderIcons (
      folder_id INTEGER,
      icon_id INTEGER,
      PRIMARY KEY (folder_id, icon_id),
      FOREIGN KEY (folder_id) REFERENCES folders(id) ON DELETE CASCADE,
      FOREIGN KEY (icon_id) REFERENCES icons(id) ON DELETE CASCADE
    );

    `);

    // create tags
    await db.execute(`
    CREATE TABLE IF NOT EXISTS tags (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL
    );
    `);

    // create tags icon
    // Table for Icons-Tags relationship (Many-to-Many)

    await db.execute(`
    CREATE TABLE IF NOT EXISTS iconTags (
      icon_id INTEGER,
      tag_id INTEGER,
      PRIMARY KEY (icon_id, tag_id),
      FOREIGN KEY (icon_id) REFERENCES icons(id) ON DELETE CASCADE,
      FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
    );
    `);

    await db.execute(`
    CREATE TABLE IF NOT EXISTS iconVersions (
      version_id INTEGER PRIMARY KEY,
      icon_id INTEGER,
      parent_version_id INTEGER, -- New column for parent-child relationship
      name TEXT,
      svg TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (icon_id) REFERENCES icons(id) ON DELETE CASCADE,
      FOREIGN KEY (parent_version_id) REFERENCES iconVersions(version_id) ON DELETE CASCADE
    );`);
  } catch (e) {
    console.log("initializing database error", e);
  }
};

export const addDummyData = async () => {
  try {
    const db = await getDatabase();

    // Dummy data to be inserted
    const dummyData = [
      {
        name: "Icon 1",
        indx: 1,
        svg: '<svg xmlns="http://www.w3.org/2000/svg" version="1.2" baseProfile="tiny" width="47.4" height="40.65" viewBox="21 18.5 158 135.5"><path d="M25,50 l150,0 0,100 -150,0 z" stroke-width="4" stroke="black" fill="rgb(128,224,255)" fill-opacity="1" ></path><path d="M25,50 L175,150 M25,150 L175,50" stroke-width="4" stroke="black" fill="black" ></path><g transform="translate(0,0)" stroke-width="4" stroke="black" fill="none" ><circle cx="100" cy="30" r="7.5" fill="black" ></circle><circle cx="70" cy="30" r="7.5" fill="black" ></circle><circle cx="130" cy="30" r="7.5" fill="black" ></circle></g></svg>',
      },
      {
        name: "Icon 2",
        indx: 2,
        svg: '<svg xmlns="http://www.w3.org/2000/svg" version="1.2" baseProfile="tiny" width="47.4" height="40.65" viewBox="21 18.5 158 135.5"><path d="M25,50 l150,0 0,100 -150,0 z" stroke-width="4" stroke="black" fill="rgb(128,224,255)" fill-opacity="1" ></path><path d="M25,50 L175,150 M25,150 L175,50" stroke-width="4" stroke="black" fill="black" ></path><g transform="translate(0,0)" stroke-width="4" stroke="black" fill="none" ><circle cx="100" cy="30" r="7.5" fill="black" ></circle><circle cx="70" cy="30" r="7.5" fill="black" ></circle><circle cx="130" cy="30" r="7.5" fill="black" ></circle></g></svg>',
      },
      // Add more dummy data as needed
    ];

    const folders = [
      {
        name: "home",
      },
      {
        name: "illustrations",
      },
    ];

    // Insert dummy data into the Icons table
    for (const item of dummyData) {
      const o = await db.execute(
        `
          INSERT INTO icons (name, svg, indx) VALUES ($1, $2, $3)
        `,
        [item.name, item.svg, item.indx]
      );
      console.log(o.lastInsertId);
    }

    for (const item of folders) {
      const o = await db.execute(
        `
          INSERT INTO folders (name) VALUES ($1)
        `,
        [item.name]
      );
      console.log(o.lastInsertId);
    }

    console.log("Dummy data added successfully!");
  } catch (error) {
    console.error("Error adding dummy data:", error);
    throw error; // Re-throw the error to be handled elsewhere if necessary
  }
};

export const getAllIcons = async (folder_id: number) => {
  try {
    const db = await getDatabase();

    return await db.select(
      `
    SELECT icons.id, icons.name, icons.svg, icons.indx
    FROM icons
    JOIN folderIcons ON icons.id = folderIcons.icon_id
    WHERE folderIcons.folder_id = $1
    ORDER BY icons.indx ASC;
        `,
      [folder_id]
    );
  } catch (error) {
    console.error("Error fetching icons:", error);
    throw error; // Re-throw the error to be handled elsewhere if necessary
  }
};

export const linkIconToFolder = async (folderId: number, iconId: number) => {
  try {
    const db = await getDatabase();

    // Insert relationships into the 'folderIcons' table
    await db.execute(
      "INSERT INTO folderIcons (folder_id, icon_id) VALUES ($1, $2);",
      [folderId, iconId]
    );

    console.log(`Linked all icons to folder with ID ${folderId}.`);
  } catch (error) {
    console.error(`Error linking icons to folder with ID ${folderId}:`, error);
    throw error; // Re-throw the error to be handled elsewhere if necessary
  }
};

export const getAllIconsByFolderId = async (folderId: number) => {
  try {
    const db = await getDatabase();

    return await db.select(
      `
      SELECT icons.id, icons.name, icons.svg, icons.indx
      FROM icons
      JOIN folderIcons ON icons.id = folderIcons.icon_id
      WHERE folderIcons.folder_id = ?
      ORDER BY icons.indx ASC;
    `,
      [folderId]
    );
  } catch (error) {
    console.error(`Error fetching icons for folder ID ${folderId}:`, error);
    throw error; // Re-throw the error to be handled elsewhere if necessary
  }
};

export const getAllFolders = async () => {
  try {
    const db = await getDatabase();

    return await db.select(`
          SELECT id, name FROM folders 
        `);
  } catch (error) {
    console.error("Error fetching icons:", error);
    throw error; // Re-throw the error to be handled elsewhere if necessary
  }
};

export const insertIcon = async (name: string, svg: string, indx: number) => {
  const db = await getDatabase();

  return await db.execute(
    `
  INSERT INTO icons (name, svg, indx) VALUES ($1, $2, $3)

  `,
    [name, svg, indx]
  );
};

export const insertFolder = async (name: string) => {
  const db = await getDatabase();

  await db.execute(
    `
  INSERT INTO folders (name) VALUES ($1)

  `,
    [name]
  );

  return await db.select(`SELECT id, name FROM folders `);
};

export const updateFolderNameById = async (
  id: number,
  newName: string
): Promise<void> => {
  const db = await getDatabase();

  try {
    await db.execute(
      `
      UPDATE folders
      SET name = ?
      WHERE id = ?
    `,
      [newName, id]
    );

    console.log(`Folder with id ${id} renamed to ${newName} successfully.`);
  } catch (error) {
    console.error(`Error renaming icon with id ${id}:`, error);
    throw error;
  }
};

export const deleteFolderById = async (id: number): Promise<void> => {
  const db = await getDatabase();

  try {
    await db.execute(
      `
      DELETE FROM folders
      WHERE id = ?
    `,
      [id]
    );

    console.log(`Icon with id ${id} deleted successfully.`);
  } catch (error) {
    console.error(`Error deleting icon with id ${id}:`, error);
    throw error;
  }
};

export const deleteIconById = async (id: number): Promise<void> => {
  const db = await getDatabase();

  try {
    await db.execute(
      `
      DELETE FROM icons
      WHERE id = ?
    `,
      [id]
    );

    console.log(`Icon with id ${id} deleted successfully.`);
  } catch (error) {
    console.error(`Error deleting icon with id ${id}:`, error);
    throw error;
  }
};

export const deleteTagById = async (id: number): Promise<void> => {
  const db = await getDatabase();

  try {
    await db.execute(
      `
      DELETE FROM tags
      WHERE id = ?
    `,
      [id]
    );

    console.log(`Icon with id ${id} deleted successfully.`);
  } catch (error) {
    console.error(`Error deleting icon with id ${id}:`, error);
    throw error;
  }
};

export const deleteAllRows = async () => {
  const db = await getDatabase();

  return await db.execute(`
  DELETE FROM icons
  `);
};

export const deleteAllFolders = async () => {
  const db = await getDatabase();

  return await db.execute(`
  DELETE FROM folders 
  `);
};

// Function to swap the index positions of two icons in the SQLite database
export const swapIconIndexInDatabase = async (
  iconId1: number,
  iconId2: number,
  index1: number,
  index2: number
) => {
  const db = await getDatabase();

  return await db.execute(
    `UPDATE icons SET indx = CASE
        WHEN id = ? THEN ?
        WHEN id = ? THEN ?
      END
      WHERE id IN (?, ?)`,
    [iconId1, index2, iconId2, index1, iconId1, iconId2]
  );
};

export const getIconById = async (id: number) => {
  const db = await getDatabase();

  return await db.select(
    `
  SELECT id,name, svg,indx FROM icons  
  WHERE id = $1
  `,
    [id]
  );
};

export const updateIconNameById = async (
  id: number,
  newName: string
): Promise<void> => {
  const db = await getDatabase();

  try {
    await db.execute(
      `
      UPDATE icons
      SET name = ?
      WHERE id = ?
    `,
      [newName, id]
    );

    console.log(`Icon with id ${id} renamed to ${newName} successfully.`);
  } catch (error) {
    console.error(`Error renaming icon with id ${id}:`, error);
    throw error;
  }
};

export const updateIconSvgById = async (
  id: number,
  svg: string
): Promise<void> => {
  const db = await getDatabase();

  try {
    await db.execute(
      `
      UPDATE icons
      SET svg = ?
      WHERE id = ?
    `,
      [svg, id]
    );

    toast.success("Updated Icon with name");

    console.log(`Icon with id ${id} renamed to ${svg} successfully.`);
  } catch (error) {
    console.error(`Error renaming icon with id ${id}:`, error);
    throw error;
  }
};

export const updateIconById = async (
  id: number,
  { newName, svg, indx }: { newName?: string; svg?: string; indx?: number }
): Promise<void> => {
  const db = await getDatabase();

  try {
    let updateValues: any = {};
    let updateColumns = [];

    if (newName !== undefined) {
      updateValues.name = newName;
      updateColumns.push("name");
    }

    if (indx !== undefined) {
      updateValues.indx = indx;
      updateColumns.push("indx");
    }

    if (svg !== undefined) {
      updateValues.svg = svg;
      updateColumns.push("svg");
    }

    if (updateColumns.length === 0) {
      // No valid updates provided
      console.log("No valid updates provided.");
      return;
    }

    await db.execute(
      `
      UPDATE icons
      SET indx = ?
      WHERE id = ?
    `,
      [indx, id]
    );

    console.log(`Icon with id ${id} updated successfully.`);

    // if (newName !== undefined) {
    //   toast.success(`Updated Icon with name: ${response.rowsAffected}`);
    // } else {
    //   toast.success(`Updated Icon with SVG: ${response.lastInsertId}`);
    // }
  } catch (error) {
    console.error(`Error updating icon with id ${id}:`, error);
    throw error;
  }
};
