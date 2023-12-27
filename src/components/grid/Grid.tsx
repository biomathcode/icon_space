import { Flex } from "@adobe/react-spectrum";
import { FC, ReactNode } from "react";

type GridProps = {
  columns: number;
  children: ReactNode;
};

const Grid: FC<GridProps> = ({ children }) => {
  return (
    <Flex
      direction="row"
      gap="size-100"
      UNSAFE_style={{
        marginTop: "100px",
        minHeight: "600px",
        height: "calc(100vh - 100px)",
      }}
      wrap
    >
      {children}
    </Flex>
  );
};

export default Grid;
