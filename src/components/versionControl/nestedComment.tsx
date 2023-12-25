import React from "react";

interface DataType {
  id: number;
  svg: string;
  name: string;
  children: DataType[];
}

// sample data
const data: DataType = {
  id: 1,
  svg: "<svg>1</svg>",
  name: "Root Node",
  children: [
    {
      id: 2,
      svg: "<svg>2</svg>",
      name: "Node 2",
      children: [
        {
          id: 3,
          svg: "<svg>3</svg>",
          name: "Node 3",
          children: [],
        },
        {
          id: 4,
          svg: "<svg>4</svg>",
          name: "Node 4",
          children: [],
        },
      ],
    },
    {
      id: 5,
      svg: "<svg>5</svg>",
      name: "Node 5",
      children: [],
    },
  ],
};

const createDataNode = (id: number, depth: number): DataType => {
  if (depth === 0) {
    return { id, svg: `<svg>${id}</svg>`, name: `Node ${id}`, children: [] };
  } else {
    return {
      id,
      svg: `<svg>${id}</svg>`,
      name: `Node ${id}`,
      children: Array.from({ length: 2 }, (_, index) =>
        createDataNode(id * 10 + index + 1, depth - 1)
      ),
    };
  }
};

const HorizontalDataNode: React.FC<DataType> = ({
  id,
  svg,
  name,
  children,
}) => (
  <div
    style={{
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
    }}
  >
    <p>ID: {id}</p>
    <p>Name: {name}</p>
    <p>SVG: {svg}</p>
    <div style={{ display: "flex", flexDirection: "row" }}>
      {children.map((child) => (
        <HorizontalDataNode key={child.id} {...child} />
      ))}
    </div>
  </div>
);

const DataNode: React.FC<DataType> = ({ id, svg, name, children }) => (
  <div
    style={{ marginLeft: "20px", border: "1px solid #ddd", padding: "10px" }}
  >
    <p>ID: {id}</p>
    <p>Name: {name}</p>
    <p>SVG: {svg}</p>
    <div>
      {children.map((child) => (
        <DataNode key={child.id} {...child} />
      ))}
    </div>
  </div>
);

const NestedData: React.FC = () => {
  // Adjust the depth as needed

  return (
    <div
      style={{
        width: "100%",
        overflow: "scroll",
        height: "200px",
      }}
    >
      <HorizontalDataNode {...data} />
    </div>
  );
};

export default NestedData;
