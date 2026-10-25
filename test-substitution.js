
import {
  encryptSubstitution,
  decryptSubstitution,
} from "./src/js/core/substitution.js";

const key = "КЛЮЧ";
const plaintext = "СЛАВА УКРАЇНІ";

const encrypted = encryptSubstitution(plaintext, key);
const decrypted = decryptSubstitution(encrypted, key);

console.log("Відкритий текст:", plaintext);
console.log("Ключ:", key);
console.log("Шифротекст:", encrypted);
console.log("Розшифрований текст:", decrypted);

console.log(
  "Зворотність:",
  decrypted === plaintext.normalize("NFC").toUpperCase()
);
