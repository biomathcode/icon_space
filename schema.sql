-- Table for Icons
CREATE TABLE IF NOT EXISTS Icons (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    svg TEXT NOT NULL,
    index INTEGER
);

-- Table for Tags
CREATE TABLE IF NOT EXISTS Tags (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    color TEXT NOT NULL 
);

-- Table for Icons-Tags relationship (Many-to-Many)
CREATE TABLE IF NOT EXISTS IconTags (
    icon_id INTEGER,
    tag_id INTEGER,
    PRIMARY KEY (icon_id, tag_id),
    FOREIGN KEY (icon_id) REFERENCES Icons(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES Tags(id) ON DELETE CASCADE
);

-- Table for Folders
CREATE TABLE IF NOT EXISTS Folders (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL
);

-- Table for Icons in Folders (Many-to-Many)
CREATE TABLE IF NOT EXISTS FolderIcons (
    folder_id INTEGER,
    icon_id INTEGER,
    PRIMARY KEY (folder_id, icon_id),
    FOREIGN KEY (folder_id) REFERENCES Folders(id) ON DELETE CASCADE,
    FOREIGN KEY (icon_id) REFERENCES Icons(id) ON DELETE CASCADE
);
