import { useState } from "react";

import { Check } from "lucide-react";

import { useWorkspaceStore } from "../../store/useWorkspaceStore";

export default function PageHeader({ page }) {
  const [editing, setEditing] = useState(false);

  const [title, setTitle] = useState(page.title);

  const renamePage = useWorkspaceStore(
    (state) => state.renamePage
  );

  const updatePageIcon = useWorkspaceStore(
    (state) => state.updatePageIcon
  );

  function saveTitle() {
    if (title.trim()) {
      renamePage(page.id, title.trim());
    }

    setEditing(false);
  }

  return (
    <div className="mb-8">
      <div className="mb-4 text-sm text-gray-400">
        Workspace / {page.title}
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => {
            const icon = prompt(
              "Enter an emoji:",
              page.icon
            );

            if (icon) {
              updatePageIcon(page.id, icon);
            }
          }}
          className="text-5xl"
        >
          {page.icon}
        </button>

        {editing ? (
          <div className="flex items-center gap-2">
            <input
              autoFocus
              value={title}
              onChange={(event) =>
                setTitle(event.target.value)
              }
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  saveTitle();
                }

                if (event.key === "Escape") {
                  setEditing(false);
                }
              }}
              className="border-b-2 border-gray-400 bg-transparent text-4xl font-bold outline-none"
            />

            <button onClick={saveTitle}>
              <Check size={24} />
            </button>
          </div>
        ) : (
          <h1
            onClick={() => setEditing(true)}
            className="cursor-text text-4xl font-bold"
          >
            {page.title}
          </h1>
        )}
      </div>
    </div>
  );
}