/* TBD Core V0.1: reine Browser-Demo, regelbasiert, ohne Netzwerkzugriffe. */
(() => {
  "use strict";
  const profiles = window.TBD_PROFILES || [];
  let profile = profiles[0];
  const params = new URLSearchParams(window.location.search);
  const embedMode = params.get("embed") === "1";
  const requestedProfile = params.get("site");
  if (requestedProfile) profile = profiles.find((item) => item.id === requestedProfile) || profiles[0];
  const messages = document.querySelector("#messages");
  const form = document.querySelector("#chat-form");
  const input = document.querySelector("#message-input");
  const quick = document.querySelector("#quick-prompts");
  const profilePicker = document.querySelector("#profile-picker");
  const languagePicker = document.querySelector("#language-picker");
  const chatPropertyName = document.querySelector("#chat-property-name");
  const heroKickerText = document.querySelector("#hero-kicker-text");
  function detectLanguage() {
    const locale = (typeof navigator !== "undefined" ? navigator.language : "en-US").toLowerCase();
    if (/^de-de(?:-|$)/.test(locale)) return "de";
    if (/^da-dk(?:-|$)/.test(locale)) return "da";
if (/^no(?:-|$)|^nb(?:-|$)|^nn(?:-|$)/.test(locale)) return "no";    if (/^sv(?:-|$)/.test(locale)) return "sv";
    return "en";
  }
  const requestedLanguage = params.get("lang");
  let language = ["de", "da", "en", "no", "sv"].includes(requestedLanguage) ? requestedLanguage : detectLanguage();
  languagePicker.value = language;
let responseLanguage = language;
const tr = (key, lang = language) => window.TBD_LOCALES[lang]?.[key] ?? window.TBD_LOCALES.de[key];
const profileLocale = (item = profile, lang = language) => item.locales?.[lang] || {};
const profileName = (item = profile) => profileLocale(item).name || item.name;

  if (!profile) throw new Error("Kein TBD-Kundenprofil geladen.");

  if (embedMode) {
    document.body.classList.add("embed-mode");
    profilePicker.value = profile.id;
    profilePicker.disabled = true;
  }

  profiles.forEach((item) => {
    const option = document.createElement("option");
    option.value = item.id;
    option.textContent = profileName(item);
    profilePicker.appendChild(option);
  });

  function addMessage(text, who = "bot") {
    const bubble = document.createElement("div");
    bubble.className = `message ${who === "user" ? "user" : "bot"}`;
    bubble.textContent = text;
    messages.appendChild(bubble);
    messages.scrollTop = messages.scrollHeight;
  }
  function fact(key, lang = language) {
    const locale = profileLocale(profile, lang);
    return locale.facts?.[key] || profile.facts?.[key] ||
        locale.unconfiguredReply || profile.unconfiguredReply || "...";
}
  
  function applyLanguage() {
    responseLanguage = language;
    const ui = window.TBD_LOCALES[language];
    document.documentElement.lang = language;
    document.title = ui.title.replace("Nordsee Camping Resort", profileName());
    document.querySelector("#operator-link").textContent = ui.operatorLink;
    document.querySelector("#operator-link").href = ui.operatorHref;
    languagePicker.value = language;
    const localeTag = ({ de: "de-DE", da: "da-DK", en: "en-GB", no: "nb-NO", sv: "sv-SE" })[language];
    heroKickerText.textContent = profileName().toLocaleUpperCase(localeTag);
    document.querySelector("#fiction-label").textContent = ui.fictional;
    document.querySelector("#hero-title").innerHTML = ui.heroTitle;
    document.querySelector("#hero-intro").textContent = ui.heroIntro;
    document.querySelector("#hero-meta").innerHTML = ui.heroMeta;
    document.querySelector("#hero-art").setAttribute("aria-label", ui.heroArt);
    document.querySelector("#chat-kicker").textContent = ui.chatKicker;
    document.querySelector("#chat-title").textContent = ui.chatTitle;
    document.querySelector("#availability-label").textContent = ui.availability;
    document.querySelector("#reception-label").textContent = ui.reception;
    document.querySelector("#profile-label").textContent = ui.profile;
    profilePicker.setAttribute("aria-label", ui.profileAria);
    document.querySelector("#chat-notice").textContent = ui.notice;
    quick.setAttribute("aria-label", ui.quickAria);
    document.querySelector("#message-label").textContent = ui.messageLabel;
    input.placeholder = ui.messagePlaceholder;
    document.querySelector("#send-button").setAttribute("aria-label", ui.send);
    document.querySelector("#chat-foot-left").textContent = ui.footLeft;
    document.querySelector("#chat-foot-right").textContent = ui.footRight;
    document.querySelector("#footer-left").textContent = ui.footerLeft;
    document.querySelector("#footer-right").innerHTML = ui.footerRight;
    Array.from(profilePicker.options).forEach((option, index) => { option.textContent = profileName(profiles[index]); });
    quick.querySelectorAll("button[data-question-key]").forEach((button) => {
      const key = button.dataset.questionKey;
      const prompt = ui.prompts[key];
      const rental = profile.category === "holiday-rental";
      button.hidden = rental && ["electricity", "sanitary", "walkIn", "quietPeriods", "waterSports"].includes(key);
      if (rental && key === "pitches") {
        const rentalPrompt = {
          de: { label: "Ferienunterkünfte", question: "Welche Ferienunterkünfte gibt es?" },
          da: { label: "Ferieboliger", question: "Hvilke ferieboliger kan jeg vælge imellem?" },
          en: { label: "Holiday homes", question: "What holiday homes can I choose from?" }
        }[language];
        button.textContent = rentalPrompt.label;
        button.dataset.question = rentalPrompt.question;
      } else {
        button.textContent = prompt.label;
        button.dataset.question = prompt.question;
      }
    });
  }
  function resetConversation() {
    messages.replaceChildren();
    bookingRequest = null;
    lastBookingRequest = null;
    contactDraft = { name: "", email: "" };
    quick.hidden = false;
    input.value = "";
    chatPropertyName.textContent = profileName();
    const localeTag = ({ de: "de-DE", da: "da-DK", en: "en-GB", no: "nb-NO", sv: "sv-SE" })[language];
    heroKickerText.textContent = profileName().toLocaleUpperCase(localeTag);
    addMessage(tr("welcome").replace("{name}", profileName()));
  }
 function startRequest() {
  const ui = window.TBD_LOCALES[responseLanguage] || window.TBD_LOCALES.de;
    const labels = ui.bookingLabels;
    const types = profile.locales?.[responseLanguage]?.bookingTypes || ui.bookingTypes;
    addMessage(ui.requestIntro);
    const wrap = document.createElement("div");
    wrap.className = "message bot";
    const booking = document.createElement("form");
    booking.className = "inline-form";
    booking.innerHTML = `
      <label>${labels.arrival}<input name="arrival" type="date" required></label>
      <label>${labels.departure}<input name="departure" type="date" required></label>
      <label>${labels.adults}<input name="adults" type="number" min="1" value="2" required></label>
      <label>${labels.children}<input name="children" type="number" min="0" value="0" required></label>
      <label class="wide">${labels.type}<select name="type" required><option value="">${types[0]}</option><option>${types[1]}</option><option>${types[2]}</option><option>${types[3]}</option><option>${types[4]}</option><option>${types[5]}</option></select></label>
      <label class="wide">${labels.wishes}<input name="wishes" type="text" maxlength="300" placeholder="${ui.wishesPlaceholder}"></label>
      <label class="wide">${labels.name}<input name="name" autocomplete="name" required></label>
      <label class="wide">${labels.contact}<input name="contact" type="text" autocomplete="off" placeholder="${ui.contactPlaceholder}" required></label>
      <button type="submit">${labels.submit}</button>`;
    const arrivalInput = booking.elements.arrival;
    const departureInput = booking.elements.departure;
    const today = new Date();
    const localToday = [today.getFullYear(), String(today.getMonth() + 1).padStart(2, "0"), String(today.getDate()).padStart(2, "0")].join("-");
    arrivalInput.min = localToday;
    departureInput.min = localToday;
    arrivalInput.addEventListener("change", () => {
      departureInput.min = arrivalInput.value || localToday;
      if (departureInput.value && departureInput.value <= arrivalInput.value) departureInput.value = "";
    });
    booking.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = Object.fromEntries(new FormData(booking).entries());
      if (data.departure <= data.arrival) { addMessage(ui.dateError); return; }
      const s = ui.summaryLabels;
      const summary = `${ui.requestSummary} · ${profileName()}\n${s[0]}: ${data.arrival}\n${s[1]}: ${data.departure}\n${s[2]}: ${data.adults}\n${s[3]}: ${data.children}\n${s[4]}: ${data.type}\n${s[5]}: ${data.wishes || s[6]}\n${s[7]}: ${data.name}\n${s[8]}: ${data.contact}\n\n${profileLocale().contactNote || profile.contactNote}`;
      booking.replaceWith(Object.assign(document.createElement("div"), { className: "request-summary", textContent: summary }));
      addMessage(ui.requestComplete);
    });
    wrap.appendChild(booking); messages.appendChild(wrap); messages.scrollTop = messages.scrollHeight;
    quick.hidden = true; input.focus();
  }
  function detectMessageLanguage(raw) {
    const text = raw.toLowerCase();

    const signals = {
        de: /\b(ich|möchte|möchten|wir|doch|nächte|bleiben|statt|können|kann|haben|dürfen|darf|meinen|meine|gibt|welche|wann|anreise|stellplatz|wohnmobil|übernachten)\b|[äüß]/g,
      
        da: /\b(jeg|hvad|hvornår|gerne|jeres|vores|vil|må|medbringe|ankomme|ankommer|overnatning|campingplads|autocamper|kan jeg|har i)\b|[æø]/g,
      
        en: /\b(hello|please|would|where|when|booking|pitch|can i|do you|is there|how much|available|arrival|departure|thank you)\b/g,

        no: /\b(hei|jeg|vi|hva|hvor|når|gjerne|dere|ønsker|ankomme|morgen|bobil|bobilen|vår|kjæledyr|bestille|overnatting|ankommer|kan jeg|har dere|hytta|ta med|hunden min)\b/g,
      
        sv: /\b(jag|vad|när|gärna|får|finns|husbil|husvagn|stuga|boende|boka|ankommer|kan jag|har ni|tack)\b|[äö]/g
    };

    const scores = {};

    for (const [lang, regex] of Object.entries(signals)) {
        scores[lang] = [...text.matchAll(regex)].length;
    }
if (/\b(ta med|hunden min|har dere|bobil)\b/.test(text)) {
    scores.no += 3;
}
    if (/\b(får jag|ta med min hund|har ni|husbil)\b/.test(text)) {
    scores.sv += 4;
}
    if (/\b(vi vil gerne|vores autocamper|har i|må jeg)\b/.test(text)) {
    scores.da += 4;
}
    const highest = Math.max(...Object.values(scores));

    if (highest === 0) return language;

    const winners = Object.keys(scores).filter(
        lang => scores[lang] === highest
    );

    return winners.includes(language) ? language : winners[0];
  }   

  // TBD AI Receptionist V0.5
