import { useState } from "react";

import {
  X,
  Search,
} from "lucide-react";

import { useWorkspaceStore } from "../../store/useWorkspaceStore";

import { searchWorkspace } from "../../utils/searchUtils";

export default function SearchModal() {
  const [query, setQuery] = useState("");

  const workspace = useWorkspaceStore(
    (state) => state.workspace
  );

  const closeSearch = useWorkspaceStore(
    (state) => state.closeSearch
  );

  const setActivePage = useWorkspaceStore(
    (state) => state.setActivePage
  );

  const results = searchWorkspace(
    workspace,
    query
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-6">
      <div className="mt-20 w-full max-w-2xl overflow-hidden rounded-xl bg-white shadow-2xl dark:bg-gray-900">
        <div className="flex items-center gap-3 border-b border-gray-200 p-4 dark:border-gray-800">
          <Search
            size={20}
            className="text-gray-400"
          />

          <input
            autoFocus
            value={query}
            onChange={(event) =>
              setQuery(event.target.value)
            }
            placeholder="Search pages and blocks..."
            className="flex-1 bg-transparent outline-none"
          />

          <button onClick={closeSearch}>
            <X size={20} />
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto p-3">
          {query && results.length === 0 && (
            <p className="p-6 text-center text-gray-400">
              No results found.
            </p>
          )}

          {results.map((result, index) => (
            <button
              key={`${result.pageId}-${result.blockId || index}`}
              onClick={() => {
                setActivePage(result.pageId);
                closeSearch();
              }}
              className="block w-full rounded-lg p-3 text-left hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <p className="text-sm font-semibold">
                {result.pageTitle}
              </p>

              <p className="mt-1 text-sm text-gray-500">
                {result.content}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}