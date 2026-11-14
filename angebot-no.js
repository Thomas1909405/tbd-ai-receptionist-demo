(() => {
  "use strict";
  const form = document.querySelector("#demo-form");
  const status = document.querySelector("#form-status");
  const email = window.TBD_SALES_CONFIG?.contactEmail?.trim();
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!email) {
      status.textContent = "Dette er en lokal forhåndsvisning. Kontaktadressen er ikke konfigurert; ingenting ble sendt.";
      return;
    }
    const data = Object.fromEntries(new FormData(form).entries());
    const subject = `Uforpliktende demoforespørsel · ${data.campground}`;
    const body = ["Hei TBD AI Solutions,", "", "Jeg ønsker en uforpliktende presentasjon av TBD AI Receptionist. Dette innebærer ingen kjøpsplikt.", `Campingplass: ${data.campground}`, `Navn: ${data.name}`, `Land: ${data.country}`, `E-post: ${data.email}`, `Dette ønsker jeg å se: ${data.interest || "Ikke oppgitt"}`, "", "Ta gjerne kontakt for å avtale et tidspunkt."].join("\n");
    status.textContent = "E-postprogrammet åpner et utkast. Meldingen sendes først hvis du selv velger å sende den.";
    window.location.href = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
})();