// Speichert die Angaben einer laufenden Buchungsanfrage.
let bookingRequest = null;
  let lastBookingRequest = null;
  let contactDraft = { name: "", email: "" };
  function startBookingRequest() {
    bookingRequest = {
      language: responseLanguage,
        arrival: null,
        nights: null,
        adults: null,
        children: null,
        accommodation: null
    };
}
  function saveBookingNights(raw) {
    if (!bookingRequest) return false;

    const match = raw.match(/\b(\d{1,2})\s*(nächte|nacht|nætter|nætter|nights|netter|nätter)\b/i);
        
    if (!match) return false;

    const nights = Number(match[1]);

    if (nights < 1 || nights > 30) return false;

    bookingRequest.nights = nights;
    return true;
}
  function saveBookingGuests(raw) {
    if (!bookingRequest) return false;

    const adultsMatch = raw.match(
        /\b(\d{1,2})\s*(erwachsene|erwachsenen|voksne|adults|vuxna)\b/i
    );

    const childrenMatch = raw.match(
/\b(\d{1,2}|ein|eine|einem|einen|zwei|drei|vier|fünf)\s*(kinder|kind|kindern|børn|children|child|barn)\b/i    
    );

    if (!adultsMatch && !childrenMatch) return false;
    
    const adults = adultsMatch ? Number(adultsMatch[1]) : null;
const numberWords = {
    ein: 1,
    eine: 1,
    einem: 1,
    einen: 1,
    zwei: 2,
    drei: 3,
    vier: 4,
    fünf: 5
};

const children = childrenMatch
    ? (numberWords[childrenMatch[1].toLowerCase()] ?? Number(childrenMatch[1]))
    : null;
    if (adults !== null && (adults < 1 || adults > 20)) return false;
if (children !== null && (!Number.isInteger(children) || children < 0 || children > 20)) return false;
    if (adults !== null) bookingRequest.adults = adults;
    if (children !== null) bookingRequest.children = children;

  return bookingRequest.adults !== null;
  }
  function saveBookingAccommodation(raw) {
    if (!bookingRequest) return false;

    const text = raw.toLowerCase();

if (/\b(wohnmobil|autocamper|motorhome|campervan|bobil|bobilen|husbil|husbilen)\b/i.test(text)) {
  bookingRequest.accommodation = "motorhome";
        return true;
    }

    if (/\b(wohnwagen|campingvogn|caravan|husvagn)\b/i.test(text)) {
        bookingRequest.accommodation = "caravan";
        return true;
    }

    if (/\b(zelt|telt|tent|tält)\b/i.test(text)) {
        bookingRequest.accommodation = "tent";
        return true;
    }
if (/\b(ferienhaus|ferienwohnung|ferienunterkunft|feriehus|feriebolig|holiday home|holiday house|holiday apartment|hytte|stuga|stuga)\b/i.test(text)) {
    bookingRequest.accommodation = "holidayhome";
    return true;
}
    return false;
}
  function saveBookingArrival(raw) {
    if (!bookingRequest) return false;

    const text = raw.toLowerCase();

    // Explicit dates take priority over relative dates and weekdays.
    // Supports 20.11.2026, 20/11/2026, 2026-11-20 and 20. November 2026.
    const months = {
      januar: 1, january: 1, januari: 1,
      februar: 2, february: 2, februari: 2,
      märz: 3, maerz: 3, marts: 3, march: 3, mars: 3,
      april: 4, mai: 5, may: 5, maj: 5,
      juni: 6, june: 6, july: 7, juli: 7,
      august: 8, september: 9, oktober: 10, october: 10,
      november: 11, dezember: 12, december: 12, desember: 12
    };
    let parts;
    const iso = text.match(/\b(\d{4})-(\d{1,2})-(\d{1,2})\b/);
    const numeric = text.match(/\b(\d{1,2})[./](\d{1,2})[./](\d{4})\b/);
    const named = text.match(/\b(\d{1,2})\.?\s+(januar|january|januari|februar|february|februari|märz|maerz|marts|march|mars|april|mai|may|maj|juni|june|juli|july|august|september|oktober|october|november|dezember|december|desember)\s+(\d{4})\b/i);
    if (iso) parts = [Number(iso[1]), Number(iso[2]), Number(iso[3])];
    else if (numeric) parts = [Number(numeric[3]), Number(numeric[2]), Number(numeric[1])];
    else if (named) parts = [Number(named[3]), months[named[2].toLowerCase()], Number(named[1])];
    if (parts) {
      const [year, month, day] = parts;
      const date = new Date(Date.UTC(year, month - 1, day));
      if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return false;
      const today = new Date();
      const localToday = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));
      if (date < localToday) return false;
      bookingRequest.arrival = date.toISOString().slice(0, 10);
      return true;
    }

    const tomorrowWords = /\b(morgen|tomorrow|imorgon|i morgon)\b/i;
    const todayWords = /\b(heute|today|i dag|idag)\b/i;

    const arrivalDate = new Date();
   const weekdays = {
    // Deutsch
    sonntag: 0,
    montag: 1,
    dienstag: 2,
    mittwoch: 3,
    donnerstag: 4,
    freitag: 5,
    samstag: 6,

    // Dänisch und Norwegisch
    søndag: 0,
    mandag: 1,
    tirsdag: 2,
    onsdag: 3,
    torsdag: 4,
    fredag: 5,
    lørdag: 6,

    // Englisch
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,

    // Schwedisch
    söndag: 0,
    måndag: 1,
    tisdag: 2,
    onsdag: 3,
    torsdag: 4,
    fredag: 5,
    lördag: 6
};
   const weekdayMatch = text.match(
    /\b(sonntag|montag|dienstag|mittwoch|donnerstag|freitag|samstag|søndag|mandag|tirsdag|onsdag|torsdag|fredag|lørdag|sunday|monday|tuesday|wednesday|thursday|friday|saturday|söndag|måndag|tisdag|lördag)\b/i
);

