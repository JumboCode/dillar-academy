import { toWords } from "number-to-chinese-words";

export const toTitleCase = (text) => text.charAt(0).toUpperCase() + text.slice(1);

export function localizeNumber(number, lang) {
  if (lang.startsWith('zh')) {
    return toWords(number);
  }
  return new Intl.NumberFormat(lang).format(number);
}

export const ensureHttps = (url) => {
  return url.startsWith("http://") || url.startsWith("https://")
    ? url
    : `https://${url}`;
};