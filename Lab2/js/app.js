
import { buildSquare } from "./alphabets.js";
import {
  encryptCoordinates,
  decryptCoordinates,
  encryptRowShift,
  decryptRowShift,
} from "./polybius.js";
import {
  encryptGronsfeld,
  decryptGronsfeld,
} from "./gronsfeld.js";
import { readTextFile, saveTextFile } from "./file-handler.js";

const algorithmSelect = document.querySelector("#algorithm");
const languageSelect = document.querySelector("#language");
const operationSelect = document.querySelector("#operation");
const keyInput = document.querySelector("#key");
const inputText = document.querySelector("#input-text");
const outputText = document.querySelector("#output-text");
const processButton = document.querySelector("#process-button");
const clearButton = document.querySelector("#clear-button");
const copyButton = document.querySelector("#copy-button");
const saveButton = document.querySelector("#save-button");
const fileInput = document.querySelector("#file-input");
const messageElement = document.querySelector("#message");
const keyHint = document.querySelector("#key-hint");
const squareContainer = document.querySelector("#square-container");
const squareCaption = document.querySelector("#square-caption");

function showMessage(message, isError = false) {
  messageElement.textContent = message;
  messageElement.hidden = !message;
  messageElement.className = isError
    ? "message error-message"
    : "message";

  if (!isError && message) {
    messageElement.setAttribute("role", "status");
  } else {
    messageElement.setAttribute("role", "alert");
  }
}

function getAlgorithm() {
  return algorithmSelect.value;
}

function getLanguage() {
  return languageSelect.value;
}

function getOperation() {
  return operationSelect.value;
}

function updateInterface() {
  const algorithm = getAlgorithm();
  const operation = getOperation();

  processButton.textContent =
    operation === "encrypt" ? "Зашифрувати" : "Розшифрувати";

  if (algorithm === "gronsfeld") {
    keyInput.placeholder = "Наприклад, 31415";
    keyHint.textContent =
      "Введіть цифровий ключ. Початкові нулі зберігаються.";
    squareCaption.textContent = "Для цього алгоритму квадрат не використовується";
  } else {
    keyInput.placeholder = "Наприклад, БЕЗПЕКА або SECURITY";
    keyHint.textContent =
      "Введіть ключове слово для побудови квадрата 6 × 6.";
    squareCaption.textContent = "Квадрат для вибраного ключа";
  }

  updateSquare();
}

function updateSquare() {
  squareContainer.replaceChildren();

  if (getAlgorithm() === "gronsfeld") {
    squareContainer.textContent =
      "Шифр Гронсфельда використовує алфавіт, а не квадрат.";
    return;
  }

  const keyword = keyInput.value;

  if (!keyword.trim()) {
    squareContainer.textContent =
      "Введіть ключове слово, щоб побачити квадрат.";
    return;
  }

  try {
    const square = buildSquare(getLanguage(), keyword);
    const table = document.createElement("table");
    table.className = "square-table";

    const body = document.createElement("tbody");

    square.forEach((row, rowIndex) => {
      const tr = document.createElement("tr");

      row.forEach((char, colIndex) => {
        const td = document.createElement("td");
        td.textContent = char;
        td.setAttribute(
          "aria-label",
          `${char}: рядок ${rowIndex + 1}, стовпець ${colIndex + 1}`
        );
        tr.appendChild(td);
      });

      body.appendChild(tr);
    });

    table.appendChild(body);
    squareContainer.appendChild(table);
  } catch (error) {
    squareContainer.textContent =
      "Квадрат не побудовано. Перевірте ключове слово.";
  }
}

function processText() {
  const algorithm = getAlgorithm();
  const language = getLanguage();
  const operation = getOperation();
  const key = keyInput.value;
  const text = inputText.value;

  try {
    let result;

    if (algorithm === "coordinates") {
      result =
        operation === "encrypt"
          ? encryptCoordinates(text, language, key)
          : decryptCoordinates(text, language, key);
    } else if (algorithm === "row-shift") {
      result =
        operation === "encrypt"
          ? encryptRowShift(text, language, key)
          : decryptRowShift(text, language, key);
    } else if (algorithm === "gronsfeld") {
      result =
        operation === "encrypt"
          ? encryptGronsfeld(text, language, key)
          : decryptGronsfeld(text, language, key);
    } else {
      throw new Error("Вибрано невідомий алгоритм.");
    }

    outputText.value = result;
    showMessage("Операцію успішно виконано.");
  } catch (error) {
    outputText.value = "";
    showMessage(
      error instanceof Error
        ? error.message
        : "Сталася невідома помилка.",
      true
    );
  }
}

function clearFields() {
  inputText.value = "";
  outputText.value = "";
  keyInput.value = "";
  fileInput.value = "";

  showMessage("");
  updateSquare();
}

async function copyResult() {
  if (!outputText.value) {
    showMessage("Немає результату для копіювання.", true);
    return;
  }

  try {
    await navigator.clipboard.writeText(outputText.value);
    showMessage("Результат скопійовано.");
  } catch {
    outputText.focus();
    outputText.select();

    try {
      const copied = document.execCommand("copy");

      if (!copied) {
        throw new Error("Копіювання не підтримується браузером.");
      }

      showMessage("Результат скопійовано.");
    } catch {
      showMessage(
        "Не вдалося скопіювати автоматично. Виділіть результат і скопіюйте його вручну.",
        true
      );
    }
  }
}

function saveResult() {
  if (!outputText.value) {
    showMessage("Немає результату для збереження.", true);
    return;
  }

  try {
    saveTextFile(outputText.value, "cipher-result.txt");
    showMessage("Підготовлено файл для збереження.");
  } catch {
    showMessage("Не вдалося зберегти результат.", true);
  }
}

async function handleFileSelection() {
  const file = fileInput.files?.[0];

  if (!file) {
    return;
  }

  try {
    inputText.value = await readTextFile(file);
    showMessage(`Файл "${file.name}" успішно завантажено.`);
  } catch (error) {
    showMessage(
      error instanceof Error
        ? error.message
        : "Не вдалося прочитати файл.",
      true
    );
  } finally {
    fileInput.value = "";
  }
}

processButton.addEventListener("click", processText);
clearButton.addEventListener("click", clearFields);
copyButton.addEventListener("click", copyResult);
saveButton.addEventListener("click", saveResult);

algorithmSelect.addEventListener("change", () => {
  showMessage("");
  updateInterface();
});

languageSelect.addEventListener("change", () => {
  showMessage("");
  updateSquare();
});

operationSelect.addEventListener("change", () => {
  showMessage("");
  updateInterface();
});

keyInput.addEventListener("input", () => {
  showMessage("");
  updateSquare();
});

fileInput.addEventListener("change", handleFileSelection);

updateInterface();
