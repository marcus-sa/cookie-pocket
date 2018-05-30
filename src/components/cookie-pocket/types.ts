export type CurrentTab = "overview" | "about";

export type ExposedMethods = {
  onReady?: (cookiePocket: any) => void,
  onCompliance?: (cookies: any) => void,
};

export type CookiePocketElement = HTMLElement & ExposedMethods;
