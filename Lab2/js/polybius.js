
import {
  normalizeText,
  buildSquare,
  createSquareMaps,
} from "./alphabets.js";

/**
 * Шифрування Полібія в координатному режимі.
 * Кожен символ замінюється координатами рядка і стовпця.
 */
export function encryptCoordinates(text, language, keyword) {
  const normalizedText = normalizeText(text);
  const square = buildSquare(language, keyword);
  const { charToCoordinates } = createSquareMaps(square);

  const tokens = [];

  for (const char of normalizedText) {
    const coordinates = charToCoordinates.get(char);

    if (!coordinates) {
      throw new Error(
        `Символ "${char}" відсутній у квадраті. ` +
        "Координатний режим приймає лише символи квадрата."
      );
    }

    tokens.push(coordinates);
  }

  return tokens.join(" ");
}

/**
 * Розшифрування координатного шифротексту.
 * Кожен токен повинен містити дві цифри від 1 до 6.
 */
export function decryptCoordinates(cipherText, language, keyword) {
  const square = buildSquare(language, keyword);
  const { coordinatesToChar } = createSquareMaps(square);

  const normalizedText = cipherText.trim();

  if (!normalizedText) {
    return "";
  }

  const tokens = normalizedText.split(/\s+/);
  const result = [];

  for (const token of tokens) {
    if (!/^[1-6]{2}$/.test(token)) {
      throw new Error(
        `Некоректні координати "${token}". ` +
        "Кожен токен повинен містити дві цифри від 1 до 6."
      );
    }

    const char = coordinatesToChar.get(token);

    if (!char) {
      throw new Error(`Невідомі координати: "${token}".`);
    }

    result.push(char);
  }

  return result.join("");
}

/**
 * Циклічний зсув символів на один рядок униз.
 * Символи поза квадратом залишаються без змін.
 */
export function encryptRowShift(text, language, keyword) {
  return shiftRows(text, language, keyword, 1);
}

/**
 * Циклічний зсув символів на один рядок угору.
 */
export function decryptRowShift(text, language, keyword) {
  return shiftRows(text, language, keyword, -1);
}

function shiftRows(text, language, keyword, direction) {
  const normalizedText = normalizeText(text);
  const square = buildSquare(language, keyword);
  const { charToCoordinates } = createSquareMaps(square);

  const result = [];

  for (const char of normalizedText) {
    const coordinates = charToCoordinates.get(char);

    // Пробіли, розділові знаки та інші сторонні символи зберігаємо.
    if (!coordinates) {
      result.push(char);
      continue;
    }

    const row = Number(coordinates[0]) - 1;
    const col = Number(coordinates[1]) - 1;

    const newRow = (row + direction + 6) % 6;

    result.push(square[newRow][col]);
  }

  return result.join("");
}
