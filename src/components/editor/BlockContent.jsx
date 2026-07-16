import { useEffect, useRef, useState } from "react";

import { BLOCK_TYPES } from "../../constants/blockTypes";

import { useWorkspaceStore } from "../../store/useWorkspaceStore";

import SlashMenu from "./SlashMenu";

export default function BlockContent({ block }) {
  const [editing, setEditing] = useState(false);

  const [content, setContent] = useState(
    block.content
  );

  const [showSlashMenu, setShowSlashMenu] =
    useState(false);

  const inputRef = useRef(null);

  const updateBlock = useWorkspaceStore(
    (state) => state.updateBlock
  );

  const createBlock = useWorkspaceStore(
    (state) => state.createBlock
  );

  const deleteBlock = useWorkspaceStore(
    (state) => state.deleteBlock
  );

  const toggleTodo = useWorkspaceStore(
    (state) => state.toggleTodo
  );

  useEffect(() => {
    setContent(block.content);
  }, [block.content]);

  function saveContent() {
    updateBlock(block.id, {
      content,
    });

    setEditing(false);
  }

  function handleKeyDown(event) {
    if (event.key === "Enter") {
      event.preventDefault();

      saveContent();

      createBlock(
        block.pageId,
        block.parentId,
        block.id
      );

      return;
    }

    if (
      event.key === "Backspace" &&
      content === ""
    ) {
      event.preventDefault();

      deleteBlock(block.id);

      return;
    }

    if (event.key === "Escape") {
      setEditing(false);

      return;
    }

    if (
      event.key === "/" &&
      content.length === 0
    ) {
      setShowSlashMenu(true);
    }
  }

  function handleSlashSelect(type) {
    updateBlock(block.id, {
      type,
      content: "",
    });

    setShowSlashMenu(false);

    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  }

  if (block.type === BLOCK_TYPES.DIVIDER) {
    return (
      <div className="my-4 border-t border-gray-300 dark:border-gray-700" />
    );
  }

  if (block.type === BLOCK_TYPES.TODO) {
    return (
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={block.checked}
          onChange={() => toggleTodo(block.id)}
          className="mt-1 h-4 w-4"
        />

        <textarea
          ref={inputRef}
          value={content}
          onChange={(event) =>
            setContent(event.target.value)
          }
          onFocus={() => setEditing(true)}
          onBlur={saveContent}
          onKeyDown={handleKeyDown}
          placeholder="To-do"
          rows={1}
          className={`
            min-h-[28px]
            flex-1
            resize-none
            bg-transparent
            outline-none
            ${
              block.checked
                ? "text-gray-400 line-through"
                : ""
            }
          `}
        />
      </div>
    );
  }

  const classNames = {
    [BLOCK_TYPES.PARAGRAPH]:
      "text-base leading-7",

    [BLOCK_TYPES.HEADING_1]:
      "text-3xl font-bold",

    [BLOCK_TYPES.HEADING_2]:
      "text-2xl font-bold",

    [BLOCK_TYPES.HEADING_3]:
      "text-xl font-semibold",

    [BLOCK_TYPES.BULLET]:
      "before:mr-2 before:content-['•']",

    [BLOCK_TYPES.NUMBERED]:
      "before:mr-2 before:content-['1.']",

    [BLOCK_TYPES.QUOTE]:
      "border-l-4 border-gray-400 pl-4 italic text-gray-500",

    [BLOCK_TYPES.CODE]:
      "rounded-md bg-gray-100 p-4 font-mono text-sm dark:bg-gray-900",

    [BLOCK_TYPES.CALLOUT]:
      "rounded-md bg-yellow-100 p-4 dark:bg-yellow-900/30",
  };

  return (
    <div className="relative">
      <textarea
        ref={inputRef}
        value={content}
        onChange={(event) => {
          setContent(event.target.value);

          if (
            event.target.value === "/"
          ) {
            setShowSlashMenu(true);
          }
        }}
        onFocus={() => setEditing(true)}
        onBlur={() => {
          setTimeout(() => {
            saveContent();
            setShowSlashMenu(false);
          }, 150);
        }}
        onKeyDown={handleKeyDown}
        placeholder={
          block.type === BLOCK_TYPES.PARAGRAPH
            ? "Type '/' for commands"
            : "Start typing..."
        }
        rows={1}
        className={`
          w-full
          resize-none
          overflow-hidden
          bg-transparent
          outline-none
          ${classNames[block.type]}
        `}
      />

      {showSlashMenu && (
        <SlashMenu
          searchTerm={content.slice(1)}
          onSelect={handleSlashSelect}
        />
      )}
    </div>
  );
}