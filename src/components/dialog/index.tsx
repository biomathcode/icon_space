import * as Ariakit from "@ariakit/react";
import { useState } from "react";
import { insertFolder } from "../../db";

export default function Dialog({ setFolder }: { setFolder: any }) {
  const dialog = Ariakit.useDialogStore({ animated: true });
  const [name, setName] = useState<string>("");
  return (
    <>
      <Ariakit.Button onClick={dialog.show} className="button">
        Add Folder
      </Ariakit.Button>
      <Ariakit.Dialog
        store={dialog}
        backdrop={<div className="backdrop" />}
        className="dialog"
      >
        <Ariakit.DialogHeading className="heading">
          Add Folder
        </Ariakit.DialogHeading>
        <input
          placeholder="home"
          style={{
            fontSize: "20px",
            background: "#333",
            border: "2px solid #000",
          }}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div className="flex gap-5">
          <Ariakit.DialogDismiss
            as="button"
            onClick={async () => {
              const newfolder = await insertFolder(name);

              setFolder(newfolder);
            }}
            className="button"
          >
            Confirm
          </Ariakit.DialogDismiss>
          <Ariakit.DialogDismiss className="button">
            Cancel
          </Ariakit.DialogDismiss>
        </div>
      </Ariakit.Dialog>
    </>
  );
}
