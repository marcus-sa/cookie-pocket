export interface I18n {
  cookieDeclaration?: string,
  acceptLabel?: string,
  about?: string,
  details?: {
    show?: string,
    hide?: string,
  },
  categories?: {
    // Default categories
    necessary?: string,
    preferences?: string,
    statistics?: string,
    userExperience?: string,

    // Custom categories
    [category: string]: string,
  },
}
