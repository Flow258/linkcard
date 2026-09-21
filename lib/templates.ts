import { CardColors, CardLayout } from "./types";

export interface Template {
  id: string;
  name: string;
  category: "Professional" | "Developer" | "Creative" | "Business";
  colors: CardColors;
  fontId: "body" | "display" | "stamp";
  layout: CardLayout;
  isPremium: boolean;
}

export const TEMPLATES: Template[] = [
  {
    id: "minimal",
    name: "Minimal",
    category: "Professional",
    colors: { background: "#EEEDE4", text: "#1B211F", accent: "#7A2E3B", button: "#1B211F" },
    fontId: "body",
    layout: { photoShape: "circle", align: "left", buttonStyle: "text" },
    isPremium: false,
  },
  {
    id: "profile",
    name: "Profile",
    category: "Professional",
    colors: { background: "#FFFFFF", text: "#1B211F", accent: "#22403D", button: "#22403D" },
    fontId: "display",
    layout: { photoShape: "circle", align: "center", buttonStyle: "filled" },
    isPremium: false,
  },
  {
    id: "executive",
    name: "Executive",
    category: "Professional",
    colors: { background: "#1B211F", text: "#EEEDE4", accent: "#A9803A", button: "#A9803A" },
    fontId: "display",
    layout: { photoShape: "rounded", align: "center", buttonStyle: "outline" },
    isPremium: false,
  },
  {
    id: "developer",
    name: "Developer",
    category: "Developer",
    colors: { background: "#12181B", text: "#D8E4E1", accent: "#5FD3A0", button: "#5FD3A0" },
    fontId: "stamp",
    layout: { photoShape: "square", align: "left", buttonStyle: "outline" },
    isPremium: false,
  },
  {
    id: "terminal",
    name: "Terminal",
    category: "Developer",
    colors: { background: "#0B0F0E", text: "#B7FFCB", accent: "#4CFF7A", button: "#4CFF7A" },
    fontId: "stamp",
    layout: { photoShape: "square", align: "left", buttonStyle: "text" },
    isPremium: true,
  },
  {
    id: "creative",
    name: "Creative",
    category: "Creative",
    colors: { background: "#F4E9DA", text: "#3A2E27", accent: "#C1502E", button: "#3A2E27" },
    fontId: "display",
    layout: { photoShape: "rounded", align: "center", buttonStyle: "glass" },
    isPremium: false,
  },
  {
    id: "colorful",
    name: "Colorful",
    category: "Creative",
    colors: { background: "#2C2145", text: "#FFFFFF", accent: "#FF7A5C", button: "#FF7A5C" },
    fontId: "display",
    layout: { photoShape: "circle", align: "center", buttonStyle: "filled" },
    isPremium: true,
  },
  {
    id: "business",
    name: "Business",
    category: "Business",
    colors: { background: "#EFF1EC", text: "#1B211F", accent: "#1F6F63", button: "#1F6F63" },
    fontId: "body",
    layout: { photoShape: "rounded", align: "left", buttonStyle: "filled" },
    isPremium: false,
  },
  {
    id: "agency",
    name: "Agency",
    category: "Business",
    colors: { background: "#FFFFFF", text: "#1B211F", accent: "#B65C3D", button: "#1B211F" },
    fontId: "display",
    layout: { photoShape: "square", align: "center", buttonStyle: "outline" },
    isPremium: false,
  },
];

export function getTemplate(id: string): Template {
  return TEMPLATES.find((t) => t.id === id) ?? TEMPLATES[0];
}
