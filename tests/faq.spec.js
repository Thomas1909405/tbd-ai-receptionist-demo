const { test, expect } = require("@playwright/test");

test("FAQ: Schwedische Hundefrage", async ({ page }) => {
  await page.goto("http://127.0.0.1:4173/");

  await page.locator("#language-picker").selectOption("de");

  await page.locator("#message-input").fill(
    "Får jag ta med min hund till campingplatsen?"
  );

  await page.locator("#chat-form button[type='submit']").click();

  const botReply = page.locator("#messages .message.bot").last();

  await expect(botReply).toContainText(
    "Enligt demoprofilen är hundar välkomna."
  );

  await expect(botReply).not.toContainText(
    "Demoprofilen visar platser"
  );
});
