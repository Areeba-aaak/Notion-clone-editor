import PageItem from "./PageItem";

import { useWorkspaceStore } from "../../store/useWorkspaceStore";

export default function PageList() {
  const pages = useWorkspaceStore(
    (state) => state.workspace.pages
  );

  return (
    <div className="flex-1 overflow-y-auto px-2">
      <p className="px-2 py-2 text-xs font-semibold uppercase text-gray-400">
        Pages
      </p>

      <div className="space-y-1">
        {Object.values(pages).map((page) => (
          <PageItem
            key={page.id}
            page={page}
          />
        ))}
      </div>
    </div>
  );
}