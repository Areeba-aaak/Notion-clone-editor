import { useEffect, useRef, useState } from "react";

import {
  useSortable,
} from "@dnd-kit/sortable";

import {
  CSS,
} from "@dnd-kit/utilities";

import {
  GripVertical,
  ChevronRight,
  ChevronDown,
  Plus,
  Trash2,
} from "lucide-react";

import BlockContent from "./BlockContent";

import { useWorkspaceStore } from "../../store/useWorkspaceStore";

export default function BlockItem({ blockId }) {
  const block = useWorkspaceStore(
    (state) => state.workspace.blocks[blockId]
  );

  const createBlock = useWorkspaceStore(
    (state) => state.createBlock
  );

  const deleteBlock = useWorkspaceStore(
    (state) => state.deleteBlock
  );

  const toggleCollapse = useWorkspaceStore(
    (state) => state.toggleCollapse
  );

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: blockId,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  if (!block) return null;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group"
    >
      <div className="flex items-start gap-2">
        <button
          {...attributes}
          {...listeners}
          className="mt-2 cursor-grab text-gray-400 opacity-0 transition group-hover:opacity-100"
        >
          <GripVertical size={16} />
        </button>

        {block.childrenIds.length > 0 && (
          <button
            onClick={() => toggleCollapse(block.id)}
            className="mt-2 text-gray-400"
          >
            {block.collapsed ? (
              <ChevronRight size={16} />
            ) : (
              <ChevronDown size={16} />
            )}
          </button>
        )}

        <div className="min-w-0 flex-1">
          <BlockContent block={block} />

          {!block.collapsed &&
            block.childrenIds.length > 0 && (
              <div className="ml-8 mt-2 space-y-2 border-l border-gray-200 pl-4 dark:border-gray-700">
                {block.childrenIds.map((childId) => (
                  <BlockItem
                    key={childId}
                    blockId={childId}
                  />
                ))}
              </div>
            )}
        </div>

        <div className="flex opacity-0 transition group-hover:opacity-100">
          <button
            onClick={() =>
              createBlock(
                block.pageId,
                block.parentId,
                block.id
              )
            }
            className="rounded p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Plus size={16} />
          </button>

          <button
            onClick={() => deleteBlock(block.id)}
            className="rounded p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}