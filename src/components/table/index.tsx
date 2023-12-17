import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";

type SvgData = {
  id: number;
  name: string;
  svg: string;
  tags?: string[];
  actions?: any;
};

const columnHelper = createColumnHelper<SvgData>();

const columns = [
  columnHelper.accessor("id", {
    cell: (info) => info.getValue(),
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("name", {
    header: "Name",
    footer: (info) => info.column.id,
  }),

  columnHelper.accessor("svg", {
    header: () => <span>SVG</span>,
    footer: (info) => info.column.id,
    cell: (props) => (
      <img
        style={{
          width: "20px",
          height: "20px",
        }}
        src={`data:image/svg+xml;utf8,${encodeURIComponent(
          props.row.original.svg
        )}`}
      />
    ),
  }),
  columnHelper.accessor("actions", {
    header: "Optimise",
    footer: (info) => info.column.id,
    cell: () => <button onClick={() => alert("hello")}>🪄</button>,
  }),
];

const defaultData: SvgData[] = [
  {
    id: 1,
    svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-activity-square"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M17 12h-2l-2 5-2-10-2 5H7"/></svg>',
    name: "activity-square",
    tags: ["medical", "account", "social", "Science", "Shapes"],
  },
  {
    id: 2,
    svg: '<svg xmlns="http://www.w3.org/2000/svg" version="1.2" baseProfile="tiny" width="47.4" height="40.65" viewBox="21 18.5 158 135.5"><path d="M25,50 l150,0 0,100 -150,0 z" stroke-width="4" stroke="black" fill="rgb(128,224,255)" fill-opacity="1" ></path><path d="M25,50 L175,150 M25,150 L175,50" stroke-width="4" stroke="black" fill="black" ></path><g transform="translate(0,0)" stroke-width="4" stroke="black" fill="none" ><circle cx="100" cy="30" r="7.5" fill="black" ></circle><circle cx="70" cy="30" r="7.5" fill="black" ></circle><circle cx="130" cy="30" r="7.5" fill="black" ></circle></g></svg>',
    name: "activity-square",
    tags: ["medical", "account", "social", "Science", "Shapes"],
  },
];

function TableView() {
  const [data, _] = useState(() => [...defaultData]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  return (
    <div>
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TableView;
