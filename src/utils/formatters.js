import { toWords } from "number-to-chinese-words";

export const toTitleCase = (text) => text.charAt(0).toUpperCase() + text.slice(1);

export function localizeNumber(number, lang) {
    if (lang.startsWith('zh')) {
        return toWords(number);
    }
    return new Intl.NumberFormat(lang).format(number);
}

export const convertIfNumber = (str) => {
    const trimmed = str.trim();
    return !isNaN(trimmed) && trimmed !== '' ? Number(trimmed) : str;
};