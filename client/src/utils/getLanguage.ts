interface PersistedState {
  user?: string;
  lang?: string;
  _persist?: string;
}

interface LangState {
  lang: string;
}

export const getLanguageFromLocalStorage = (): string => {
  const persistState = localStorage.getItem("persist:root");
  if (persistState) {
    try {
      const parsedState: PersistedState = JSON.parse(persistState);
      if (parsedState.lang) {
        const langState: LangState = JSON.parse(parsedState.lang);
        return langState.lang || "en"; // Default to 'en' if lang is not found
      }
    } catch (error) {
      console.error("Error parsing localStorage:", error);
    }
  }
  return "en"; // Default if persist:root or lang is not found
};
