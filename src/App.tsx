import { useEffect, useState } from "react";
import { readTextFile } from "@tauri-apps/api/fs";
import "./App.css";
import { listen } from "@tauri-apps/api/event";
import { writeText } from "@tauri-apps/api/clipboard";
import { Toaster, toast } from "react-hot-toast";
import {
  addDummyData,
  deleteAllFolders,
  deleteAllRows,
  deleteIconById,
  getAllIcons,
  handleInitializeDatabase,
  insertIcon,
} from "./db";
import Sidebar from "./components/sidebar";
import Main from "./components/main";

function App() {
  const initialData = [
    {
      id: "1",
      svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-activity-square"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M17 12h-2l-2 5-2-10-2 5H7"/></svg>',
      name: "activity-square",
      tags: ["medical", "account", "social", "Science", "Shapes"],
    },
    {
      id: "2",
      svg: '<svg xmlns="http://www.w3.org/2000/svg" version="1.2" baseProfile="tiny" width="47.4" height="40.65" viewBox="21 18.5 158 135.5"><path d="M25,50 l150,0 0,100 -150,0 z" stroke-width="4" stroke="black" fill="rgb(128,224,255)" fill-opacity="1" ></path><path d="M25,50 L175,150 M25,150 L175,50" stroke-width="4" stroke="black" fill="black" ></path><g transform="translate(0,0)" stroke-width="4" stroke="black" fill="none" ><circle cx="100" cy="30" r="7.5" fill="black" ></circle><circle cx="70" cy="30" r="7.5" fill="black" ></circle><circle cx="130" cy="30" r="7.5" fill="black" ></circle></g></svg>',
      name: "activity-square",
      tags: ["medical", "account", "social", "Science", "Shapes"],
    },
  ];

  const [data, setData] = useState<any>(initialData);

  useEffect(() => {
    listen("tauri://file-drop", (event: any) => {
      console.log(event);

      const file = event.payload[0].split("/").pop();

      const fileName = file.replace(".svg", "") || "new File";

      console.log("filename", fileName);

      readTextFile(event.payload[0])
        .then((e) => {
          insertIcon(fileName, e).then((el: any) => {
            console.log("insert return", el);

            setData([...el]);

            toast.success(" Icon added");
          });
        })
        .catch((e) => console.log("error", e));
    });
  }, []);

  useEffect(() => {
    const init = async () => {
      console.log("Initializing database...");

      await handleInitializeDatabase();

      console.log("Database initialized.");

      console.log("Fetching data...");
      const data = await getAllIcons();

      setData(data);
      console.log("Data fetched:", data);
    };
    init();
  }, []);

  return (
    <div className="container">
      <Toaster position="top-right" />

      <div className="flex gap-5">
        <Sidebar />
        <Main data={data} setData={setData} />
      </div>
    </div>
  );
}

// function Tags({ tags }: { tags: any }) {
//   return (
//     <div
//       className="row gap-2"
//       style={{
//         maxWidth: "100px",
//         overflow: "auto",
//         gap: "10px",

//         justifyContent: "flex-start",
//       }}
//     >
//       {tags.map((tag: any) => (
//         <div
//           style={{
//             fontSize: "10px",
//             fontWeight: "bold",

//             borderRadius: "4px",
//           }}
//         >
//           {tag + "  "}
//         </div>
//       ))}
//     </div>
//   );
// }

export default App;
