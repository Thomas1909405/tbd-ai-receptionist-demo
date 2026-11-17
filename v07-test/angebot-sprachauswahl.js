(() => {
  "use strict";
  const files = {
    de: ["angebot.html", "Deutsch"],
    en: ["campgrounds-en.html", "English"],
    da: ["campingpladser-da.html", "Dansk"],
    no: ["campgrounds-no.html", "Norsk"],
    sv: ["campgrounds-sv.html", "Svenska"]
  };
  const labels = { de: "Sprache wählen", en: "Choose language", da: "Vælg sprog", no: "Velg språk", sv: "Välj språk" };
  const current = document.documentElement.lang || "de";
  const label = document.createElement("label");
  label.className = "language-picker";
  const select = document.createElement("select");
  select.setAttribute("aria-label", labels[current] || labels.de);
  for (const [language, [href, name]] of Object.entries(files)) {
    const option = document.createElement("option");
    option.value = href;
    option.textContent = name;
    option.selected = language === current;
    select.append(option);
  }
  select.addEventListener("change", () => { window.location.href = select.value; });
  label.append(select);
  document.querySelector(".nav-links")?.after(label);
})();
