export const BLOCK_TYPES = {
  PARAGRAPH: "paragraph",
  HEADING_1: "heading1",
  HEADING_2: "heading2",
  HEADING_3: "heading3",
  TODO: "todo",
  BULLET: "bullet",
  NUMBERED: "numbered",
  QUOTE: "quote",
  CODE: "code",
  CALLOUT: "callout",
  DIVIDER: "divider",
};

export const BLOCK_TYPE_OPTIONS = [
  {
    type: BLOCK_TYPES.PARAGRAPH,
    label: "Paragraph",
    icon: "¶",
  },
  {
    type: BLOCK_TYPES.HEADING_1,
    label: "Heading 1",
    icon: "H1",
  },
  {
    type: BLOCK_TYPES.HEADING_2,
    label: "Heading 2",
    icon: "H2",
  },
  {
    type: BLOCK_TYPES.HEADING_3,
    label: "Heading 3",
    icon: "H3",
  },
  {
    type: BLOCK_TYPES.TODO,
    label: "To-do",
    icon: "☑",
  },
  {
    type: BLOCK_TYPES.BULLET,
    label: "Bulleted List",
    icon: "•",
  },
  {
    type: BLOCK_TYPES.NUMBERED,
    label: "Numbered List",
    icon: "1.",
  },
  {
    type: BLOCK_TYPES.QUOTE,
    label: "Quote",
    icon: '"',
  },
  {
    type: BLOCK_TYPES.CODE,
    label: "Code",
    icon: "</>",
  },
  {
    type: BLOCK_TYPES.CALLOUT,
    label: "Callout",
    icon: "💡",
  },
  {
    type: BLOCK_TYPES.DIVIDER,
    label: "Divider",
    icon: "—",
  },
];