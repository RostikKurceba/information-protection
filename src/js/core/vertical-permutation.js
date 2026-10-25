
import { normalizeText } from "./alphabet.js";
import { validatePermutation } from "./validators.js";

export function encryptVerticalPermutation(text, key) {
  const normalizedText = normalizeText(text);
  validatePermutation(key);

  const columns = key.length;
  let result = "";

  // Записуємо текст у таблицю рядками.
  const rows = Math.ceil(normalizedText.length / columns);
  const table = [];

  for (let row = 0; row < rows; row++) {
    table.push(
      normalizedText.slice(row * columns, (row + 1) * columns)
    );
  }

  // Зчитуємо стовпці в порядку, заданому ключем.
  for (const position of key) {
    const column = position - 1;

    for (let row = 0; row < rows; row++) {
      if (column < table[row].length) {
        result += table[row][column];
      }
    }
  }

  return result;
}

export function decryptVerticalPermutation(text, key) {
  const normalizedText = normalizeText(text);
  validatePermutation(key);

  const columns = key.length;
  const rows = Math.ceil(normalizedText.length / columns);
  const remainder = normalizedText.length % columns;

  // Визначаємо кількість символів у кожному стовпці.
  const columnLengths = Array(columns).fill(rows);

  if (remainder !== 0) {
    for (let column = remainder; column < columns; column++) {
      columnLengths[column]--;
    }
  }

  // Заповнюємо стовпці в порядку ключа.
  const table = Array.from(
    { length: rows },
    () => Array(columns).fill("")
  );

  let textIndex = 0;

  for (const position of key) {
    const column = position - 1;

    for (let row = 0; row < columnLengths[column]; row++) {
      table[row][column] = normalizedText[textIndex];
      textIndex++;
    }
  }

  // Відновлюємо текст, читаючи таблицю рядками.
  let result = "";

  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      result += table[row][column];
    }
  }

  return result;
}
