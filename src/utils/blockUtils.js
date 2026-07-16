import { BLOCK_TYPES } from "../constants/blockTypes";

export function createBlock(type = BLOCK_TYPES.PARAGRAPH) {
  return {
    id: crypto.randomUUID(),
    type,
    content: "",
    checked: false,
    parentId: null,
    childrenIds: [],
    collapsed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function isDescendant(blocks, parentId, childId) {
  const parent = blocks[parentId];

  if (!parent) {
    return false;
  }

  if (parent.childrenIds.includes(childId)) {
    return true;
  }

  return parent.childrenIds.some((id) =>
    isDescendant(blocks, id, childId)
  );
}

export function getAllDescendants(blocks, blockId) {
  const block = blocks[blockId];

  if (!block) {
    return [];
  }

  let descendants = [];

  block.childrenIds.forEach((childId) => {
    descendants.push(childId);

    descendants = [
      ...descendants,
      ...getAllDescendants(blocks, childId),
    ];
  });

  return descendants;
}

export function getVisibleBlockIds(blocks, rootBlockIds) {
  const result = [];

  function traverse(blockIds) {
    blockIds.forEach((blockId) => {
      const block = blocks[blockId];

      if (!block) return;

      result.push(blockId);

      if (!block.collapsed) {
        traverse(block.childrenIds);
      }
    });
  }

  traverse(rootBlockIds);

  return result;
}