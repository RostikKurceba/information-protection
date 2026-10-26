
export const ALPHABETS = {
  uk: "АБВГҐДЕЄЖЗИІЇЙКЛМНОПРСТУФХЦЧШЩЬЮЯ",
  en: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
};

export const SQUARE_SYMBOLS = {
  uk: ALPHABETS.uk + "012",
  en: ALPHABETS.en + "0123456789",
};

export function normalizeText(text) {
  return text.normalize("NFC").toUpperCase();
}

export function getAlphabet(language) {
  const alphabet = ALPHABETS[language];

  if (!alphabet) {
    throw new Error("Невідома мова. Виберіть українську або латинську.");
  }

  return alphabet;
}

export function buildSquare(language, keyword) {
  const base = SQUARE_SYMBOLS[language];

  if (!base) {
    throw new Error("Невідома мова для побудови квадрата.");
  }

  const normalizedKey = normalizeText(keyword);

  if (!normalizedKey.trim()) {
    throw new Error("Ключове слово не може бути порожнім.");
  }

  const allowed = new Set(base);

  for (const char of normalizedKey) {
    if (!allowed.has(char)) {
      throw new Error(
        `Недопустимий символ у ключовому слові: "${char}".`
      );
    }
  }

  if (![...normalizedKey].some(char => ALPHABETS[language].includes(char))) {
    throw new Error("Ключове слово повинно містити хоча б одну літеру.");
  }

  const uniqueKey = [...new Set(normalizedKey)];
  const remaining = [...base].filter(char => !uniqueKey.includes(char));
  const symbols = [...uniqueKey, ...remaining];

  if (symbols.length !== 36 || new Set(symbols).size !== 36) {
    throw new Error("Не вдалося побудувати коректний квадрат 6 × 6.");
  }

  return Array.from({ length: 6 }, (_, row) =>
    symbols.slice(row * 6, row * 6 + 6)
  );
}

export function createSquareMaps(square) {
  const charToCoordinates = new Map();
  const coordinatesToChar = new Map();

  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 6; col++) {
      const char = square[row][col];
      const coordinates = `${row + 1}${col + 1}`;

      charToCoordinates.set(char, coordinates);
      coordinatesToChar.set(coordinates, char);
    }
  }

  return { charToCoordinates, coordinatesToChar };
}
