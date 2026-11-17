(() => {
  "use strict";
  const form = document.querySelector("#demo-form");
  const status = document.querySelector("#form-status");
  const email = window.TBD_SALES_CONFIG?.contactEmail?.trim();

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!email) {
      status.textContent = "Die Seite ist als Vorschau bereit. Für Demo-Anfragen fehlt noch die öffentliche TBD-Kontaktadresse; es wurde nichts versendet.";
      return;
    }
    const data = Object.fromEntries(new FormData(form).entries());
    const subject = `Demo-Anfrage · ${data.campground}`;
    const body = [
      "Guten Tag TBD AI Solutions,",
      "",
      "ich möchte eine unverbindliche Vorführung des TBD AI Receptionist anfragen.",
      `Campingplatz: ${data.campground}`,
      `Name: ${data.name}`,
      `Land: ${data.country}`,
      `Meine E-Mail: ${data.email}`,
      `Das möchte ich sehen: ${data.interest || "Keine Angabe"}`,
      "",
      "Bitte melden Sie sich bei mir, um einen Termin abzustimmen."
    ].join("\n");
    status.textContent = "Dein E-Mail-Programm wird mit dem vorbereiteten Entwurf geöffnet. Die Nachricht wird erst versendet, wenn du sie dort selbst absendest.";
    window.location.href = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
})();
