import { create } from "zustand";
import { createBlock } from "../utils/blockUtils";
import { saveWorkspace, loadWorkspace } from "../utils/storage";

const initialPageId = crypto.randomUUID();
const initialBlock = createBlock();

initialBlock.content = "Welcome to your workspace.";

const initialWorkspace = {
  pages: {
    [initialPageId]: {
      id: initialPageId,
      title: "My First Page",
      icon: "🚀",
      rootBlockIds: [initialBlock.id],
    },
  },

  blocks: {
    [initialBlock.id]: {
      ...initialBlock,
      pageId: initialPageId,
    },
  },

  activePageId: initialPageId,
};

const savedWorkspace = loadWorkspace();

export const useWorkspaceStore = create((set, get) => ({
  workspace: savedWorkspace || initialWorkspace,

  history: [],

  future: [],

  theme: localStorage.getItem("theme") || "light",

  sidebarOpen: true,

  searchOpen: false,

  saving: false,

  saveTimeout: null,

  saveSnapshot() {
    const currentWorkspace = get().workspace;

    set((state) => ({
      history: [
        ...state.history.slice(-49),
        JSON.parse(JSON.stringify(currentWorkspace)),
      ],
      future: [],
    }));
  },

  persistWorkspace() {
    const workspace = get().workspace;

    set({ saving: true });

    saveWorkspace(workspace);

    setTimeout(() => {
      set({ saving: false });
    }, 500);
  },

  createPage() {
    get().saveSnapshot();

    const pageId = crypto.randomUUID();

    const block = createBlock();

    const newPage = {
      id: pageId,
      title: "Untitled",
      icon: "📄",
      rootBlockIds: [block.id],
    };

    set((state) => ({
      workspace: {
        ...state.workspace,

        pages: {
          ...state.workspace.pages,
          [pageId]: newPage,
        },

        blocks: {
          ...state.workspace.blocks,
          [block.id]: {
            ...block,
            pageId,
          },
        },

        activePageId: pageId,
      },
    }));

    get().persistWorkspace();

    return pageId;
  },

  deletePage(pageId) {
    const pages = get().workspace.pages;
    const pageIds = Object.keys(pages);

    if (pageIds.length <= 1) {
      alert("You must keep at least one page.");
      return;
    }

    get().saveSnapshot();

    const page = pages[pageId];

    const newPages = { ...pages };
    delete newPages[pageId];

    const newBlocks = { ...get().workspace.blocks };

    Object.values(newBlocks).forEach((block) => {
      if (block.pageId === pageId) {
        delete newBlocks[block.id];
      }
    });

    const newActivePageId =
      get().workspace.activePageId === pageId
        ? Object.keys(newPages)[0]
        : get().workspace.activePageId;

    set((state) => ({
      workspace: {
        ...state.workspace,
        pages: newPages,
        blocks: newBlocks,
        activePageId: newActivePageId,
      },
    }));

    get().persistWorkspace();
  },

  renamePage(pageId, title) {
    get().saveSnapshot();

    set((state) => ({
      workspace: {
        ...state.workspace,

        pages: {
          ...state.workspace.pages,

          [pageId]: {
            ...state.workspace.pages[pageId],
            title,
          },
        },
      },
    }));

    get().persistWorkspace();
  },

  setActivePage(pageId) {
    set((state) => ({
      workspace: {
        ...state.workspace,
        activePageId: pageId,
      },
    }));
  },

  updatePageIcon(pageId, icon) {
    get().saveSnapshot();

    set((state) => ({
      workspace: {
        ...state.workspace,

        pages: {
          ...state.workspace.pages,

          [pageId]: {
            ...state.workspace.pages[pageId],
            icon,
          },
        },
      },
    }));

    get().persistWorkspace();
  },

  createBlock(pageId, parentId = null, afterBlockId = null) {
    get().saveSnapshot();

    const block = createBlock();

    const newBlock = {
      ...block,
      pageId,
      parentId,
    };

    set((state) => {
      const workspace = state.workspace;

      const blocks = {
        ...workspace.blocks,
        [block.id]: newBlock,
      };

      const page = workspace.pages[pageId];

      if (!parentId) {
        const rootBlockIds = [...page.rootBlockIds];

        if (afterBlockId) {
          const index = rootBlockIds.indexOf(afterBlockId);

          rootBlockIds.splice(index + 1, 0, block.id);
        } else {
          rootBlockIds.push(block.id);
        }

        return {
          workspace: {
            ...workspace,

            pages: {
              ...workspace.pages,

              [pageId]: {
                ...page,
                rootBlockIds,
              },
            },

            blocks,
          },
        };
      }

      const parent = blocks[parentId];

      const childrenIds = [...parent.childrenIds];

      if (afterBlockId) {
        const index = childrenIds.indexOf(afterBlockId);

        childrenIds.splice(index + 1, 0, block.id);
      } else {
        childrenIds.push(block.id);
      }

      blocks[parentId] = {
        ...parent,
        childrenIds,
      };

      return {
        workspace: {
          ...workspace,
          blocks,
        },
      };
    });

    get().persistWorkspace();

    return block.id;
  },

  updateBlock(blockId, updates) {
    get().saveSnapshot();

    set((state) => {
      const block = state.workspace.blocks[blockId];

      if (!block) {
        return state;
      }

      return {
        workspace: {
          ...state.workspace,

          blocks: {
            ...state.workspace.blocks,

            [blockId]: {
              ...block,
              ...updates,
              updatedAt: new Date().toISOString(),
            },
          },
        },
      };
    });

    get().persistWorkspace();
  },

  deleteBlock(blockId) {
    get().saveSnapshot();

    set((state) => {
      const workspace = state.workspace;
      const block = workspace.blocks[blockId];

      if (!block) {
        return state;
      }

      const blocks = { ...workspace.blocks };

      const idsToDelete = [blockId];

      function collectChildren(id) {
        blocks[id]?.childrenIds.forEach((childId) => {
          idsToDelete.push(childId);
          collectChildren(childId);
        });
      }

      collectChildren(blockId);

      idsToDelete.forEach((id) => {
        delete blocks[id];
      });

      if (block.parentId) {
        const parent = blocks[block.parentId];

        if (parent) {
          blocks[parent.id] = {
            ...parent,

            childrenIds: parent.childrenIds.filter(
              (id) => id !== blockId
            ),
          };
        }
      } else {
        const page = workspace.pages[block.pageId];

        return {
          workspace: {
            ...workspace,

            pages: {
              ...workspace.pages,

              [block.pageId]: {
                ...page,

                rootBlockIds: page.rootBlockIds.filter(
                  (id) => id !== blockId
                ),
              },
            },

            blocks,
          },
        };
      }

      return {
        workspace: {
          ...workspace,
          blocks,
        },
      };
    });

    get().persistWorkspace();
  },

  moveBlock(blockId, newParentId, newIndex) {
    get().saveSnapshot();

    set((state) => {
      const workspace = state.workspace;
      const blocks = { ...workspace.blocks };

      const block = blocks[blockId];

      if (!block) {
        return state;
      }

      if (newParentId === blockId) {
        return state;
      }

      const oldParentId = block.parentId;

      if (oldParentId) {
        const oldParent = blocks[oldParentId];

        blocks[oldParentId] = {
          ...oldParent,

          childrenIds: oldParent.childrenIds.filter(
            (id) => id !== blockId
          ),
        };
      } else {
        const page = workspace.pages[block.pageId];

        const newRootIds = page.rootBlockIds.filter(
          (id) => id !== blockId
        );

        workspace.pages[block.pageId] = {
          ...page,
          rootBlockIds: newRootIds,
        };
      }

      block.parentId = newParentId;

      if (newParentId) {
        const parent = blocks[newParentId];

        const childrenIds = [...parent.childrenIds];

        childrenIds.splice(newIndex, 0, blockId);

        blocks[newParentId] = {
          ...parent,
          childrenIds,
        };
      } else {
        const page = workspace.pages[block.pageId];

        const rootBlockIds = [...page.rootBlockIds];

        rootBlockIds.splice(newIndex, 0, blockId);

        workspace.pages[block.pageId] = {
          ...page,
          rootBlockIds,
        };
      }

      return {
        workspace: {
          ...workspace,
          blocks,
        },
      };
    });

    get().persistWorkspace();
  },

  indentBlock(blockId) {
    const workspace = get().workspace;
    const block = workspace.blocks[blockId];

    if (!block) return;

    const siblings = block.parentId
      ? workspace.blocks[block.parentId].childrenIds
      : workspace.pages[block.pageId].rootBlockIds;

    const index = siblings.indexOf(blockId);

    if (index <= 0) return;

    const previousSiblingId = siblings[index - 1];

    const previousSibling = workspace.blocks[previousSiblingId];

    get().moveBlock(
      blockId,
      previousSiblingId,
      previousSibling.childrenIds.length
    );
  },

  outdentBlock(blockId) {
    const workspace = get().workspace;
    const block = workspace.blocks[blockId];

    if (!block || !block.parentId) return;

    const parent = workspace.blocks[block.parentId];

    const grandParentId = parent.parentId;

    const siblings = grandParentId
      ? workspace.blocks[grandParentId].childrenIds
      : workspace.pages[block.pageId].rootBlockIds;

    const parentIndex = siblings.indexOf(parent.id);

    get().moveBlock(
      blockId,
      grandParentId,
      parentIndex + 1
    );
  },

  toggleCollapse(blockId) {
    set((state) => {
      const block = state.workspace.blocks[blockId];

      return {
        workspace: {
          ...state.workspace,

          blocks: {
            ...state.workspace.blocks,

            [blockId]: {
              ...block,
              collapsed: !block.collapsed,
            },
          },
        },
      };
    });

    get().persistWorkspace();
  },

  toggleTodo(blockId) {
    get().saveSnapshot();

    set((state) => {
      const block = state.workspace.blocks[blockId];

      return {
        workspace: {
          ...state.workspace,

          blocks: {
            ...state.workspace.blocks,

            [blockId]: {
              ...block,
              checked: !block.checked,
            },
          },
        },
      };
    });

    get().persistWorkspace();
  },

  undo() {
    const history = get().history;

    if (history.length === 0) return;

    const currentWorkspace = get().workspace;

    const previousWorkspace = history[history.length - 1];

    set({
      workspace: previousWorkspace,
      history: history.slice(0, -1),
      future: [currentWorkspace, ...get().future],
    });

    get().persistWorkspace();
  },

  redo() {
    const future = get().future;

    if (future.length === 0) return;

    const currentWorkspace = get().workspace;

    const nextWorkspace = future[0];

    set({
      workspace: nextWorkspace,
      future: future.slice(1),
      history: [...get().history, currentWorkspace],
    });

    get().persistWorkspace();
  },

  toggleTheme() {
    const currentTheme = get().theme;

    const newTheme = currentTheme === "light"
      ? "dark"
      : "light";

    localStorage.setItem("theme", newTheme);

    set({
      theme: newTheme,
    });
  },

  toggleSidebar() {
    set((state) => ({
      sidebarOpen: !state.sidebarOpen,
    }));
  },

  openSearch() {
    set({
      searchOpen: true,
    });
  },

  closeSearch() {
    set({
      searchOpen: false,
    });
  },
}));