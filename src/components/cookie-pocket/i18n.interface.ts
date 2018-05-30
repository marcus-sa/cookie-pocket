export interface I18n {
  cookieDeclaration?: string,
  acceptLabel?: string,
  aboutLabel?: string,
  details?: {
    show?: string,
    hide?: string,
  },
  categories?: {
    // Default categories
    necessary?: string,
    preferences?: string,
    statistics?: string,
    marketing?: string,
    userExperience?: string,
    unclassified?: string,
    advertising?: string,

    // Custom categories
    [category: string]: string,
  },
}
