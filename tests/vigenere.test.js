
import { test } from "node:test";
import assert from "node:assert/strict";

import {
  encryptVigenere,
  decryptVigenere,
} from "../src/js/core/vigenere.js";

test("шифр Віженера відповідає результату з методички", () => {
  assert.equal(
    encryptVigenere("СЛАВА УКРАЇНІ", "КЛЮЧ"),
    "ВЬЮЩК ДЇККЧЛД"
  );
});

test("шифр Віженера відновлює початковий текст", () => {
  const plaintext = "СЛАВА УКРАЇНІ";
  const encrypted = encryptVigenere(plaintext, "КЛЮЧ");

  assert.equal(decryptVigenere(encrypted, "КЛЮЧ"), plaintext);
});

test("шифр Віженера відхиляє порожній ключ", () => {
  assert.throws(
    () => encryptVigenere("СЛАВА", ""),
    /Ключ не може бути порожнім/
  );
});
