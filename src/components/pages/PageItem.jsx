import {
  MoreHorizontal,
  Trash2,
} from "lucide-react";

import Button from "../ui/Button";

import { useWorkspaceStore } from "../../store/useWorkspaceStore";

export default function PageItem({ page }) {
  const activePageId = useWorkspaceStore(
    (state) => state.workspace.activePageId
  );

  const setActivePage = useWorkspaceStore(
    (state) => state.setActivePage
  );

  const renamePage = useWorkspaceStore(
    (state) => state.renamePage
  );

  const deletePage = useWorkspaceStore(
    (state) => state.deletePage
  );

  const isActive = activePageId === page.id;

  function handleRename() {
    const newTitle = prompt(
      "Enter new page name:",
      page.title
    );

    if (newTitle?.trim()) {
      renamePage(page.id, newTitle.trim());
    }
  }

  function handleDelete() {
    const confirmed = confirm(
      `Delete "${page.title}"?`
    );

    if (confirmed) {
      deletePage(page.id);
    }
  }

  return (
    <div
      className={`
        group flex items-center rounded-md px-2 py-1
        ${
          isActive
            ? "bg-gray-200 dark:bg-gray-800"
            : "hover:bg-gray-100 dark:hover:bg-gray-800"
        }
      `}
    >
      <button
        onClick={() => setActivePage(page.id)}
        className="flex min-w-0 flex-1 items-center gap-2 py-1 text-left"
      >
        <span>{page.icon}</span>

        <span className="truncate text-sm">
          {page.title}
        </span>
      </button>

      <div className="hidden group-hover:flex">
        <Button
          onClick={handleRename}
          title="Rename"
        >
          <MoreHorizontal size={16} />
        </Button>

        <Button
          onClick={handleDelete}
          title="Delete"
        >
          <Trash2 size={15} />
        </Button>
      </div>
    </div>
  );
}