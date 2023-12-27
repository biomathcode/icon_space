import useSidebarStore from "../../store/useSidebarStore";

import SubMenu from "./SubMenu";

function HeaderArea() {
  const { isOpen, toggleSidebar } = useSidebarStore();
  return (
    <section
      style={{
        position: "absolute",
        top: "0px",
        background: "#222",
        width: "100%",
        padding: "10px 10px",
        gap: "20px",
        display: "flex",
      }}
    >
      <button
        onClick={() => {
          toggleSidebar();
        }}
      >
        {isOpen ? (
          <svg
            fill="#ECE6DB"
            className="doubleChevronRight"
            display="block"
            viewBox="0 0 16 16"
            style={{
              width: 16,
              height: 16,
              WebkitFlexShrink: "0",

              flexShrink: "0",
            }}
          >
            <path d="M2.258 14.121c.219 0 .41-.082.56-.232l5.326-5.21c.184-.184.273-.382.273-.615a.806.806 0 00-.273-.615L2.818 2.24a.763.763 0 00-.56-.232.785.785 0 00-.793.793c0 .212.089.417.24.574L6.51 8.058l-4.806 4.696a.812.812 0 00-.24.574c0 .445.35.793.794.793zm6.111 0a.759.759 0 00.554-.232l5.332-5.21c.184-.184.273-.382.273-.615a.83.83 0 00-.273-.615L8.923 2.24a.759.759 0 00-.554-.232.79.79 0 00-.8.793c0 .212.096.417.246.574l4.806 4.683-4.806 4.696a.79.79 0 00.554 1.367z"></path>
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="lucide lucide-menu"
            viewBox="0 0 24 24"
          >
            <path d="M4 12L20 12"></path>
            <path d="M4 6L20 6"></path>
            <path d="M4 18L20 18"></path>
          </svg>
        )}
      </button>

      <SubMenu />
    </section>
  );
}

export default HeaderArea;
