
import { ALPHABET, normalizeText } from "./alphabet.js";
import { validateKeyword } from "./validators.js";

export function encryptVigenere(text, key) {
  return processVigenere(text, key, 1);
}

export function decryptVigenere(text, key) {
  return processVigenere(text, key, -1);
}

function processVigenere(text, key, direction) {
  const normalizedText = normalizeText(text);
  const normalizedKey = validateKeyword(key);

  let result = "";
  let keyIndex = 0;

  for (const character of normalizedText) {
    const textIndex = ALPHABET.indexOf(character);

    // Символи поза українським алфавітом залишаємо без змін.
    if (textIndex === -1) {
      result += character;
      continue;
    }

    const keyCharacter = normalizedKey[keyIndex % normalizedKey.length];
    const keyValue = ALPHABET.indexOf(keyCharacter);

    const encryptedIndex =
      (textIndex + direction * keyValue + ALPHABET.length) %
      ALPHABET.length;

    result += ALPHABET[encryptedIndex];
    keyIndex++;
  }

  return result;
}
