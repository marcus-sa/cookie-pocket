export type CurrentTab = "overview" | "about";

export type ComplianceOptions = {
  expires: number;
  path: string;
};

export type CookieLevels = {
  necessary?: boolean,
  preferences?: boolean,
  statistics?: boolean,
  marketing?: boolean,
};

export type CookiePocketCookies = {
  consent?: boolean,
  levels?: CookieLevels,
};

export type ExposedMethods = {
  onReady?: () => any,
  onComplete: (cookieLevels: CookieLevels) => any,
};

export type CookiePocketElement = HTMLElement & ExposedMethods;
