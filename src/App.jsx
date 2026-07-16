import AppLayout from "./components/layout/AppLayout.jsx";

import useKeyboardShortcuts from "./hooks/useKeyboardShortcuts";

export default function App() {
  useKeyboardShortcuts();

  return <AppLayout />;
}