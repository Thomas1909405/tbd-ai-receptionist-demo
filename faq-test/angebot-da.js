(() => {
  "use strict";
  const form = document.querySelector("#demo-form");
  const status = document.querySelector("#form-status");
  const email = window.TBD_SALES_CONFIG?.contactEmail?.trim();

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!email) {
      status.textContent = "Siden er klar som lokal forhåndsvisning. TBD AI Solutions mangler stadig en kontaktadresse; intet er sendt.";
      return;
    }
    const data = Object.fromEntries(new FormData(form).entries());
    const subject = `Demoforespørgsel · ${data.campground}`;
    const body = [
      "Hej TBD AI Solutions,",
      "",
      "Jeg vil gerne anmode om en uforpligtende præsentation af TBD AI Receptionist.",
      `Campingplads: ${data.campground}`,
      `Navn: ${data.name}`,
      `Land: ${data.country}`,
      `Min e-mail: ${data.email}`,
      `Det vil jeg gerne se: ${data.interest || "Ikke angivet"}`,
      "",
      "Kontakt mig gerne for at aftale et tidspunkt."
    ].join("\n");
    status.textContent = "Dit e-mailprogram åbner en kladde. Beskeden sendes først, når du selv vælger at sende den.";
    window.location.href = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
})();
