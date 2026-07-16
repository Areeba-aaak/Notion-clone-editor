export function searchWorkspace(workspace, searchTerm) {
  if (!searchTerm.trim()) {
    return [];
  }

  const query = searchTerm.toLowerCase();

  const results = [];

  Object.values(workspace.pages).forEach((page) => {
    if (page.title.toLowerCase().includes(query)) {
      results.push({
        type: "page",
        pageId: page.id,
        pageTitle: page.title,
        content: page.title,
      });
    }

    Object.values(workspace.blocks).forEach((block) => {
      if (
        block.pageId === page.id &&
        block.content.toLowerCase().includes(query)
      ) {
        results.push({
          type: "block",
          pageId: page.id,
          blockId: block.id,
          pageTitle: page.title,
          content: block.content,
        });
      }
    });
  });

  return results;
}