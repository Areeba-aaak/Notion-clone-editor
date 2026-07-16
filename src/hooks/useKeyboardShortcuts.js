import { useEffect } from "react";

import { useWorkspaceStore } from "../store/useWorkspaceStore";

export default function useKeyboardShortcuts() {
  const openSearch = useWorkspaceStore(
    (state) => state.openSearch
  );

  const undo = useWorkspaceStore(
    (state) => state.undo
  );

  const redo = useWorkspaceStore(
    (state) => state.redo
  );

  useEffect(() => {
    function handleKeyDown(event) {
      const modifier = event.ctrlKey || event.metaKey;

      if (modifier && event.key.toLowerCase() === "k") {
        event.preventDefault();
        openSearch();
      }

      if (
        modifier &&
        event.key.toLowerCase() === "z" &&
        !event.shiftKey
      ) {
        event.preventDefault();
        undo();
      }

      if (
        modifier &&
        event.key.toLowerCase() === "z" &&
        event.shiftKey
      ) {
        event.preventDefault();
        redo();
      }

      if (modifier && event.key.toLowerCase() === "s") {
        event.preventDefault();
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [openSearch, undo, redo]);
}