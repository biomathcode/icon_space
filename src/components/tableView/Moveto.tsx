import {
  Button,
  ComboBox,
  Input,
  Label,
  ListBox,
  ListBoxItem,
  Popover,
} from "react-aria-components";
import useAppStore from "../../store";

function MoveTo() {
  const { folders } = useAppStore();
  return (
    <ComboBox>
      <Label>Select Folder to move</Label>
      <div>
        <Input />
        <Button>▼</Button>
      </div>
      <Popover>
        <ListBox>
          {folders.map((e) => (
            <ListBoxItem key={e.id}>{e.name}</ListBoxItem>
          ))}
        </ListBox>
      </Popover>
    </ComboBox>
  );
}

export default MoveTo;
