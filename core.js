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
    if (/^no(?:-|$)|^nb(?:-|$)|^nn(?:-|$)/.test(locale)) return "no";
    if (/^sv(?:-|$)/.test(locale)) return "sv";
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
        de: /\b(ich|möchte|können|kann|haben|dürfen|darf|meinen|meine|gibt|welche|wann|anreise|stellplatz|wohnmobil|übernachten)\b|[äüß]/g,

        da: /\b(jeg|hvad|hvornår|gerne|jeres|må|medbringe|ankommer|overnatning|campingplads|autocamper|kan jeg|har i)\b|[æø]/g,

        en: /\b(hello|please|would|where|when|booking|pitch|can i|do you|is there|how much|available|arrival|departure|thank you)\b/g,

        no: /\b(jeg|hva|hvor|når|gjerne|dere|kjæledyr|bobil|bestille|overnatting|ankommer|kan jeg|har dere|hytta)\b/g,

        sv: /\b(jag|vad|när|gärna|får|finns|husbil|husvagn|stuga|boende|boka|ankommer|kan jag|har ni|tack)\b|[äö]/g
    };

    const scores = {};

    for (const [lang, regex] of Object.entries(signals)) {
        scores[lang] = [...text.matchAll(regex)].length;
    }

    const highest = Math.max(...Object.values(scores));

    if (highest === 0) return language;

    const winners = Object.keys(scores).filter(
        lang => scores[lang] === highest
    );

    return winners.includes(language) ? language : winners[0];
  }   
function answer(raw) {
    responseLanguage = detectMessageLanguage(raw);
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
        de: /preis|kosten|verfügbar|verfügbarkeit|frei\b/,
        da: /pris|koster|tilgængelig|ledig\b|belægning/,
        en: /price|cost|available|availability|vacan|free pitch/,
        no: /pris|koster|tilgjengelig|ledig|belegg/,
        sv: /pris|kostar|tillgänglig|ledig|beläggning/
      }
    };
    const matches = (key) => patterns[key][responseLanguage].test(q);
    if (matches("emergency")) {
     addMessage(tr("emergency", responseLanguage));
      return;
    }
    const asksAboutWalkIn = matches("walkIn");
    const requestIntent = matches("request");
    if (!asksAboutWalkIn && requestIntent) { startRequest(); return; }
    const replies = [];
    if (matches("pitches")) replies.push(fact("pitches", responseLanguage));
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
    if (matches("prices")) replies.push(tr("priceAvailability", responseLanguage));
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
