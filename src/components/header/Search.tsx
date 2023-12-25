//TODO: use Fuse Search for search Items, Also add filter for tags

import { useState } from "react";
import { getAllIcons } from "../../db";

function Search({ data, setData }: { data: any; setData: any }) {
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = event.target.value;
    setSearchTerm(newSearchTerm);

    // console.log("search", fuse.search(event.target.value));

    // const newData = fuse.search(newSearchTerm.trim()).map((e) => e.item);

    // Filter the gridData based on the search term
    const filteredData = data.filter((item: any) =>
      item.name.toLowerCase().includes(newSearchTerm.trim().toLowerCase())
    );

    // Update the grid data with the filtered results
    setData(filteredData);
  };

  return (
    <div
      id="input-container"
      style={{
        maxWidth: "150px",
      }}
    >
      <span>🔍</span>
      <input
        type="text"
        onBlur={async () => {
          const data = await getAllIcons(1);

          setData(data);
        }}
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder="Search..."
      />
    </div>
  );
}

export default Search;
