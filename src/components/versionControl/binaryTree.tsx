import React, { useState } from "react";

interface TreeNode {
  value: number;
  left?: TreeNode;
  right?: TreeNode;
}

const BinaryTree: React.FC<{
  node: TreeNode | undefined;
  onAddNode: (value: number) => void;
}> = ({ node, onAddNode }) => {
  const isLeaf = !node?.left && !node?.right;

  const renderButton = () => {
    if (isLeaf) {
      return (
        <button onClick={() => onAddNode(node!.value + 1)}>Add Node</button>
      );
    }
    return null;
  };

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <p>{node?.value}</p>
      <div style={{ display: "flex" }}>
        {node?.left && <BinaryTree node={node.left} onAddNode={onAddNode} />}
        {node?.right && <BinaryTree node={node.right} onAddNode={onAddNode} />}
      </div>
      {renderButton()}
    </div>
  );
};

const BinaryTreeView: React.FC = () => {
  const [rootNode, setRootNode] = useState<TreeNode>({
    value: 1,
    left: {
      value: 2,
      left: { value: 4 },
      right: { value: 5 },
    },
    right: {
      value: 3,
      left: { value: 6 },
      right: { value: 7 },
    },
  });

  const handleAddNode = (parentValue: number) => {
    const newNode: TreeNode = { value: parentValue + 1 };
    setRootNode((prevRoot) => {
      const updateNode = (node: TreeNode | undefined): TreeNode | undefined => {
        if (!node) {
          return undefined;
        }
        if (node.value === parentValue) {
          if (!node.left) {
            node.left = newNode;
          } else if (!node.right) {
            node.right = newNode;
          }
        } else {
          node.left = updateNode(node.left);
          node.right = updateNode(node.right);
        }
        return node;
      };

      return updateNode(prevRoot) as TreeNode;
    });
  };

  return <BinaryTree node={rootNode} onAddNode={handleAddNode} />;
};

export default BinaryTreeView;
