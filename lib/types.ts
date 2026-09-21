export type LinkType =
  | "github"
  | "linkedin"
  | "portfolio"
  | "website"
  | "instagram"
  | "facebook"
  | "x"
  | "youtube"
  | "tiktok"
  | "whatsapp"
  | "telegram"
  | "discord"
  | "custom";

export interface ProfileLink {
  id: string;
  type: LinkType;
  label: string;
  url: string;
  visible: boolean;
}

export interface CardColors {
  background: string;
  text: string;
  accent: string;
  button: string;
}

export type PhotoShape = "circle" | "rounded" | "square";
export type Alignment = "left" | "center" | "right";
export type ButtonStyle = "filled" | "outline" | "text" | "glass";

export interface CardLayout {
  photoShape: PhotoShape;
  align: Alignment;
  buttonStyle: ButtonStyle;
}

export interface ContactField {
  value: string;
  public: boolean;
}

export interface Profile {
  username: string;
  displayName: string;
  jobTitle: string;
  company?: string;
  bio?: string;
  location?: string;
  photoDataUrl?: string;
  email?: ContactField;
  phone?: ContactField;
  website?: string;
  templateId: string;
  colors: CardColors;
  fontId: string;
  layout: CardLayout;
  links: ProfileLink[];
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export const EMPTY_PROFILE: Profile = {
  username: "",
  displayName: "",
  jobTitle: "",
  company: "",
  bio: "",
  location: "",
  photoDataUrl: undefined,
  email: { value: "", public: false },
  phone: { value: "", public: false },
  website: "",
  templateId: "minimal",
  colors: {
    background: "#EEEDE4",
    text: "#1B211F",
    accent: "#7A2E3B",
    button: "#1B211F",
  },
  fontId: "body",
  layout: { photoShape: "circle", align: "center", buttonStyle: "filled" },
  links: [],
  isPublic: false,
  createdAt: "",
  updatedAt: "",
};
