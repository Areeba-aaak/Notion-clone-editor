export default function Button({
  children,
  onClick,
  className = "",
  title,
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`
        rounded-md
        px-3
        py-2
        text-sm
        transition
        hover:bg-gray-100
        dark:hover:bg-gray-800
        ${className}
      `}
    >
      {children}
    </button>
  );
}