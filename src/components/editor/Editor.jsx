import PageHeader from "../pages/PageHeader";
import BlockList from "./BlockList";

import { useWorkspaceStore } from "../../store/useWorkspaceStore";

export default function Editor() {
  const workspace = useWorkspaceStore(
    (state) => state.workspace
  );

  const page =
    workspace.pages[workspace.activePageId];

  return (
    <section className="flex-1 overflow-y-auto">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <PageHeader page={page} />

        <BlockList pageId={page.id} />
      </div>
    </section>
  );
}