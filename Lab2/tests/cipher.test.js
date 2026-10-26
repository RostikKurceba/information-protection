
import test from "node:test";
import assert from "node:assert/strict";

import {
  buildSquare,
} from "../js/alphabets.js";

import {
  encryptCoordinates,
  decryptCoordinates,
  encryptRowShift,
  decryptRowShift,
} from "../js/polybius.js";

import {
  encryptGronsfeld,
  decryptGronsfeld,
  validateGronsfeldKey,
} from "../js/gronsfeld.js";

// 1. Квадрат Полібія: українські координати
test("Полібій: український контрольний вектор", () => {
  assert.equal(
    encryptCoordinates("СЛАВА", "uk", "БЕЗПЕКА"),
    "44 35 16 21 16"
  );
});

// 2. Квадрат Полібія: латинські координати
test("Полібій: латинський контрольний вектор", () => {
  assert.equal(
    encryptCoordinates("HELLO", "en", "SECURITY"),
    "32 12 35 35 42"
  );
});

// 3. Полібій: український зсув за рядками
test("Полібій: український зсув за рядками", () => {
  assert.equal(
    encryptRowShift("СЛАВА", "uk", "БЕЗПЕКА"),
    "ЧТЖИЖ"
  );
});

// 4. Полібій: латинський зсув за рядками
test("Полібій: латинський зсув за рядками", () => {
  assert.equal(
    encryptRowShift("HELLO", "en", "SECURITY"),
    "OYVVZ"
  );
});

// 5. Гронсфельд: український контрольний вектор
test("Гронсфельд: український контрольний вектор", () => {
  assert.equal(
    encryptGronsfeld("СЛАВА УКРАЇНІ", "uk", "31415"),
    "ФМҐГД ЦЛФБНРЇ"
  );
});

// 6. Гронсфельд: латинський контрольний вектор
test("Гронсфельд: латинський контрольний вектор", () => {
  assert.equal(
    encryptGronsfeld("HELLO WORLD", "en", "2718"),
    "JLMTQ DPZNK"
  );
});

// Перевірка зворотності координатного шифрування
test("Полібій: координати можна розшифрувати", () => {
  const encrypted = encryptCoordinates("СЛАВА", "uk", "БЕЗПЕКА");

  assert.equal(
    decryptCoordinates(encrypted, "uk", "БЕЗПЕКА"),
    "СЛАВА"
  );
});

// Перевірка зворотності зсуву за рядками
test("Полібій: зсув за рядками можна скасувати", () => {
  const original = "СЛАВА, УКРАЇНО!";
  const encrypted = encryptRowShift(original, "uk", "БЕЗПЕКА");

  assert.equal(
    decryptRowShift(encrypted, "uk", "БЕЗПЕКА"),
    original
  );
});

// Перевірка зворотності шифру Гронсфельда
test("Гронсфельд: зашифрований текст можна розшифрувати", () => {
  const original = "HELLO WORLD 123";
  const encrypted = encryptGronsfeld(original, "en", "02718");

  assert.equal(
    decryptGronsfeld(encrypted, "en", "02718"),
    original
  );
});

// Перевірка побудови квадрата
test("Квадрат Полібія має 36 унікальних символів", () => {
  const square = buildSquare("uk", "БЕЗПЕКА");
  const symbols = square.flat();

  assert.equal(square.length, 6);
  assert.ok(square.every((row) => row.length === 6));
  assert.equal(symbols.length, 36);
  assert.equal(new Set(symbols).size, 36);
});

// Перевірка некоректних координат
test("Полібій: некоректні координати відхиляються", () => {
  for (const coordinates of ["00", "17", "67", "1", "123"]) {
    assert.throws(
      () => decryptCoordinates(coordinates, "uk", "БЕЗПЕКА"),
      /Некоректні координати/
    );
  }
});

// Перевірка порожнього ключа Гронсфельда
test("Гронсфельд: порожній ключ відхиляється", () => {
  assert.throws(
    () => validateGronsfeldKey(""),
    /не може бути порожнім/
  );
});

// Перевірка ключа, який містить не цифри
test("Гронсфельд: ключ із літерами відхиляється", () => {
  assert.throws(
    () => validateGronsfeldKey("12A3"),
    /лише цифри/
  );
});

// Перевірка ключа, що складається лише з нулів
test("Гронсфельд: ключ із самих нулів відхиляється", () => {
  assert.throws(
    () => validateGronsfeldKey("0000"),
    /ненульову цифру/
  );
});

// Початкові нулі ключа мають зберігатися
test("Гронсфельд: ключ із початковим нулем допустимий", () => {
  assert.equal(validateGronsfeldKey("02718"), "02718");
});
