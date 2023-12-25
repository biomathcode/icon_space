// Let's for now just use an text area

import { useState } from "react";
import useAppStore from "../../store";
import NestedData from "./nestedComment";

// we would need
// versions should work like commits
//

function VersionControl() {
  const [root, setRoot] = useState();
  const { iconVersions } = useAppStore();

  return (
    <div>
      <NestedData />
    </div>
  );
}

export default VersionControl;
