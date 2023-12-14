import Search from "./Search";
import SubMenu from "./SubMenu";

function HeaderArea({ data, setData }: { data: any; setData: any }) {
  return (
    <section
      style={{
        position: "absolute",
        top: "0px",
        background: "#222",
        width: "100%",
        padding: "10px 10px",
      }}
    >
      <Search data={data} setData={setData} />
      <SubMenu />
    </section>
  );
}

export default HeaderArea;
