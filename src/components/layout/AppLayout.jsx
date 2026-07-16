import Sidebar from "./Sidebar";
import Header from "./Header";
import Editor from "../editor/Editor";
import SearchModal from "../search/SearchModal";

import { useWorkspaceStore } from "../../store/useWorkspaceStore";

export default function AppLayout() {
  const theme = useWorkspaceStore((state) => state.theme);
  const searchOpen = useWorkspaceStore(
    (state) => state.searchOpen
  );

  return (
    <div
      className={
        theme === "dark"
          ? "dark min-h-screen"
          : "min-h-screen"
      }
    >
      <div className="flex min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100">
        <Sidebar />

        <main className="flex min-w-0 flex-1 flex-col">
          <Header />

          <Editor />
        </main>

        {searchOpen && <SearchModal />}
      </div>
    </div>
  );
}