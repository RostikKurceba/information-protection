
export const ALPHABET =
  "АБВГҐДЕЄЖЗИІЇЙКЛМНОПРСТУФХЦЧШЩЬЮЯ";

export const ALPHABET_LENGTH = ALPHABET.length;

export function normalizeText(text) {
  if (typeof text !== "string") {
    throw new TypeError("Текст повинен бути рядком.");
  }

  return text.normalize("NFC").toUpperCase();
}

export function getLetterIndex(letter) {
  return ALPHABET.indexOf(letter);
}

export function isAlphabetLetter(character) {
  return ALPHABET.includes(character);
}
