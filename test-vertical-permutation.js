
import {
  encryptVerticalPermutation,
  decryptVerticalPermutation,
} from "./src/js/core/vertical-permutation.js";

const key = [3, 1, 4, 2];
const plaintext = "КРИПТОГРАФІЯ";

const encrypted = encryptVerticalPermutation(plaintext, key);
const decrypted = decryptVerticalPermutation(encrypted, key);

console.log("Відкритий текст:", plaintext);
console.log("Ключ:", key.join(" "));
console.log("Шифротекст:", encrypted);
console.log("Розшифрований текст:", decrypted);
console.log("Зворотність:", decrypted === plaintext);
