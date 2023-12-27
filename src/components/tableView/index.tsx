import {
  ActionButton,
  Cell,
  Column,
  Flex,
  Row,
  TableBody,
  TableHeader,
  TableView,
  View,
} from "@adobe/react-spectrum";

import useAppStore from "../../store";
import { useState } from "react";

function TableContainer() {
  const { icons } = useAppStore();

  let [selectedKeys, setSelectedKeys] = useState<any>(new Set([2]));

  const handleExport = () => {
    let data = Array.from(selectedKeys.values());
    console.log(data);
  };

  return (
    <View
      UNSAFE_style={{
        marginTop: "100px",
      }}
    >
      <Flex height="size-5000" width="100%" direction="column" gap="size-150">
        <Flex gap="size-100">
          <ActionButton alignSelf="start">Move to</ActionButton>
          <ActionButton alignSelf="start">Delete</ActionButton>
          <ActionButton onPress={handleExport} alignSelf="start">
            Export
          </ActionButton>
        </Flex>

        <TableView
          selectionMode="multiple"
          aria-label="Icons table view with svg, id, name"
          width="size-5000"
          UNSAFE_style={{
            display: "block",
          }}
          selectedKeys={selectedKeys}
          onSelectionChange={setSelectedKeys}

          //_5uzlQq_spectrum-Table-cellWrapper
          //EfWbna_react-spectrum-Table-cellWrapper
        >
          <TableHeader
            columns={["name", "id", "svg", "indx"].map((e) => ({
              name: e.toLocaleUpperCase(),
              id: e,
            }))}
          >
            {(column) => {
              return (
                <Column showDivider={true} key={column.id}>
                  {column.name}
                </Column>
              );
            }}
          </TableHeader>
          <TableBody items={icons}>
            {(e) => (
              <Row key={e.id}>
                <Cell>{e.name}</Cell>

                <Cell>{e.id}</Cell>

                <Cell>
                  {" "}
                  <img
                    style={{
                      width: "20px",
                      height: "20px",
                    }}
                    src={`data:image/svg+xml;utf8,${encodeURIComponent(
                      e.svg || ""
                    )}`}
                  />
                </Cell>
                <Cell>{e.indx}</Cell>
              </Row>
            )}
          </TableBody>
        </TableView>
      </Flex>
    </View>
  );
}

export default TableContainer;
