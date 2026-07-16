const STORAGE_KEY = "notion-editor-workspace";

export function saveWorkspace(workspace) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(workspace));
  } catch (error) {
    console.error("Failed to save workspace:", error);
  }
}

export function loadWorkspace() {
  try {
    const savedWorkspace = localStorage.getItem(STORAGE_KEY);

    if (!savedWorkspace) {
      return null;
    }

    return JSON.parse(savedWorkspace);
  } catch (error) {
    console.error("Failed to load workspace:", error);
    return null;
  }
}

export function clearWorkspace() {
  localStorage.removeItem(STORAGE_KEY);
}