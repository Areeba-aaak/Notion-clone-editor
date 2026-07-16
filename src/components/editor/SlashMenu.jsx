import { BLOCK_TYPE_OPTIONS } from "../../constants/blockTypes";

export default function SlashMenu({
  searchTerm,
  onSelect,
}) {
  const filteredOptions =
    BLOCK_TYPE_OPTIONS.filter((option) =>
      option.label
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );

  return (
    <div className="absolute left-0 top-full z-50 mt-2 w-64 rounded-lg border border-gray-200 bg-white p-2 shadow-xl dark:border-gray-700 dark:bg-gray-900">
      <p className="px-2 py-1 text-xs text-gray-400">
        Block types
      </p>

      {filteredOptions.map((option) => (
        <button
          key={option.type}
          onMouseDown={(event) => {
            event.preventDefault();
            onSelect(option.type);
          }}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <span className="w-8 text-center">
            {option.icon}
          </span>

          <span className="text-sm">
            {option.label}
          </span>
        </button>
      ))}

      {filteredOptions.length === 0 && (
        <p className="p-3 text-sm text-gray-400">
          No commands found.
        </p>
      )}
    </div>
  );
}