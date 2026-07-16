import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

import BlockItem from "./BlockItem";

import { useWorkspaceStore } from "../../store/useWorkspaceStore";

export default function BlockList({ pageId }) {
  const workspace = useWorkspaceStore(
    (state) => state.workspace
  );

  const page = workspace.pages[pageId];

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const moveBlock = useWorkspaceStore(
    (state) => state.moveBlock
  );

  function handleDragEnd(event) {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const activeBlock =
      workspace.blocks[active.id];

    const overBlock =
      workspace.blocks[over.id];

    if (!activeBlock || !overBlock) {
      return;
    }

    const siblings = activeBlock.parentId
      ? workspace.blocks[
          activeBlock.parentId
        ].childrenIds
      : page.rootBlockIds;

    const oldIndex = siblings.indexOf(active.id);

    const newIndex = siblings.indexOf(over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      moveBlock(
        active.id,
        activeBlock.parentId,
        newIndex
      );
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={page.rootBlockIds}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-2">
          {page.rootBlockIds.map((blockId) => (
            <BlockItem
              key={blockId}
              blockId={blockId}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}