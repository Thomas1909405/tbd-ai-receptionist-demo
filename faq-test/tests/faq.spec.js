const { test, expect } = require("@playwright/test");

const testCases = [
  {
    name: "Deutsch",
    question: "Darf ich meinen Hund mitbringen?",
    expected: "Hunde sind laut Demo-Profil willkommen.",
    forbidden: "Stellplätze"
  },
  {
    name: "Dänisch",
    question: "Må jeg tage min hund med på campingpladsen?",
    expected: "Ifølge demoprofilen er hunde velkomne.",
    forbidden: "pladser til"
  },
  {
    name: "Englisch",
    question: "Can I bring my dog to the campsite?",
    expected: "Dogs are welcome",
    forbidden: "pitches"
  },
  {
    name: "Norwegisch",
    question: "Kan jeg ta med hunden min på campingplassen?",
    expected: "Ifølge demoprofilen er hunder velkomne.",
    forbidden: "Demoprofilen viser plasser"
  },
  {
    name: "Schwedisch",
    question: "Får jag ta med min hund till campingplatsen?",
    expected: "Enligt demoprofilen är hundar välkomna.",
    forbidden: "Demoprofilen visar platser"
  }
];

for (const testCase of testCases) {
  test(`FAQ AutoTest: ${testCase.name}`, async ({ page }) => {
    await page.goto("http://127.0.0.1:4173/");

    // Webseite bleibt auf Deutsch.
    await page.locator("#language-picker").selectOption("de");

    // Gästefrage eingeben.
    await page.locator("#message-input").fill(testCase.question);

    // Frage absenden.
    await page.locator("#chat-form button[type='submit']").click();

    // Letzte Antwort des Receptionists prüfen.
    const botReply = page.locator("#messages .message.bot").last();

    // Richtige Antwort muss enthalten sein.
    await expect(botReply).toContainText(testCase.expected);

    // Keine unerwünschte Stellplatzantwort.
    await expect(botReply).not.toContainText(testCase.forbidden);
  });
}
