
import { test } from "node:test";
import assert from "node:assert/strict";

import {
  encryptSubstitution,
  decryptSubstitution,
} from "../src/js/core/substitution.js";

test("шифр заміни правильно шифрує текст", () => {
  const encrypted = encryptSubstitution("СЛАВА УКРАЇНІ", "КЛЮЧ");

  assert.equal(encrypted, "ПІКЮК СИОКЖЙЄ");
});

test("шифр заміни відновлює початковий текст", () => {
  const plaintext = "СЛАВА УКРАЇНІ";
  const encrypted = encryptSubstitution(plaintext, "КЛЮЧ");

  assert.equal(
    decryptSubstitution(encrypted, "КЛЮЧ"),
    plaintext
  );
});

test("шифр заміни відхиляє порожній ключ", () => {
  assert.throws(
    () => encryptSubstitution("СЛАВА", ""),
    /Ключ не може бути порожнім/
  );
});
