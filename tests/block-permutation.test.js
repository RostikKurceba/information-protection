
import { test } from "node:test";
import assert from "node:assert/strict";

import {
  encryptBlockPermutation,
  decryptBlockPermutation,
} from "../src/js/core/block-permutation.js";

test("блочна перестановка відповідає результату з методички", () => {
  assert.equal(
    encryptBlockPermutation("СЛАВАУКРАЇНІ", [3, 2, 5, 1, 4]),
    "АЛАСВРКЇУАНІ"
  );
});

test("блочна перестановка відновлює початковий текст", () => {
  const plaintext = "СЛАВАУКРАЇНІ";
  const key = [3, 2, 5, 1, 4];

  assert.equal(
    decryptBlockPermutation(
      encryptBlockPermutation(plaintext, key),
      key
    ),
    plaintext
  );
});

test("блочна перестановка відхиляє неправильний ключ", () => {
  assert.throws(
    () => encryptBlockPermutation("СЛАВА", [1, 1, 3]),
    /Ключ повинен містити числа/
  );
});
