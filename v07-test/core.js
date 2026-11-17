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
return;
}
   if (bookingInProgress && bookingRequest.arrival === null) {
    if (saveBookingArrival(raw)) {
         if (bookingRequest.nights !== null && bookingRequest.adults !== null &&
             bookingRequest.children !== null && bookingRequest.accommodation !== null) {
             addMessage(createBookingSummary(responseLanguage));
             lastBookingRequest = { ...bookingRequest };
             bookingRequest = null;
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
      waterSports: {
        de: /wassersport|surfen|kiten|paddel|kajak|baden|schwimmen/,
        da: /vandsport|surf|kite|paddle|kajak|badning|svøm/,
        en: /water sport|watersport|surf|kite|paddl|kayak|swim|bathing/,
        no: /vannsport|surf|kite|padling|kajakk|bading|svøm/,
        sv: /vattensport|surf|kite|paddling|kajak|bad|simning/
      },
      contact: {
        de: /kontakt|telefon|e-?mail|erreichen|rezeption/,
        da: /kontakt|telefon|e-?mail|nå os|reception/,
        en: /contact|phone|e-?mail|reach|reception/,
        no: /kontakt|telefon|e-?post|resepsjon/,
        sv: /kontakt|telefon|e-?post|reception/
      },
      prices: {
        de: /preis|kost(?:en|et|e|est)|verfügbar|verfügbarkeit|frei\b/,
        da: /pris|koster|tilgængelig|ledig\b|belægning/,
        en: /price|cost|available|availability|vacan|free pitch/,
        no: /pris|koster|tilgjengelig|ledig|belegg/,
        sv: /pris|kostar|tillgänglig|ledig|beläggning/
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
    return;
}
    const requestIntent = matches("request");
    if (!asksAboutWalkIn && requestIntent) { startRequest(); return; }
    const replies = [];
    if (matches("pitches") && !matches("prices")) replies.push(fact("pitches", responseLanguage));
    if (matches("accommodation")) replies.push(fact("accommodation", responseLanguage));
    if (matches("checkin")) replies.push(`${fact("checkin", responseLanguage)} ${fact("checkout", responseLanguage)}`);
    if (matches("dogs")) replies.push(fact("dogs", responseLanguage));
    if (/wi.?fi|internet/.test(q) || (responseLanguage === "de" && /wlan/.test(q))) replies.push(fact("wifi", responseLanguage));
    if (matches("electricity")) replies.push(fact("electricity", responseLanguage));
    if (matches("sanitary")) replies.push(fact("sanitary", responseLanguage));
    if (asksAboutWalkIn) replies.push(fact("walkIn", responseLanguage));
    if (matches("quiet")) replies.push(fact("quietPeriods", responseLanguage));
    if (matches("activities")) replies.push(fact("activities", responseLanguage));
    if (matches("waterSports")) replies.push(fact("waterSports", responseLanguage));
    if (matches("contact")) {
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
    
if (matches("prices")) replies.push(window.TBD_LOCALES[responseLanguage]?.priceAvailability ?? window.TBD_LOCALES.de.priceAvailability);
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
  applyLanguage();
  resetConversation();
})();

