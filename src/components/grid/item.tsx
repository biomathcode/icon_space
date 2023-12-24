import { forwardRef, HTMLAttributes, CSSProperties } from "react";
import { deleteIconById } from "../../db";

export type ItemProps = HTMLAttributes<HTMLDivElement> & {
  id: string;
  name?: string;
  svg?: string;
  withOpacity?: boolean;
  isDragging?: boolean;
};

const Item = forwardRef<HTMLDivElement, ItemProps>(
  ({ id, withOpacity, isDragging, style, svg, name, ...props }, ref) => {
    const inlineStyles: CSSProperties = {
      opacity: withOpacity ? "0.5" : "1",
      transformOrigin: "50% 50%",
      height: "100px",
      width: "100px",
      borderRadius: "10px",
      cursor: isDragging ? "grabbing" : "grab",
      backgroundColor: "#222",
      color: "#eee",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",

      boxShadow: isDragging
        ? "rgb(63 63 68 / 5%) 0px 2px 0px 2px, rgb(34 33 81 / 15%) 0px 2px 3px 2px"
        : "rgb(63 63 68 / 5%) 0px 0px 0px 1px, rgb(34 33 81 / 15%) 0px 1px 3px 0px",
      transform: isDragging
        ? "scale(1.05) rotate(10deg)"
        : "scale(1) rotate(0deg)",
      ...style,
    };

    return (
      <>
        <div ref={ref} style={inlineStyles} {...props}>
          <div>
            <img
              style={{
                width: "50px",
                height: "50px",
              }}
              src={`data:image/svg+xml;utf8,${encodeURIComponent(svg || "")}`}
            />
            <div>{name}</div>
          </div>
        </div>
      </>
    );
  }
);

export default Item;
