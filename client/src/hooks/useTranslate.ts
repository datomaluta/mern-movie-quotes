import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { translations } from "../lang/common";

type TranslationObject = {
  [key: string]: {
    [key: string]: string;
  };
};

type UseTranslateFunction = (
  translateObj?: TranslationObject,
  anotherObj?: TranslationObject,
  thirdObj?: TranslationObject
) => {
  t: (key: string) => string;
};

export const useTranslate: UseTranslateFunction = (
  translateObj = translations,
  anotherObj = {},
  thirdObj = {}
) => {
  const concatedObj: TranslationObject = {
    ...translateObj,
    ...anotherObj,
    ...thirdObj,
  };
  const { lang } = useSelector((state: RootState) => state.lang);

  const t = (key: string) => {
    if (concatedObj[key]) {
      return concatedObj[key][lang] || key;
    } else {
      return key;
    }
  };

  return { t };
};
