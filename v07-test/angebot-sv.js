(() => {
  "use strict";
  const form = document.querySelector("#demo-form");
  const status = document.querySelector("#form-status");
  const email = window.TBD_SALES_CONFIG?.contactEmail?.trim();
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!email) {
      status.textContent = "Det här är en lokal förhandsvisning. Kontaktadressen är inte konfigurerad; inget skickades.";
      return;
    }
    const data = Object.fromEntries(new FormData(form).entries());
    const subject = `Förutsättningslös demoförfrågan · ${data.campground}`;
    const body = ["Hej TBD AI Solutions,", "", "Jag vill gärna få en förutsättningslös presentation av TBD AI Receptionist. Det innebär inget köptvång.", `Campingplats: ${data.campground}`, `Namn: ${data.name}`, `Land: ${data.country}`, `E-post: ${data.email}`, `Det här vill jag se: ${data.interest || "Inte angivet"}`, "", "Kontakta mig gärna för att komma överens om en tid."].join("\n");
    status.textContent = "E-postprogrammet öppnar ett utkast. Meddelandet skickas först om du själv väljer att skicka det.";
    window.location.href = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
})();
