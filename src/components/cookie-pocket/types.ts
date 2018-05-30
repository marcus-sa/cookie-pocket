export type CurrentTab = "overview" | "about";

export type CookieLevels = {
  necessary?: boolean,
  preferences?: boolean,
  statistics?: boolean,
  marketing?: boolean,
};

export type CookiePocketCookies = {
  consent?: boolean,//'accepted',
  levels?: CookieLevels,
};

export type ExposedMethods = {
  onReady?: () => any,
  onCompliance: (cookieLevels: CookieLevels) => any,
};

export type CookiePocketElement = HTMLElement & ExposedMethods;
