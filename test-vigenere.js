
import {
  encryptVigenere,
  decryptVigenere,
} from "./src/js/core/vigenere.js";

const key = "КЛЮЧ";
const plaintext = "СЛАВА УКРАЇНІ";

const encrypted = encryptVigenere(plaintext, key);
const decrypted = decryptVigenere(encrypted, key);

console.log("Відкритий текст:", plaintext);
console.log("Ключ:", key);
console.log("Шифротекст:", encrypted);
console.log("Розшифрований текст:", decrypted);

console.log(
  "Зворотність:",
  decrypted === plaintext.normalize("NFC").toUpperCase()
);
