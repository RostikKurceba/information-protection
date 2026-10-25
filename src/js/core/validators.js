
import {
  ALPHABET,
  normalizeText,
} from "./alphabet.js";

import { CipherError } from "./errors.js";

export function validateKeyword(key) {
  if (typeof key !== "string" || key.length === 0) {
    throw new CipherError("Ключ не може бути порожнім.");
  }

  const normalizedKey = normalizeText(key);

  if (normalizedKey.length === 0) {
    throw new CipherError("Ключ не може бути порожнім.");
  }

  for (const character of normalizedKey) {
    if (!ALPHABET.includes(character)) {
      throw new CipherError(
        "Ключ повинен містити лише українські літери."
      );
    }
  }

  return normalizedKey;
}

export function validatePermutation(permutation) {
  if (!Array.isArray(permutation) || permutation.length === 0) {
    throw new CipherError(
      "Перестановка повинна бути непорожнім масивом."
    );
  }

  const length = permutation.length;
  const expected = new Set(
    Array.from({ length }, (_, index) => index + 1)
  );

  if (
    permutation.some(
      (value) =>
        !Number.isInteger(value) || !expected.has(value)
    ) ||
    new Set(permutation).size !== length
  ) {
    throw new CipherError(
      `Ключ повинен містити числа від 1 до ${length} без повторень.`
    );
  }

  return permutation;
}
