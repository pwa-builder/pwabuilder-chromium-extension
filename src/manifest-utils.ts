export async function fetchManifest(manifestUri: string) {
  const response = await fetch(manifestUri);
  const json = await response.json();
  return json;
}

export const maniTestValues = [
  {
    name: "name",
    errorString: "name is required and should be a string with a length > 0",
    test: (value: string) => {
      return value && typeof value === "string" && value.length > 0;
    },
  },
  {
    name: "short_name",
    errorString:
      "short_name is required and should be a string with a length > 0",
    test: (value: string) =>
      value && typeof value === "string" && value.length > 0,
  },
  {
    name: "description",
    errorString:
      "description is required and should be a string with a length > 0",
    test: (value: string) =>
      value && typeof value === "string" && value.length > 0,
  },
  {
    name: "icons",
    errorString: "icons is required and should be an array with a length > 0",
    test: (value: string) =>
      value && Array.isArray(value) && value.length > 0 ? true : false,
  },
  {
    name: "display",
    errorString:
      "display is required and should be either fullscreen, standalone, minimal-ui, browser",
    test: (value: string) => {
      return ["fullscreen", "standalone", "minimal-ui", "browser"].includes(
        value
      );
    },
  },
  {
    name: "orientation",
    errorString:
      "orientation is required and should be either any, natural, landscape, landscape-primary, landscape-secondary, portrait, portrait-primary, portrait-secondary",
    test: (value: string) => {
      return isStandardOrientation(value);
    },
  },
  {
    name: "background_color",
    errorString: "background_color is required and should be a valid hex color",
    test: (value: string) => {
      const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
      return hexRegex.test(value);
    },
  },
  {
    name: "theme_color",
    errorString: "theme_color is required and should be a valid hex color",
    test: (value: string) => {
      const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
      return hexRegex.test(value);
    },
  },
  {
    name: "start_url",
    errorString:
      "start_url is required and should be a string with a length > 0",
    test: (value: string) =>
      value && typeof value === "string" && value.length > 0,
  },
];

function isStandardOrientation(orientation: string): boolean {
  const standardOrientations = [
    "any",
    "natural",
    "landscape",
    "landscape-primary",
    "landscape-secondary",
    "portrait",
    "portrait-primary",
    "portrait-secondary",
  ];
  return standardOrientations.includes(orientation);
}