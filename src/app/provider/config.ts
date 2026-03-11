export interface PageConfig {
  title: string;
  description: string;
}

export interface ProviderConfig {
  name: string;
  title: string;
  pages: Record<string, PageConfig>;
}

export const providerConfig: Record<string, ProviderConfig> = {
  google: {
    name: "google",
    title: "Google AI",
    pages: {
      "": {
        title: "Google AI",
        description: "Google AI API Testing",
      },
      "gemini-2.5-flash": {
        title: "gemini-2.5-flash-preview-05-20",
        description: "Google AI Flash Model - Fast Response",
      },
      settings: {
        title: "GOOGLE CONFIG",
        description: "Configure Google AI API Settings",
      },
    },
  },
  doubao: {
    name: "doubao",
    title: "DOUBÃO",
    pages: {
      "": {
        title: "DOUBÃO",
        description: "Doubao AI API Testing",
      },
      settings: {
        title: "DOUBÃO CONFIG",
        description: "Configure Doubao API Settings",
      },
    },
  },
  z: {
    name: "z",
    title: "Z AI",
    pages: {
      "": {
        title: "Z AI",
        description: "Z AI API Testing",
      },
      settings: {
        title: "Z AI CONFIG",
        description: "Configure Z AI API Settings",
      },
    },
  },
};
