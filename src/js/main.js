
import {
  encryptSubstitution,
  decryptSubstitution,
} from "./core/substitution.js";

import {
  encryptVigenere,
  decryptVigenere,
} from "./core/vigenere.js";

import {
  encryptBlockPermutation,
  decryptBlockPermutation,
} from "./core/block-permutation.js";

import {
  encryptVerticalPermutation,
  decryptVerticalPermutation,
} from "./core/vertical-permutation.js";

const algorithmSelect = document.querySelector("#algorithm");
const keyInput = document.querySelector("#key");
const keyHint = document.querySelector("#key-hint");
const inputText = document.querySelector("#input-text");
const outputText = document.querySelector("#output-text");
const inputCount = document.querySelector("#input-count");
const outputCount = document.querySelector("#output-count");
const errorMessage = document.querySelector("#error-message");
const fileInput = document.querySelector("#file-input");

const encryptButton = document.querySelector("#encrypt-button");
const decryptButton = document.querySelector("#decrypt-button");
const copyButton = document.querySelector("#copy-button");
const downloadButton = document.querySelector("#download-button");

const algorithms = {
  substitution: {
    encrypt: encryptSubstitution,
    decrypt: decryptSubstitution,
    hint: "Введіть ключ з українських літер, наприклад КЛЮЧ.",
    placeholder: "Наприклад, КЛЮЧ",
  },
  vigenere: {
    encrypt: encryptVigenere,
    decrypt: decryptVigenere,
    hint: "Введіть ключ з українських літер, наприклад КЛЮЧ.",
    placeholder: "Наприклад, КЛЮЧ",
  },
  block: {
    encrypt: encryptBlockPermutation,
    decrypt: decryptBlockPermutation,
    hint: "Введіть перестановку чисел через пробіл, наприклад 3 2 5 1 4.",
    placeholder: "Наприклад, 3 2 5 1 4",
  },
  vertical: {
    encrypt: encryptVerticalPermutation,
    decrypt: decryptVerticalPermutation,
    hint: "Введіть перестановку чисел через пробіл, наприклад 3 1 4 2.",
    placeholder: "Наприклад, 3 1 4 2",
  },
};

function updateCounter(element, text) {
  const count = text.length;
  element.textContent = `${count} ${getCharacterWord(count)}`;
}

function getCharacterWord(count) {
  const lastTwo = count % 100;
  const last = count % 10;

  if (lastTwo >= 11 && lastTwo <= 14) {
    return "символів";
  }

  if (last === 1) {
    return "символ";
  }

  if (last >= 2 && last <= 4) {
    return "символи";
  }

  return "символів";
}

function showError(message) {
  errorMessage.textContent = message;
  errorMessage.hidden = false;
}

function clearError() {
  errorMessage.textContent = "";
  errorMessage.hidden = true;
}

function parseKey() {
  const algorithm = algorithmSelect.value;
  const rawKey = keyInput.value.trim();

  if (!rawKey) {
    throw new Error("Введіть ключ шифрування.");
  }

  if (algorithm === "block" || algorithm === "vertical") {
    const parts = rawKey.split(/\s+/);

    if (!parts.every((part) => /^\d+$/.test(part))) {
      throw new Error(
        "Ключ перестановки повинен містити лише цілі числа, розділені пробілами."
      );
    }

    return parts.map(Number);
  }

  return rawKey;
}

function processText(mode) {
  clearError();

  try {
    const text = inputText.value;

    if (!text.trim()) {
      throw new Error("Введіть текст для обробки.");
    }

    const key = parseKey();
    const algorithm = algorithms[algorithmSelect.value];

    const result =
      mode === "encrypt"
        ? algorithm.encrypt(text, key)
        : algorithm.decrypt(text, key);

    outputText.value = result;
    updateCounter(outputCount, result);
  } catch (error) {
    showError(error.message || "Не вдалося обробити текст.");
  }
}

function updateAlgorithmSettings() {
  const algorithm = algorithms[algorithmSelect.value];

  keyHint.textContent = algorithm.hint;
  keyInput.placeholder = algorithm.placeholder;

  clearError();
}

algorithmSelect.addEventListener("change", updateAlgorithmSettings);

inputText.addEventListener("input", () => {
  updateCounter(inputCount, inputText.value);
  clearError();
});

keyInput.addEventListener("input", clearError);

encryptButton.addEventListener("click", () => {
  processText("encrypt");
});

decryptButton.addEventListener("click", () => {
  processText("decrypt");
});

fileInput.addEventListener("change", async () => {
  const file = fileInput.files?.[0];

  if (!file) {
    return;
  }

  clearError();

  try {
    inputText.value = await file.text();
    updateCounter(inputCount, inputText.value);
  } catch {
    showError("Не вдалося прочитати файл.");
  }

  // Дозволяє повторно вибрати той самий файл.
  fileInput.value = "";
});

copyButton.addEventListener("click", async () => {
  clearError();

  if (!outputText.value) {
    showError("Спочатку отримайте результат шифрування або розшифрування.");
    return;
  }

  try {
    await navigator.clipboard.writeText(outputText.value);
    copyButton.textContent = "Скопійовано!";

    setTimeout(() => {
      copyButton.textContent = "Копіювати";
    }, 1500);
  } catch {
    outputText.focus();
    outputText.select();

    const copied = document.execCommand("copy");

    if (copied) {
      copyButton.textContent = "Скопійовано!";

      setTimeout(() => {
        copyButton.textContent = "Копіювати";
      }, 1500);
    } else {
      showError("Не вдалося скопіювати текст. Виділіть його та скопіюйте вручну.");
    }
  }
});

downloadButton.addEventListener("click", () => {
  clearError();

  if (!outputText.value) {
    showError("Немає результату для завантаження.");
    return;
  }

  const blob = new Blob(
    ["\uFEFF", outputText.value],
    { type: "text/plain;charset=utf-8" }
  );

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "cipher-result.txt";
  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);
});

updateAlgorithmSettings();
updateCounter(inputCount, inputText.value);
updateCounter(outputCount, outputText.value);