if (weekdayMatch && (tomorrowWords.test(text) || todayWords.test(text))) {
    return false;
}
if (weekdayMatch) {
    const targetDay = weekdays[weekdayMatch[1].toLowerCase()];
    let daysUntil = (targetDay - arrivalDate.getDay() + 7) % 7;

    if (daysUntil === 0) daysUntil = 7;

    arrivalDate.setDate(arrivalDate.getDate() + daysUntil);
}

   if (!weekdayMatch) {
    if (tomorrowWords.test(text)) {
        arrivalDate.setDate(arrivalDate.getDate() + 1);
    } else if (!todayWords.test(text)) {
        return false;
    }
}

    const year = arrivalDate.getFullYear();
    const month = String(arrivalDate.getMonth() + 1).padStart(2, "0");
    const day = String(arrivalDate.getDate()).padStart(2, "0");

    bookingRequest.arrival = `${year}-${month}-${day}`;

    return true;
}
  function createBookingSummary(language) {
    const labels = {
        de: "Ihre unverbindliche Buchungsanfrage",
        da: "Din uforpligtende bookingforespørgsel",
        en: "Your non-binding booking enquiry",
        no: "Din uforpliktende bestillingsforespørsel",
        sv: "Din icke-bindande bokningsförfrågan"
    };
const fields = {
    de: {
        arrival: "Anreise",
        departure: "Abreise",
        nights: "Nächte",
        adults: "Erwachsene",
        children: "Kinder",
        accommodation: "Unterkunft",
        missing: "Noch nicht angegeben",
        notice: "Dies ist eine unverbindliche Anfrage, keine bestätigte Buchung."
    },
    da: {
        arrival: "Ankomst",
        departure: "Afrejse",
        nights: "Nætter",
        adults: "Voksne",
        children: "Børn",
        accommodation: "Overnatningstype",
        missing: "Ikke angivet endnu",
        notice: "Dette er en uforpligtende forespørgsel, ikke en bekræftet booking."
    },
    en: {
        arrival: "Arrival",
        departure: "Departure",
        nights: "Nights",
        adults: "Adults",
        children: "Children",
        accommodation: "Accommodation",
        missing: "Not specified yet",
        notice: "This is a non-binding enquiry, not a confirmed booking."
    },
    no: {
        arrival: "Ankomst",
        departure: "Avreise",
        nights: "Netter",
        adults: "Voksne",
        children: "Barn",
        accommodation: "Overnattingstype",
        missing: "Ikke oppgitt ennå",
        notice: "Dette er en uforpliktende forespørsel, ikke en bekreftet bestilling."
    },
    sv: {
        arrival: "Ankomst",
        departure: "Avresa",
        nights: "Nätter",
        adults: "Vuxna",
        children: "Barn",
        accommodation: "Boendetyp",
        missing: "Inte angivet ännu",
        notice: "Detta är en icke-bindande förfrågan, inte en bekräftad bokning."
    }
};
    const accommodationNames = {
        motorhome: {
            de: "Wohnmobil", da: "Autocamper", en: "Motorhome",
            no: "Bobil", sv: "Husbil"
        },
        caravan: {
            de: "Wohnwagen", da: "Campingvogn", en: "Caravan",
            no: "Campingvogn", sv: "Husvagn"
        },
                tent: {
            de: "Zelt", da: "Telt", en: "Tent",
            no: "Telt", sv: "Tält"
        },
        holidayhome: {
            de: "Ferienhaus",
            da: "Feriehus",
            en: "Holiday home",
            no: "Feriehus",
            sv: "Stuga"
        }
    };
    const r = bookingRequest || lastBookingRequest;
    const f = fields[language] || fields.de;
    let departure = f.missing;
    const lang = labels[language] ? language : "de";
    if (r.arrival && Number.isInteger(r.nights) && r.nights > 0) {
    const date = new Date(r.arrival + "T00:00:00Z");
    date.setUTCDate(date.getUTCDate() + r.nights);
    departure = date.toISOString().slice(0, 10);
}

    return `${labels[lang]}\n\n` +
        `${f.arrival}: ${r.arrival || f.missing}\n` +
        `${f.departure}: ${departure}\n` +
        `${f.nights}: ${r.nights ?? f.missing}\n` +
        `${f.adults}: ${r.adults ?? f.missing}\n` +
        `${f.children}: ${r.children ?? f.missing}\n` +
        `${f.accommodation}: ${r.accommodation ? accommodationNames[r.accommodation][lang] : f.missing}\n\n` +
        f.notice;
}
   // V0.8: Browser-only handoff. No network requests or automatic email delivery.
   function renderContactHandoff(lang) {
     if (!lastBookingRequest) return;
     messages.querySelectorAll(".tbd-contact-handoff").forEach((node) => node.remove());
     const translations = {
       de: { intro: "Möchten Sie diese unverbindliche Anfrage per E-Mail vorbereiten? Geben Sie dazu Ihren Namen und Ihre E-Mail-Adresse ein.", name: "Ihr Name", email: "Ihre E-Mail-Adresse", prepare: "E-Mail vorbereiten", copy: "Anfrage kopieren", notice: "Demo: Empfänger rezeption@example.com ist kein echtes Postfach. Das Öffnen des E-Mail-Programms versendet nichts automatisch. Bitte keine echten personenbezogenen Daten eingeben.", subject: "Unverbindliche Buchungsanfrage", copied: "Anfrage kopiert. Sie können sie selbst in eine Nachricht einfügen.", failed: "Kopieren nicht möglich. Bitte den Text manuell markieren und kopieren.", validation: "Bitte geben Sie einen Namen und eine gültige E-Mail-Adresse ein." },
       da: { intro: "Vil du forberede en e-mail med din uforpligtende forespørgsel? Indtast navn og e-mailadresse.", name: "Dit navn", email: "Din e-mailadresse", prepare: "Forbered e-mail", copy: "Kopiér forespørgsel", notice: "Demo: rezeption@example.com er ikke en rigtig postkasse. E-mailen sendes ikke automatisk. Indtast ikke rigtige personoplysninger.", subject: "Uforpligtende bookingforespørgsel", copied: "Forespørgslen er kopieret.", failed: "Kunne ikke kopiere. Markér og kopiér teksten manuelt.", validation: "Indtast venligst navn og gyldig e-mailadresse." },
       en: { intro: "Would you like to prepare an email with your non-binding enquiry? Enter your name and email address.", name: "Your name", email: "Your email address", prepare: "Prepare email", copy: "Copy enquiry", notice: "Demo: rezeption@example.com is not a real inbox. Opening your email app does not send anything. Do not enter real personal details.", subject: "Non-binding booking enquiry", copied: "Enquiry copied.", failed: "Copy failed. Please select and copy the text manually.", validation: "Please enter a name and valid email address." },
       no: { intro: "Vil du klargjøre en e-post med din uforpliktende forespørsel? Oppgi navn og e-postadresse.", name: "Navnet ditt", email: "E-postadressen din", prepare: "Klargjør e-post", copy: "Kopier forespørsel", notice: "Demo: rezeption@example.com er ikke en ekte innboks. E-posten sendes ikke automatisk. Ikke oppgi ekte personopplysninger.", subject: "Uforpliktende bestillingsforespørsel", copied: "Forespørselen er kopiert.", failed: "Kunne ikke kopiere. Marker og kopier teksten manuelt.", validation: "Oppgi navn og gyldig e-postadresse." },
       sv: { intro: "Vill du förbereda ett e-postmeddelande med din icke-bindande förfrågan? Ange namn och e-postadress.", name: "Ditt namn", email: "Din e-postadress", prepare: "Förbered e-post", copy: "Kopiera förfrågan", notice: "Demo: rezeption@example.com är ingen riktig inkorg. E-post skickas inte automatiskt. Ange inte riktiga personuppgifter.", subject: "Icke-bindande bokningsförfrågan", copied: "Förfrågan kopierad.", failed: "Kopiering misslyckades. Markera och kopiera texten manuellt.", validation: "Ange namn och giltig e-postadress." }
     };
     const t = translations[lang] || translations.de;
     const box = document.createElement("section");
     box.className = "message bot tbd-contact-handoff";
     box.style.display = "block";
     box.style.width = "min(100%, 560px)";
     box.style.maxWidth = "100%";
     box.style.boxSizing = "border-box";
     const intro = document.createElement("p"); intro.textContent = t.intro; box.appendChild(intro);
     const contact = document.createElement("form"); contact.className = "inline-form";
     contact.style.display = "grid";
     contact.style.gap = "10px";
     contact.style.width = "100%";
     const makeField = (labelText, type, value) => {
       const label = document.createElement("label"); label.textContent = labelText;
       label.style.display = "grid"; label.style.gap = "5px";
       const field = document.createElement("input"); field.type = type; field.required = true; field.maxLength = type === "email" ? 254 : 120; field.value = value;
       if (type === "email") field.autocomplete = "email";
       if (type === "text") field.autocomplete = "name";
       field.style.width = "100%"; field.style.boxSizing = "border-box"; field.style.padding = "10px";
       label.appendChild(field); contact.appendChild(label); return field;
     };
     const nameInput = makeField(t.name, "text", contactDraft.name);
     const emailInput = makeField(t.email, "email", contactDraft.email);
     const status = document.createElement("p"); status.setAttribute("role", "status");
     const notice = document.createElement("p"); notice.textContent = t.notice;
     const prepare = document.createElement("button"); prepare.type = "submit"; prepare.textContent = t.prepare;
     const copy = document.createElement("button"); copy.type = "button"; copy.textContent = t.copy;
     contact.append(prepare, copy);
     const buildBody = () => createBookingSummary(lang) + "\n\n" + t.name + ": " + nameInput.value.trim() + "\n" + t.email + ": " + emailInput.value.trim();
     const valid = () => {
       if (!nameInput.value.trim() || !emailInput.checkValidity()) { status.textContent = t.validation; contact.reportValidity(); return false; }
       contactDraft = { name: nameInput.value.trim(), email: emailInput.value.trim() }; return true;
     };
     contact.addEventListener("submit", (event) => {
       event.preventDefault(); if (!valid()) return;
       const uri = "mailto:rezeption@example.com?subject=" + encodeURIComponent(t.subject + " – " + profileName()) + "&body=" + encodeURIComponent(buildBody());
       window.location.href = uri;
       status.textContent = t.notice;
     });
     copy.addEventListener("click", async () => {
       if (!valid()) return;
       const body = buildBody();
       try { await navigator.clipboard.writeText(body); status.textContent = t.copied; }
       catch (error) { status.textContent = t.failed; const fallback = document.createElement("textarea"); fallback.value = body; fallback.readOnly = true; fallback.rows = 9; fallback.style.width = "100%"; box.appendChild(fallback); fallback.select(); }
     });
     box.append(contact, notice, status);
     messages.appendChild(box);
     // Scroll only after the browser has laid out the newly added form.
     requestAnimationFrame(() => { messages.scrollTop = messages.scrollHeight; });
   }
  function answer(raw) {
    responseLanguage = bookingRequest
    ? bookingRequest.language
    : detectMessageLanguage(raw);
    // TBD AI Receptionist V0.6 – Änderung der Aufenthaltsdauer
if (lastBookingRequest && !bookingRequest) {
    // Änderungen der Aufenthaltsdauer in allen fünf Gästesprachen.
    // Die erste genannte Nächtezahl ist die gewünschte neue Dauer.
    const changeMatch = raw.match(/\b(\d{1,3})\s*(nächte|nächten|nacht|nætter|nætter|nights?|netter|nätter)\b/i);
    const wantsChange = /\b(doch|statt|ändern|änderung|lieber|i\s+stedet\s+for|ændre|ændring|hellere|instead\s+of|change|extend|rather|i\s+stedet\s+for|endre|endring|heller|istället\s+för|istället|ändra|ändring|hellre)\b/i.test(raw);

    if (changeMatch && wantsChange) {
        const newNights = Number(changeMatch[1]);
        if (newNights >= 1 && newNights <= 365) {
            lastBookingRequest.nights = newNights;
            const updateLanguage = lastBookingRequest.language || responseLanguage;
            const confirmations = {
                de: "Gerne! 😊 Ich habe die Aufenthaltsdauer Ihrer unverbindlichen Anfrage aktualisiert.",
                da: "Selvfølgelig! 😊 Jeg har opdateret antallet af nætter i din uforpligtende forespørgsel.",
                en: "Of course! 😊 I've updated the number of nights in your non-binding enquiry.",
                no: "Selvfølgelig! 😊 Jeg har oppdatert antall netter i den uforpliktende forespørselen din.",
                sv: "Självklart! 😊 Jag har uppdaterat antalet nätter i din icke-bindande förfrågan."
            };
            addMessage(confirmations[updateLanguage] + "\n\n" + createBookingSummary(updateLanguage));
             renderContactHandoff(updateLanguage);
            return;
        }
    }
}
    const bookingInProgress = bookingRequest !== null;
    if (bookingInProgress) saveBookingAccommodation(raw);
    if (
    bookingInProgress &&
    bookingRequest.arrival !== null &&
    bookingRequest.nights !== null &&
    bookingRequest.adults !== null &&
    bookingRequest.children !== null &&
    bookingRequest.accommodation !== null
) {
    addMessage(createBookingSummary(responseLanguage));
lastBookingRequest = { ...bookingRequest };
bookingRequest = null;
     renderContactHandoff(responseLanguage);
return;
}
   if (bookingInProgress && bookingRequest.arrival === null) {
    if (saveBookingArrival(raw)) {
         if (bookingRequest.nights !== null && bookingRequest.adults !== null &&
             bookingRequest.children !== null && bookingRequest.accommodation !== null) {
             addMessage(createBookingSummary(responseLanguage));
             lastBookingRequest = { ...bookingRequest };
             bookingRequest = null;
     renderContactHandoff(responseLanguage);
             return;
         }
         const nextQuestions = {
            de: "Vielen Dank! 😊 Wie viele Nächte möchten Sie bleiben?",
            da: "Mange tak! 😊 Hvor mange nætter ønsker I at blive?",
            en: "Thank you! 😊 How many nights would you like to stay?",
            no: "Tusen takk! 😊 Hvor mange netter ønsker dere å bli?",
            sv: "Tack så mycket! 😊 Hur många nätter vill ni stanna?"
        };

                       addMessage(nextQuestions[responseLanguage]);
        return;
    } else {
        const arrivalQuestions = {
            de: "Entschuldigung 😊 An welchem Tag möchten Sie anreisen? Zum Beispiel: morgen oder Freitag.",
            da: "Undskyld 😊 Hvilken dag ønsker I at ankomme? For eksempel: i morgen eller fredag.",
            en: "Sorry 😊 Which day would you like to arrive? For example: tomorrow or Friday.",
            no: "Beklager 😊 Hvilken dag ønsker dere å ankomme? For eksempel: i morgen eller fredag.",
            sv: "Ursäkta 😊 Vilken dag vill ni anlända? Till exempel: i morgon eller fredag."
        };

        addMessage(arrivalQuestions[responseLanguage]);
        return;
    }
}
    if (bookingInProgress && bookingRequest.nights !== null && saveBookingGuests(raw)) {
    const confirmations = {
        de: "Vielen Dank! 😊 Ich habe Ihre Angaben zur Personenzahl aufgenommen.",
        da: "Mange tak! 😊 Jeg har noteret antallet af gæster.",
        en: "Thank you! 😊 I've noted the number of guests.",
        no: "Tusen takk! 😊 Jeg har notert antall gjester.",
        sv: "Tack så mycket! 😊 Jag har noterat antalet gäster."
    };

    const accommodationQuestions = {
    de: "Vielen Dank! 😊 Welche Unterkunft wünschen Sie – einen Stellplatz für ein Wohnmobil oder einen Wohnwagen, einen Zeltplatz oder eine Ferienunterkunft?",
    da: "Mange tak! 😊 Hvilken type overnatning ønsker I – en plads til autocamper eller campingvogn, en teltplads eller en feriebolig?",
    en: "Thank you! 😊 What type of accommodation would you prefer – a motorhome or caravan pitch, a tent pitch, or a holiday home?",
    no: "Tusen takk! 😊 Hvilken type overnatting ønsker dere – en plass til bobil eller campingvogn, en teltplass eller en feriebolig?",
    sv: "Tack så mycket! 😊 Vilken typ av boende önskar ni – en plats för husbil eller husvagn, en tältplats eller ett semesterboende?"
};

if (bookingRequest.accommodation !== null) {
    addMessage(createBookingSummary(responseLanguage));
    lastBookingRequest = { ...bookingRequest };
    bookingRequest = null;
     renderContactHandoff(responseLanguage);
} else {
    addMessage(accommodationQuestions[responseLanguage]);
}
return;
}
if (bookingInProgress && bookingRequest.nights === null && saveBookingNights(raw)) {
  const nextQuestions = {
        de: "Vielen Dank! 😊 Mit wie vielen Erwachsenen und Kindern reisen Sie an?",
        da: "Mange tak! 😊 Hvor mange voksne og børn rejser I med?",
        en: "Thank you! 😊 How many adults and children will be travelling?",
        no: "Tusen takk! 😊 Hvor mange voksne og barn reiser dere med?",
        sv: "Tack så mycket! 😊 Hur många vuxna och barn reser ni med?"
    };

    addMessage(nextQuestions[responseLanguage]);
    return;
}
    const localeTag = ({ de: "de-DE", da: "da-DK", en: "en-GB", no: "nb-NO", sv: "sv-SE" })[responseLanguage];
const q = raw.toLocaleLowerCase(localeTag);
    const patterns = {
      emergency: {
        de: /notfall|akute gefahr|lebensgefahr|brand|feuer|unfall|schwer verletzt|medizinischer notfall/,
        da: /nødsituation|akut fare|livsfare|brand|ild|ulykke|alvorligt skadet|medicinsk nødsituation/,
        en: /emergency|immediate danger|life-threatening|fire|accident|seriously injured|medical emergency/,
        no: /nødsituasjon|akutt fare|livsfare|brann|ulykke|alvorlig skadet|medisinsk nødsituasjon/,
        sv: /nödsituation|akut fara|livsfara|brand|olycka|allvarligt skadad|medicinsk nödsituation/
      },
      walkIn: {
        de: /ohne.{0,24}(buch|reserv)|spontan|unangemeldet|ohne voranmeldung/,
        da: /uden.{0,24}(booking|reservation)|spontan|uanmeldt|uden forudbestilling/,
        en: /without.{0,24}(booking|reservation)|walk.?in|spontaneous|without prior booking/,
        no: /uten.{0,24}(bestilling|reservasjon)|spontan|uten forhåndsbestilling|drop.?in/,
        sv: /utan.{0,24}(bokning|reservation)|spontan|utan förbokning|drop.?in/
      },
      request: {
        de: /buchungsanfrage|aufenthalt anfragen|reservierungsanfrage|ich möchte.*(buchen|reservieren)|(?:buchen|reservieren).*möchte/,
        da: /forespørg.*ophold|vil gerne.*(booke|sende en forespørgsel)|anmod.*ophold/,
        en: /stay enquiry|booking enquiry|i('d| would) like to (book|enquire)|i want to (book|enquire)|can i (book|reserve)|could i (book|reserve)|make a reservation|book a pitch|reserve a pitch/i,
        no: /forespørsel.*(opphold|bestilling)|bestillingsforespørsel|jeg vil gjerne.*(bestille|sende en forespørsel)/,
        sv: /förfrågan.*(vistelse|bokning)|bokningsförfrågan|jag vill gärna.*(boka|skicka en förfrågan)/
      },
      pitches: {
        de: /stellplatz|wohnmobil|wohnwagen|zelt/,
        da: /\b(plads|pladser|autocamper|campingvogn|telt)\b/,
        en: /pitch|motorhome|campervan|caravan|tent/,
        no: /campingplass|bobil|campingvogn|telt/,
        sv: /campingplats|husbil|husvagn|tält/
      },
      accommodation: {
        de: /unterkunft|ferienhaus|ferienwohnung|hütte/,
        da: /feriebolig|feriehus|sommerhus|hytte|overnatning/,
        en: /accommodation|holiday home|holiday rental|vacation rental|cabin|apartment|lodging/,
        no: /overnatting|feriehus|ferieleilighet|hytte|leilighet/,
        sv: /boende|semesterhus|semesterlägenhet|stuga|lägenhet/
      },
            lateArrival: {
        de: /spät.{0,40}(anreisen|ankommen|check.?in)|nach.{0,40}(rezeptionsschluss|öffnungszeiten).{0,40}(anreisen|ankommen)|anreise.{0,40}(spät|abends|nachts)/,
        da: /sen.{0,40}ankomst|ankomme.{0,40}(sent|om aftenen|om natten)|ankomst.{0,40}(sent|aften|nat)|uden for.{0,40}receptionens åbningstid/,
        en: /late.{0,40}(arrival|check.?in)|arriv.{0,40}(late|at night|after hours)|outside.{0,40}reception.{0,40}hours/,
        no: /sen.{0,40}ankomst|ankomme.{0,40}(sent|om kvelden|om natten)|ankomst.{0,40}(sent|kveld|natt)|utenfor.{0,40}resepsjonens åpningstid/,
        sv: /sen.{0,40}ankomst|ankomma.{0,40}(sent|på kvällen|på natten)|ankomst.{0,40}(sent|kväll|natt)|utanför.{0,40}receptionens öppettider/
      },
      checkin: {
        de: /check.?in|anreise|ankunft|check.?out|abreise/,
        da: /check.?in|ankomst|ankommer|check.?out|afrejse/,
        en: /check.?in|arrival|arrive|check.?out|departure/,
        no: /innsjekk|innsjekking|utsjekk|utsjekking|ankomst|avreise/,
        sv: /incheckning|utcheckning|ankomst|avresa/
      },
      dogs: {
        de: /hund|haustier/,
        da: /hund|kæledyr/,
        en: /dog|pet/,
        no: /hund|kjæledyr/,
        sv: /hund|husdjur/
      },
      electricity: {
        de: /strom|elektr/,
        da: /strøm|elektricitet/,
        en: /electricity|power socket|power supply/,
        no: /strøm|elektr/,
        sv: /ström|eluttag|elektr/
      },
      sanitary: {
        de: /sanit|dusche|toilet/,
        da: /servicebygning|sanit|bad|toilet/,
        en: /sanitary|toilet|shower|bathroom|washroom/,
        no: /sanitær|toalett|dusj|bad/,
        sv: /sanitär|toalett|dusch|badrum/
      },
      quiet: {
        de: /schulferien|kinderferien|außerhalb.{0,20}ferien|ohne.{0,20}ferien|ruhig|nebensaison/,
        da: /skoleferie|børneferie|ferieperiode|rolig|lavsæson/,
        en: /school holiday|school break|quiet|low season/,
        no: /skoleferie|barneferie|lavsesong|rolig|utenom ferien/,
        sv: /skollov|skolledighet|lågsäsong|lugnt|utanför loven/
      },
      activities: {
        de: /aktivität|programm|animation|freizeit/,
        da: /aktivitet|program|underholdning|fritid/,
        en: /activit|programme|program|entertainment|things to do/,
        no: /aktivitet|program|underholdning|fritid/,
        sv: /aktivitet|program|underhållning|fritid/
      },
            cancellation: {
        de: /stornier|storno|umbuch|buchung ändern|reservierung ändern|rücktritt/,
        da: /afbestil|annuller|ændre.{0,30}(booking|reservation)|ombook/,
        en: /cancel|cancellation|change.{0,30}(booking|reservation)|modify.{0,30}(booking|reservation)/,
        no: /avbestill|kanseller|endre.{0,30}(bestilling|reservasjon)|ombook/,
        sv: /avbok|avbeställ|ändra.{0,30}(bokning|reservation)|ombok/
      },
            motorhomeDisposal: {
        de: /grauwasser|schwarzwasser|toilettenkassette|chemietoilette|entsorgungsstation|wohnmobil.{0,30}entsorg/,
        da: /gråvand|spildevand|toilettank|kemisk toilet|tømmestation|tømme.{0,30}autocamper/,
        en: /grey.?water|gray.?water|black.?water|chemical toilet|toilet cassette|waste disposal|empty.{0,30}toilet/,
        no: /gråvann|spillvann|toalettank|kjemisk toalett|tømmestasjon|tømme.{0,30}bobil/,
        sv: /gråvatten|svartvatten|toalettank|kemisk toalett|tömningsstation|tömma.{0,30}husbil/
      },
            playground: {
        de: /spielplatz|kinderspielplatz|kinderprogramm|kinderaktivitäten|spielmöglichkeiten/,
        da: /legeplads|børneaktiviteter|børneprogram|legemuligheder/,
        en: /playground|children.s activities|kids. activities|kids. club|play area/,
        no: /lekeplass|barneaktiviteter|barneprogram|lekemuligheter/,
        sv: /lekplats|barnaktiviteter|barnprogram|lekmöjligheter/
      },
            shopping: {
        de: /brötchen|brötchenservice|brotservice|supermarkt|einkaufen|kiosk|campingladen/,
        da: /morgenbrød|brødservice|supermarked|indkøb|kiosk|campingbutik/,
        en: /fresh bread|bread service|supermarket|grocery|shop|camping store/,
        no: /ferske rundstykker|brødservice|supermarked|butikk|kiosk|handle mat/,
        sv: /färskt bröd|brödservice|mataffär|livsmedelsbutik|kiosk|handla mat/
      },
            laundry: {
        de: /waschmaschine|wäsche waschen|wäschetrockner|trockner|waschraum/,
        da: /vaskemaskine|vaske tøj|tørretumbler|vaskeri/,
        en: /washing machine|laundry|tumble dryer|clothes dryer/,
        no: /vaskemaskin|vaske klær|tørketrommel|vaskeri/,
        sv: /tvättmaskin|tvätta kläder|torktumlare|tvättstuga/
      },
      waterSports: {
        de: /wassersport|surfen|kiten|paddel|kajak|baden|schwimmen/,
        da: /vandsport|surf|kite|paddle|kajak|badning|svøm/,
        en: /water sport|watersport|surf|kite|paddl|kayak|swim|bathing/,
        no: /vannsport|surf|kite|padling|kajakk|bading|svøm/,
        sv: /vattensport|surf|kite|paddling|kajak|bad|simning/
      },
            receptionHours: {
        de: /öffnungszeiten.{0,40}rezeption|rezeption.{0,40}(geöffnet|offen|öffnet|schließt)|wann.{0,30}rezeption.{0,30}(offen|auf)/,
        da: /receptionens åbningstid|hvornår.{0,30}receptionen.{0,30}(åben|åbner|lukker)|åbningstider.{0,30}reception/,
        en: /reception opening hours|when.{0,30}reception.{0,30}(open|close)|what time.{0,30}reception/,
        no: /resepsjonens åpningstid|når.{0,30}resepsjonen.{0,30}(åpen|åpner|stenger)|åpningstider.{0,30}resepsjon/,
        sv: /receptionens öppettider|när.{0,30}receptionen.{0,30}(öppen|öppnar|stänger)|öppettider.{0,30}reception/
      },
      contact: {
        de: /kontakt|telefon|e-?mail|erreichen|rezeption/,
        da: /kontakt|telefon|e-?mail|nå os|reception/,
        en: /contact|phone|e-?mail|reach|reception/,
        no: /kontakt|telefon|e-?post|resepsjon/,
        sv: /kontakt|telefon|e-?post|reception/
      },
           prices: {
        de: /preis|kost(?:en|et|e|est)|gebühr|tarif/,
        da: /pris|koster|betaling|takst/,
        en: /price|cost|rate|fee/,
        no: /pris|koster|betaling|takst/,
        sv: /pris|kostar|avgift|taxa/
      },
      availability: {
        de: /verfügbar|verfügbarkeit|frei(?:er|e|es|en)?\s+(?:stellplatz|platz)|noch\s+plätze\s+frei/,
        da: /tilgængelig|ledig(?:e)?\s+plads(?:er)?|belægning/,
        en: /available|availability|vacan|free pitch/,
        no: /tilgjengelig|ledig(?:e)?\s+plass(?:er)?|belegg/,
        sv: /tillgänglig|ledig(?:a)?\s+plats(?:er)?|beläggning/
      },
      bookingInterest: {
    de: /möchte.{0,150}(anreisen|buchen|reservieren|kommen|campen)|möchten.{0,150}(anreisen|buchen|reservieren|kommen|campen)|würde.{0,150}buchen|würden gerne.{0,150}campen/,
    da: /vil gerne.{0,40}(ankomme|booke|reservere)|ønsker at booke/,
    en: /would like to.{0,40}(arrive|book|reserve)|want to book/,
    no: /vil gjerne.{0,60}(ankomme|bestille|reservere)|ønsker å.{0,60}(ankomme|bestille|reservere)|ønsker å booke/,    
    sv: /vill gärna.{0,40}(ankomma|boka|reservera)|vill boka/
}
    };
    const matches = (key) => patterns[key][responseLanguage].test(q);
    if (matches("emergency")) {
     addMessage(tr("emergency", responseLanguage));
      return;
    }
    const asksAboutWalkIn = matches("walkIn");
  const bookingInterest = matches("bookingInterest");
if (bookingInterest && !bookingInProgress) {
    startBookingRequest();
    saveBookingAccommodation(raw);
    saveBookingArrival(raw);
    saveBookingNights(raw);
    saveBookingGuests(raw);
}
    if (
    bookingInterest &&
    bookingRequest &&
    bookingRequest.arrival !== null &&
    bookingRequest.nights !== null &&
    bookingRequest.adults !== null &&
    bookingRequest.children !== null &&
    bookingRequest.accommodation !== null
) {
    addMessage(createBookingSummary(responseLanguage));
    lastBookingRequest = { ...bookingRequest };
    bookingRequest = null;
     renderContactHandoff(responseLanguage);
    return;
}
    const requestIntent = matches("request");
    if (!asksAboutWalkIn && requestIntent) { startRequest(); return; }
    const replies = [];
    if (matches("pitches") && !matches("prices")) replies.push(fact("pitches", responseLanguage));
    if (matches("accommodation")) replies.push(fact("accommodation", responseLanguage));
    if (matches("lateArrival")) replies.push(fact("lateArrival", responseLanguage));
    if (matches("checkin") && !matches("lateArrival")) replies.push(`${fact("checkin", responseLanguage)} ${fact("checkout", responseLanguage)}`);
    if (matches("dogs")) replies.push(fact("dogs", responseLanguage));
    if (/wi.?fi|internet/.test(q) || (responseLanguage === "de" && /wlan/.test(q))) replies.push(fact("wifi", responseLanguage));
    if (matches("electricity")) replies.push(fact("electricity", responseLanguage));
if (matches("sanitary") && !matches("motorhomeDisposal")) {
  replies.push(fact("sanitary", responseLanguage));
}
if (asksAboutWalkIn) replies.push(fact("walkIn", responseLanguage));
if (matches("quiet")) replies.push(fact("quietPeriods", responseLanguage));
    if (matches("activities")) replies.push(fact("activities", responseLanguage));
    if (matches("cancellation")) replies.push(fact("cancellation", responseLanguage));
    if (matches("motorhomeDisposal")) replies.push(fact("motorhomeDisposal", responseLanguage));
    if (matches("playground")) replies.push(fact("playground", responseLanguage));
    if (matches("shopping")) replies.push(fact("shopping", responseLanguage));
    if (matches("laundry")) replies.push(fact("laundry", responseLanguage));
    if (matches("waterSports")) replies.push(fact("waterSports", responseLanguage));
    if (matches("receptionHours")) replies.push(fact("receptionHours", responseLanguage));
    if (matches("contact") && !matches("receptionHours")) {
      const channels = profile.contactChannels || {};

const details = [
    channels.phone && `${tr("contactPhone", responseLanguage)}: ${channels.phone}`,
    channels.email && `${tr("contactEmail", responseLanguage)}: ${channels.email}`
].filter(Boolean);

replies.push(
    details.length
        ? `${tr("contactPrefix", responseLanguage)}\n${details.join("\n")}`
        : profileLocale(profile, responseLanguage).contactMissing || tr("contactMissing", responseLanguage)
);
    }
  if (bookingInterest) {
    const bookingReplies = {
    de: "Schön, dass Sie einen Aufenthalt bei uns planen! 😊 In dieser Demo kann ich keine Verfügbarkeit prüfen oder Buchungen vornehmen. Wann möchten Sie anreisen?",

    da: "Dejligt, at I planlægger et ophold hos os! 😊 I denne demo kan jeg ikke kontrollere ledige pladser eller foretage bookinger. Hvornår ønsker I at ankomme?",

    en: "We're happy you're planning a stay with us! 😊 This demo cannot check live availability or make bookings. When would you like to arrive?",

    no: "Så hyggelig at dere planlegger et opphold hos oss! 😊 Denne demoen kan ikke sjekke ledige plasser eller gjennomføre bestillinger. Når ønsker dere å ankomme?",

    sv: "Vad roligt att ni planerar en vistelse hos oss! 😊 Den här demon kan inte kontrollera lediga platser eller genomföra bokningar. När vill ni anlända?"
};

if (bookingRequest && bookingRequest.arrival !== null) {
    const nightsQuestions = {
        de: "Vielen Dank! 😊 Wie viele Nächte möchten Sie bleiben?",
        da: "Mange tak! 😊 Hvor mange nætter ønsker I at blive?",
        en: "Thank you! 😊 How many nights would you like to stay?",
        no: "Tusen takk! 😊 Hvor mange netter ønsker dere å bli?",
        sv: "Tack så mycket! 😊 Hur många nätter vill ni stanna?"
    };

   if (bookingRequest.nights !== null) {
    const guestsQuestions = {
        de: "Vielen Dank! 😊 Mit wie vielen Erwachsenen und Kindern reisen Sie an?",
        da: "Mange tak! 😊 Hvor mange voksne og børn rejser I med?",
        en: "Thank you! 😊 How many adults and children will be travelling?",
        no: "Tusen takk! 😊 Hvor mange voksne og barn reiser dere med?",
        sv: "Tack så mycket! 😊 Hur många vuxna och barn reser ni med?"
    };

    replies.unshift(guestsQuestions[responseLanguage]);
} else {
    replies.unshift(nightsQuestions[responseLanguage]);
}
} else {
    replies.unshift(bookingReplies[responseLanguage]);
}
}
    if (bookingInterest && bookingRequest) return addMessage(replies[0]);
    
if (matches("prices")) {
  replies.push(fact("prices", responseLanguage));
}
if (matches("availability")) {
  replies.push(
    window.TBD_LOCALES[responseLanguage]?.priceAvailability
    ?? window.TBD_LOCALES.de.priceAvailability
  );
}    
    if (replies.length) return addMessage(replies.join("\n\n"));
    
return addMessage(profileLocale(profile, responseLanguage).fallbackReply || fact("unknown", responseLanguage));
}
  form.addEventListener("submit", (event) => {
    event.preventDefault(); const value = input.value.trim(); if (!value) return;
    addMessage(value, "user"); input.value = ""; answer(value);
  });
  quick.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-question]"); if (!button) return;
    const question = button.dataset.question; addMessage(question, "user"); answer(question);
  });
  profilePicker.addEventListener("change", () => {
    profile = profiles.find((item) => item.id === profilePicker.value) || profiles[0];
    applyLanguage();
    resetConversation();
  });
  languagePicker.addEventListener("change", () => {
    language = languagePicker.value;
    applyLanguage();
    resetConversation();
  });

  // V0.9 – Betreiber-Interessentenformular, vollständig lokal im Browser.
  // Vor einem öffentlichen Einsatz die geschäftliche Empfängeradresse konfigurieren.
  const TBD_BUSINESS_EMAIL = "logistik.thomas@gmail.com";
  const leadText = {
    de: {cta:"Kostenlose persönliche Demo anfordern",heading:"TBD AI Receptionist für Ihren Betrieb",intro:"Interesse an einem mehrsprachigen digitalen Gästeservice? Bereiten Sie eine unverbindliche Anfrage vor.",name:"Ihr Name",business:"Campingplatz / Betrieb",email:"Geschäftliche E-Mail-Adresse",website:"Website (optional)",features:"Welche Funktionen interessieren Sie?",demo:"Persönliche Demo",faq:"Mehrsprachige Gästefragen",booking:"Buchungsanfragen",phone:"Telefonassistent (Zukunftsoption)",other:"Weitere Wünsche",send:"E-Mail vorbereiten",copy:"Anfrage kopieren",close:"Schließen",notice:"Demo: Keine automatische Übermittlung. Bitte keine echten personenbezogenen Daten eingeben. Die Nachricht wird nicht automatisch versendet.",copied:"Anfrage kopiert.",error:"Bitte füllen Sie Name, Betrieb und gültige E-Mail-Adresse aus.",subject:"Anfrage: TBD AI Receptionist",recipient:"Bitte tragen Sie die Empfängeradresse von TBD AI Solutions in Ihrem E-Mail-Programm ein."},
    da: {cta:"Bestil en gratis personlig demo",heading:"TBD AI Receptionist til din virksomhed",intro:"Interesseret i flersproget digital gæsteservice? Forbered en uforpligtende forespørgsel.",name:"Dit navn",business:"Campingplads / virksomhed",email:"Erhvervs-e-mail",website:"Hjemmeside (valgfrit)",features:"Hvilke funktioner interesserer dig?",demo:"Personlig demo",faq:"Flersproget gæsteservice",booking:"Bookingforespørgsler",phone:"Telefonassistent (fremtidig mulighed)",other:"Andre ønsker",send:"Forbered e-mail",copy:"Kopiér forespørgsel",close:"Luk",notice:"Demo: Ingen automatisk afsendelse. Indtast ikke rigtige personoplysninger. E-mailen sendes ikke automatisk.",copied:"Forespørgslen er kopieret.",error:"Udfyld navn, virksomhed og en gyldig e-mailadresse.",subject:"Forespørgsel: TBD AI Receptionist",recipient:"Indtast TBD AI Solutions' modtageradresse i dit e-mailprogram."},
    en: {cta:"Request a free personal demo",heading:"TBD AI Receptionist for your business",intro:"Interested in multilingual digital guest service? Prepare a no-obligation enquiry.",name:"Your name",business:"Campsite / business",email:"Business email",website:"Website (optional)",features:"Which features interest you?",demo:"Personal demo",faq:"Multilingual guest FAQs",booking:"Booking enquiries",phone:"Phone assistant (future option)",other:"Other requirements",send:"Prepare email",copy:"Copy enquiry",close:"Close",notice:"Demo: No automatic submission. Do not enter real personal details. The email is not sent automatically.",copied:"Enquiry copied.",error:"Enter your name, business and a valid email address.",subject:"Enquiry: TBD AI Receptionist",recipient:"Enter TBD AI Solutions' recipient address in your email app."},
    no: {cta:"Be om en gratis personlig demo",heading:"TBD AI Receptionist for din bedrift",intro:"Interessert i flerspråklig digital gjesteservice? Klargjør en uforpliktende forespørsel.",name:"Navnet ditt",business:"Campingplass / bedrift",email:"E-postadresse for bedriften",website:"Nettsted (valgfritt)",features:"Hvilke funksjoner er interessante?",demo:"Personlig demo",faq:"Flerspråklige gjestespørsmål",booking:"Bestillingsforespørsler",phone:"Telefonassistent (fremtidig mulighet)",other:"Andre ønsker",send:"Klargjør e-post",copy:"Kopier forespørsel",close:"Lukk",notice:"Demo: Ingen automatisk sending. Ikke oppgi ekte personopplysninger. E-posten sendes ikke automatisk.",copied:"Forespørselen er kopiert.",error:"Oppgi navn, bedrift og gyldig e-postadresse.",subject:"Forespørsel: TBD AI Receptionist",recipient:"Skriv inn TBD AI Solutions' mottakeradresse i e-postprogrammet."},
    sv: {cta:"Begär en gratis personlig demo",heading:"TBD AI Receptionist för din verksamhet",intro:"Intresserad av flerspråkig digital gästservice? Förbered en förutsättningslös förfrågan.",name:"Ditt namn",business:"Campingplats / verksamhet",email:"E-postadress till företaget",website:"Webbplats (valfritt)",features:"Vilka funktioner är intressanta?",demo:"Personlig demo",faq:"Flerspråkiga gästfrågor",booking:"Bokningsförfrågningar",phone:"Telefonassistent (framtida möjlighet)",other:"Övriga önskemål",send:"Förbered e-post",copy:"Kopiera förfrågan",close:"Stäng",notice:"Demo: Ingen automatisk överföring. Ange inte riktiga personuppgifter. E-postmeddelandet skickas inte automatiskt.",copied:"Förfrågan kopierad.",error:"Ange namn, verksamhet och giltig e-postadress.",subject:"Förfrågan: TBD AI Receptionist",recipient:"Ange TBD AI Solutions mottagaradress i ditt e-postprogram."}
  };
  function setupOperatorLeadForm() {
    const container = document.createElement("section");
    container.id = "tbd-operator-lead";
    container.style.cssText = "margin:18px auto;padding:18px;max-width:680px;border:1px solid #cbd5d1;border-radius:14px;background:#f5faf7;color:#173a2c;box-sizing:border-box";
    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.style.cssText = "width:100%;padding:13px 16px;background:#176c4c;color:white;border:0;border-radius:9px;font-weight:700;cursor:pointer";
    const panel = document.createElement("div");
    panel.hidden = true;
    panel.style.cssText = "padding-top:15px";
    container.append(toggle,panel);
    const anchor = document.querySelector("#chat-form");
    const chatRoot = anchor?.closest(".chat-card") || anchor?.parentElement;
    if (chatRoot?.parentElement) chatRoot.insertAdjacentElement("afterend",container);
    else document.body.appendChild(container);
    function render() {
      const t = leadText[language] || leadText.de;
      toggle.textContent = t.cta;
      panel.replaceChildren();
      const title=document.createElement("h3"); title.textContent=t.heading;
      const intro=document.createElement("p"); intro.textContent=t.intro;
      const lead=document.createElement("form");
      lead.className="inline-form";
      lead.style.cssText="display:grid;gap:10px";
      function field(label,type,required=false) {
        const wrap=document.createElement("label"); wrap.textContent=label;
        wrap.style.cssText="display:grid;gap:4px";
        const input=document.createElement("input"); input.type=type; input.required=required;
        input.maxLength=type==="email"?254:200;
        input.style.cssText="padding:9px;border:1px solid #aabbb2;border-radius:6px;width:100%;box-sizing:border-box";
        wrap.appendChild(input);lead.appendChild(wrap);return input;
      }
      const name=field(t.name,"text",true), business=field(t.business,"text",true), email=field(t.email,"email",true), website=field(t.website,"url");
      const legend=document.createElement("strong");legend.textContent=t.features;lead.appendChild(legend);
      const checks=[];
      for(const key of ["demo","faq","booking","phone"]) {
        const label=document.createElement("label");label.style.cssText="display:flex;align-items:center;gap:8px";
        const check=document.createElement("input");check.type="checkbox";check.checked=key==="demo";
        label.append(check,document.createTextNode(t[key]));lead.appendChild(label);checks.push([key,check]);
      }
      const other=field(t.other,"text");
      const actions=document.createElement("div");actions.style.cssText="display:flex;flex-wrap:wrap;gap:8px";
      const prepare=document.createElement("button");prepare.type="submit";prepare.textContent=t.send;
      const copy=document.createElement("button");copy.type="button";copy.textContent=t.copy;
      for(const btn of [prepare,copy])btn.style.cssText="padding:10px 13px;border:1px solid #176c4c;border-radius:8px;cursor:pointer";
      actions.append(prepare,copy);lead.appendChild(actions);
      const note=document.createElement("p");note.textContent=t.notice;note.style.fontSize="0.85em";
      const status=document.createElement("p");status.setAttribute("role","status");
      const buildBody=()=>[t.heading,`${t.name}: ${name.value.trim()}`,`${t.business}: ${business.value.trim()}`,`${t.email}: ${email.value.trim()}`,`${t.website}: ${website.value.trim()}`,`${t.features}: ${checks.filter(([,check])=>check.checked).map(([key])=>t[key]).join(", ")}`,`${t.other}: ${other.value.trim()}`].join("\n");
      const valid=()=>{if(!name.value.trim()||!business.value.trim()||!email.checkValidity()||!website.checkValidity()){status.textContent=t.error;lead.reportValidity();return false;}return true;};
      lead.addEventListener("submit",e=>{e.preventDefault();if(!valid())return;window.location.href="mailto:"+encodeURIComponent(TBD_BUSINESS_EMAIL)+"?subject="+encodeURIComponent(t.subject)+"&body="+encodeURIComponent(buildBody());status.textContent=TBD_BUSINESS_EMAIL?t.notice:t.recipient;});
      copy.addEventListener("click",async()=>{if(!valid())return;const body=buildBody();try{await navigator.clipboard.writeText(body);status.textContent=t.copied;}catch(e){const area=document.createElement("textarea");area.value=body;area.readOnly=true;area.rows=10;area.style.width="100%";panel.appendChild(area);area.select();status.textContent=t.copied;}});
      panel.append(title,intro,lead,note,status);
    }
    toggle.addEventListener("click",()=>{panel.hidden=!panel.hidden;if(!panel.hidden)render();});
    languagePicker.addEventListener("change",()=>{render();panel.hidden=true;});
    render();
  }

  applyLanguage();
  resetConversation();
  setupOperatorLeadForm();
})();
