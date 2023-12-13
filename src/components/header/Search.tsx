//TODO: use Fuse Search for search Items, Also add filter for tags

function Search() {
  return (
    <div
      id="input-container"
      style={{
        maxWidth: "150px",
      }}
    >
      <span>🔍</span>
      <input placeholder="Search..." />
    </div>
  );
}

export default Search;
