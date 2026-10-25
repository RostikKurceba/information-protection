
import { ALPHABET, normalizeText } from "./alphabet.js";
import { validateKeyword } from "./validators.js";

function buildSubstitutionAlphabet(key) {
  const normalizedKey = validateKeyword(key);
  let substitutionAlphabet = "";

  // Додаємо унікальні літери ключа в початковому порядку.
  for (const letter of normalizedKey) {
    if (!substitutionAlphabet.includes(letter)) {
      substitutionAlphabet += letter;
    }
  }

  // Доповнюємо таблицю літерами, яких ще немає.
  for (const letter of ALPHABET) {
    if (!substitutionAlphabet.includes(letter)) {
      substitutionAlphabet += letter;
    }
  }

  return substitutionAlphabet;
}

export function encryptSubstitution(text, key) {
  const normalizedText = normalizeText(text);
  const substitutionAlphabet = buildSubstitutionAlphabet(key);

  let result = "";

  for (const character of normalizedText) {
    const index = ALPHABET.indexOf(character);

    if (index === -1) {
      // Пробіли, цифри та розділові знаки не змінюємо.
      result += character;
    } else {
      result += substitutionAlphabet[index];
    }
  }

  return result;
}

export function decryptSubstitution(text, key) {
  const normalizedText = normalizeText(text);
  const substitutionAlphabet = buildSubstitutionAlphabet(key);

  let result = "";

  for (const character of normalizedText) {
    const index = substitutionAlphabet.indexOf(character);

    if (index === -1) {
      result += character;
    } else {
      result += ALPHABET[index];
    }
  }

  return result;
}
