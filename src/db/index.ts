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
  await db.execute(`
      CREATE TABLE IF NOT EXISTS icons (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        svg TEXT NOT NULL
        index INTEGER NOT NULL, 
      );
    `);

  await db.execute(`
        CREATE TABLE IF NOT EXISTS folders (
          id INTEGER PRIMARY KEY,
          name TEXT NOT NUll

        )
  `);

  await db.execute(`
  CREATE TABLE IF NOT EXISTS FolderIcons (
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
CREATE TABLE IF NOT EXISTS IconTags (
    icon_id INTEGER,
    tag_id INTEGER,
    PRIMARY KEY (icon_id, tag_id),
    FOREIGN KEY (icon_id) REFERENCES icons(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);
  `);
};

export const addDummyData = async () => {
  try {
    const db = await getDatabase();

    // Dummy data to be inserted
    const dummyData = [
      {
        name: "Icon 1",
        svg: '<svg xmlns="http://www.w3.org/2000/svg" version="1.2" baseProfile="tiny" width="47.4" height="40.65" viewBox="21 18.5 158 135.5"><path d="M25,50 l150,0 0,100 -150,0 z" stroke-width="4" stroke="black" fill="rgb(128,224,255)" fill-opacity="1" ></path><path d="M25,50 L175,150 M25,150 L175,50" stroke-width="4" stroke="black" fill="black" ></path><g transform="translate(0,0)" stroke-width="4" stroke="black" fill="none" ><circle cx="100" cy="30" r="7.5" fill="black" ></circle><circle cx="70" cy="30" r="7.5" fill="black" ></circle><circle cx="130" cy="30" r="7.5" fill="black" ></circle></g></svg>',
      },
      {
        name: "Icon 2",
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
          INSERT INTO icons (name, svg) VALUES ($1, $2)
        `,
        [item.name, item.svg]
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

export const getAllIcons = async () => {
  try {
    const db = await getDatabase();

    return await db.select(`
          SELECT id, name, svg FROM icons 
        `);
  } catch (error) {
    console.error("Error fetching icons:", error);
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

export const insertIcon = async (name: string, svg: string) => {
  const db = await getDatabase();

  await db.execute(
    `
  INSERT INTO icons (name, svg) VALUES ($1, $2)

  `,
    [name, svg]
  );

  return await db.select(`SELECT id, name, svg FROM icons `);
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

export const getIconById = async (id: number) => {
  const db = await getDatabase();

  return await db.select(
    `
  SELECT id,name, svg FROM icons  
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
