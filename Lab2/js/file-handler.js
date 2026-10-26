
/**
 * Читає текстовий файл як UTF-8.
 */
export async function readTextFile(file) {
  if (!file) {
    throw new Error("Файл для читання не вибрано.");
  }

  try {
    const buffer = await file.arrayBuffer();

    // fatal: true не дозволяє мовчки приймати некоректний UTF-8.
    const decoder = new TextDecoder("utf-8", { fatal: true });
    return decoder.decode(buffer).normalize("NFC");
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(
        "Не вдалося прочитати файл. Перевір, що він має кодування UTF-8."
      );
    }

    throw error;
  }
}

/**
 * Зберігає текст у файл UTF-8.
 */
export function saveTextFile(text, filename = "result.txt") {
  const blob = new Blob(
    [text],
    { type: "text/plain;charset=utf-8" }
  );

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  link.hidden = true;

  document.body.appendChild(link);
  link.click();
  link.remove();

  // Даємо браузеру час розпочати завантаження.
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
