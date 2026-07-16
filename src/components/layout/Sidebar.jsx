import {
  Plus,
  Search,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

import Button from "../ui/Button";
import PageList from "../pages/PageList";

import { useWorkspaceStore } from "../../store/useWorkspaceStore";

export default function Sidebar() {
  const sidebarOpen = useWorkspaceStore(
    (state) => state.sidebarOpen
  );

  const toggleSidebar = useWorkspaceStore(
    (state) => state.toggleSidebar
  );

  const createPage = useWorkspaceStore(
    (state) => state.createPage
  );

  const openSearch = useWorkspaceStore(
    (state) => state.openSearch
  );

  if (!sidebarOpen) {
    return (
      <aside className="flex w-14 flex-col items-center border-r border-gray-200 py-3 dark:border-gray-800">
        <Button onClick={toggleSidebar}>
          <PanelLeftOpen size={18} />
        </Button>
      </aside>
    );
  }

  return (
    <aside className="flex w-72 flex-col border-r border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center justify-between border-b border-gray-200 p-3 dark:border-gray-800">
        <div className="flex items-center gap-2 font-bold">
          <span className="text-xl">📝</span>
          <span>Workspace</span>
        </div>

        <Button onClick={toggleSidebar}>
          <PanelLeftClose size={18} />
        </Button>
      </div>

      <div className="space-y-2 p-3">
        <Button
          onClick={createPage}
          className="flex w-full items-center justify-center gap-2 bg-gray-900 text-white hover:bg-gray-700 dark:bg-white dark:text-black"
        >
          <Plus size={16} />
          New Page
        </Button>

        <Button
          onClick={openSearch}
          className="flex w-full items-center gap-2 border border-gray-200 dark:border-gray-700"
        >
          <Search size={16} />
          Search
          <span className="ml-auto text-xs text-gray-400">
            Ctrl K
          </span>
        </Button>
      </div>

      <PageList />
    </aside>
  );
}