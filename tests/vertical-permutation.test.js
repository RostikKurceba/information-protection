
import { test } from "node:test";
import assert from "node:assert/strict";

import {
  encryptVerticalPermutation,
  decryptVerticalPermutation,
} from "../src/js/core/vertical-permutation.js";

test("вертикальна перестановка відповідає результату з методички", () => {
  assert.equal(
    encryptVerticalPermutation("КРИПТОГРАФІЯ", [3, 1, 4, 2]),
    "ИГІКТАПРЯРОФ"
  );
});

test("вертикальна перестановка відновлює початковий текст", () => {
  const plaintext = "КРИПТОГРАФІЯ";
  const key = [3, 1, 4, 2];

  assert.equal(
    decryptVerticalPermutation(
      encryptVerticalPermutation(plaintext, key),
      key
    ),
    plaintext
  );
});

test("вертикальна перестановка відхиляє неправильний ключ", () => {
  assert.throws(
    () => encryptVerticalPermutation("ТЕКСТ", [1, 2, 2]),
    /Ключ повинен містити числа/
  );
});
