export type CurrentTab = "declaration" | "about";

export type ExposedMethods = {
  onReady?: (cookiePocket: any) => void,
  onCompliance?: (cookies: any) => void,
};

export type CookiePocketElement = HTMLElement & ExposedMethods;
