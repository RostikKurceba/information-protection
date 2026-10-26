
import { ALPHABETS, normalizeText } from "./alphabets.js";

/**
 * Перевіряє цифровий ключ Гронсфельда.
 * Ключ залишається рядком, щоб не втратити початкові нулі.
 */
export function validateGronsfeldKey(key) {
  if (typeof key !== "string" || key.length === 0) {
    throw new Error("Цифровий ключ не може бути порожнім.");
  }

  if (!/^[0-9]+$/.test(key)) {
    throw new Error(
      "Ключ Гронсфельда повинен містити лише цифри від 0 до 9."
    );
  }

  if (!/[1-9]/.test(key)) {
    throw new Error(
      "Ключ Гронсфельда повинен містити хоча б одну ненульову цифру."
    );
  }

  return key;
}

/**
 * Шифрує текст шифром Гронсфельда.
 */
export function encryptGronsfeld(text, language, key) {
  return processGronsfeld(text, language, key, 1);
}

/**
 * Розшифровує текст шифром Гронсфельда.
 */
export function decryptGronsfeld(text, language, key) {
  return processGronsfeld(text, language, key, -1);
}

function processGronsfeld(text, language, key, direction) {
  const alphabet = ALPHABETS[language];

  if (!alphabet) {
    throw new Error(
      "Невідома мова. Виберіть український або латинський алфавіт."
    );
  }

  const validKey = validateGronsfeldKey(key);
  const normalizedText = normalizeText(text);
  const alphabetSize = alphabet.length;

  let keyIndex = 0;
  let result = "";

  for (const char of normalizedText) {
    const charIndex = alphabet.indexOf(char);

    // Сторонні символи залишаються без змін
    // і не просувають індекс цифрового ключа.
    if (charIndex === -1) {
      result += char;
      continue;
    }

    const shift = Number(
      validKey[keyIndex % validKey.length]
    );

    const shiftedIndex =
      (charIndex + direction * shift + alphabetSize) %
      alphabetSize;

    result += alphabet[shiftedIndex];
    keyIndex++;
  }

  return result;
}
