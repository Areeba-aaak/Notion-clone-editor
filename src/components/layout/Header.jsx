import {
  Menu,
  Search,
  Undo2,
  Redo2,
  Sun,
  Moon,
} from "lucide-react";

import Button from "../ui/Button";

import { useWorkspaceStore } from "../../store/useWorkspaceStore";

export default function Header() {
  const toggleSidebar = useWorkspaceStore(
    (state) => state.toggleSidebar
  );

  const openSearch = useWorkspaceStore(
    (state) => state.openSearch
  );

  const undo = useWorkspaceStore(
    (state) => state.undo
  );

  const redo = useWorkspaceStore(
    (state) => state.redo
  );

  const toggleTheme = useWorkspaceStore(
    (state) => state.toggleTheme
  );

  const saving = useWorkspaceStore(
    (state) => state.saving
  );

  const theme = useWorkspaceStore(
    (state) => state.theme
  );

  return (
    <header className="flex h-14 items-center justify-between border-b border-gray-200 px-4 dark:border-gray-800">
      <div className="flex items-center gap-2">
        <Button
          onClick={toggleSidebar}
          title="Toggle Sidebar"
        >
          <Menu size={18} />
        </Button>

        <Button
          onClick={openSearch}
          title="Search"
        >
          <Search size={18} />
        </Button>
      </div>

      <div className="flex items-center gap-1">
        <span className="mr-3 text-xs text-gray-500">
          {saving ? "Saving..." : "Saved"}
        </span>

        <Button
          onClick={undo}
          title="Undo"
        >
          <Undo2 size={18} />
        </Button>

        <Button
          onClick={redo}
          title="Redo"
        >
          <Redo2 size={18} />
        </Button>

        <Button
          onClick={toggleTheme}
          title="Toggle Theme"
        >
          {theme === "light" ? (
            <Moon size={18} />
          ) : (
            <Sun size={18} />
          )}
        </Button>
      </div>
    </header>
  );
}