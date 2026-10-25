
import { normalizeText } from "./alphabet.js";
import { validatePermutation } from "./validators.js";

export function encryptBlockPermutation(text, key) {
  const normalizedText = normalizeText(text);
  validatePermutation(key);

  let result = "";

  // Обробляємо текст блоками розміром з ключ.
  for (let i = 0; i < normalizedText.length; i += key.length) {
    const block = normalizedText.slice(i, i + key.length);

    // Неповний останній блок залишаємо без змін.
    if (block.length < key.length) {
      result += block;
      continue;
    }

    // Переставляємо символи відповідно до ключа.
    for (const position of key) {
      result += block[position - 1];
    }
  }

  return result;
}

export function decryptBlockPermutation(text, key) {
  const normalizedText = normalizeText(text);
  validatePermutation(key);

  let result = "";

  for (let i = 0; i < normalizedText.length; i += key.length) {
    const block = normalizedText.slice(i, i + key.length);

    if (block.length < key.length) {
      result += block;
      continue;
    }

    // Відновлюємо початкові позиції символів.
    const originalBlock = new Array(key.length);

    for (let j = 0; j < key.length; j++) {
      originalBlock[key[j] - 1] = block[j];
    }

    result += originalBlock.join("");
  }

  return result;
}
