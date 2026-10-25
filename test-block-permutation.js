
import {
  encryptBlockPermutation,
  decryptBlockPermutation,
} from "./src/js/core/block-permutation.js";

const key = [3, 2, 5, 1, 4];
const plaintext = "СЛАВАУКРАЇНІ";

const encrypted = encryptBlockPermutation(plaintext, key);
const decrypted = decryptBlockPermutation(encrypted, key);

console.log("Відкритий текст:", plaintext);
console.log("Ключ:", key.join(" "));
console.log("Шифротекст:", encrypted);
console.log("Розшифрований текст:", decrypted);
console.log("Зворотність:", decrypted === plaintext);
