/* Austauschbares Kundenprofil: pro Betrieb eine eigene Datei mit demselben Schema. */
window.TBD_PROFILES = window.TBD_PROFILES || [];
window.TBD_PROFILES.push({
  id: "nordsee-camping-resort",
  name: "Nordsee Camping Resort",
  fictional: true,
  facts: {
    pitches: "Im Demo-Profil sind Stellplätze für Wohnmobile, Wohnwagen und Zelte vorgesehen. Maße, Kategorien und Ausstattung sind noch nicht konkret festgelegt.",
    accommodation: "Im Demo-Profil sind Ferienhäuser in verschiedenen Größen vorgesehen. Belegung, Ausstattung und konkrete Haustypen sind noch offen.",
    checkin: "Der Demo-Check-in ist ab 14:00 Uhr möglich.",
    checkout: "Der Demo-Check-out ist bis 11:00 Uhr vorgesehen.",
    dogs: "Hunde sind laut Demo-Profil willkommen.",
    wifi: "WLAN ist laut Demo-Profil kostenlos verfügbar.",
    electricity: "Stromanschlüsse sind laut Demo-Profil verfügbar. Genauere technische Details sind noch nicht hinterlegt.",
    sanitary: "Sanitäranlagen sind laut Demo-Profil rund um die Uhr zugänglich.",
    walkIn: "Im Demo-Profil ist nicht bestätigt, ob eine Anreise ohne Buchung möglich ist. Es gibt keine Live-Auslastung, daher kann ich keinen freien Platz zusagen. Bitte vor der Anreise direkt beim Betrieb nachfragen.",
    quietPeriods: "Konkrete ruhige Zeiträume und Öffnungszeiten sind im Demo-Profil nicht hinterlegt. Außerhalb der Schulferien ist es häufig ruhiger; die Ferienzeiten unterscheiden sich je nach Herkunftsregion. Für eine verlässliche Empfehlung müssten die Region und die aktuellen Saisonzeiten bekannt sein.",
    activities: "Im Demo-Profil sind keine besonderen Aktivitäten oder Animationsangebote bestätigt. Das Programm ist noch nicht hinterlegt.",
    waterSports: "Im Demo-Profil sind keine Wassersportangebote oder örtlichen Bedingungen bestätigt. Bitte prüfe vor einer Planung die lokalen Informationen zu Angeboten, Zugang und Sicherheit."
  },
  locales: {
    da: {
      name: "Nordsee Camping Resort",
      facts: {
        pitches: "I demoprofilen findes der pladser til autocampere, campingvogne og telte. Mål, kategorier og faciliteter er endnu ikke fastlagt.",
        accommodation: "I demoprofilen findes ferieboliger i forskellige størrelser. Antal gæster, faciliteter og konkrete boligtyper er endnu ikke fastlagt.",
        checkin: "Demo-indtjekning er fra kl. 14.00.",
        checkout: "Demo-udtjekning er senest kl. 11.00.",
        dogs: "Ifølge demoprofilen er hunde velkomne.",
        wifi: "Ifølge demoprofilen er wi-fi gratis.",
        electricity: "Ifølge demoprofilen er der adgang til strøm. Flere tekniske oplysninger er endnu ikke angivet.",
        sanitary: "Ifølge demoprofilen er servicebygningen tilgængelig døgnet rundt.",
        walkIn: "Demoprofilen bekræfter ikke, om det er muligt at ankomme uden booking. Der er ingen live-oplysninger om belægningen, så jeg kan ikke love, at der er en ledig plads.",
        quietPeriods: "Demoprofilen indeholder ingen bekræftede oplysninger om rolige perioder eller åbningstider. Der er ofte færre gæster uden for skoleferierne, men ferieperioderne varierer efter region. En konkret anbefaling kræver oplysninger om region og sæson.",
        activities: "Demoprofilen bekræfter ingen særlige aktiviteter eller underholdning. Programmet er endnu ikke angivet.",
        waterSports: "Demoprofilen bekræfter ingen vandsportstilbud eller lokale forhold. Tjek lokale oplysninger om tilbud, adgang og sikkerhed, før du planlægger."
      },
      fallbackReply: "Det kan jeg ikke svare sikkert på ud fra de oplysninger, der er lagt ind. Spørg gerne en medarbejder på pladsen; jeg vil ikke gætte. Denne demo kan ikke kontakte medarbejderen automatisk.",
      unconfiguredReply: "Denne oplysning er endnu ikke lagt ind i demoprofilen.",
      contactMissing: "Demoprofilen indeholder ingen kontaktoplysninger. Hvis du allerede er på pladsen, kan du spørge en medarbejder. Denne demo kan ikke sende besked til nogen.",
      contactNote: "Kontaktoplysninger bliver ikke sendt eller gemt i denne prototype."
    },
    en: {
      name: "North Sea Camping Resort",
      facts: {
        pitches: "The demo profile includes pitches for motorhomes, caravans and tents. Pitch sizes, categories and facilities have not been specified yet.",
        accommodation: "The demo profile includes holiday homes in different sizes. Capacity, facilities and specific accommodation types have not been confirmed.",
        checkin: "Demo check-in is from 2:00 pm.",
        checkout: "Demo check-out is by 11:00 am.",
        dogs: "Dogs are welcome according to the demo profile.",
        wifi: "Wi-Fi is free according to the demo profile.",
        electricity: "Electricity hook-ups are available according to the demo profile. Further technical details have not been provided.",
        sanitary: "The sanitary facilities are accessible around the clock according to the demo profile.",
        walkIn: "The demo profile does not confirm whether arrivals without a booking are accepted. There is no live occupancy information, so I can’t promise that a pitch is available.",
        quietPeriods: "The demo profile has no confirmed quiet periods or opening dates. It is often quieter outside school holidays, but school calendars vary by region. A specific recommendation would require the region and current season dates.",
        activities: "The demo profile has no confirmed activities or entertainment programme yet.",
        waterSports: "The demo profile has no confirmed water-sports offers or local conditions. Check local information about activities, access and safety before planning."
      },
      fallbackReply: "I can’t answer that reliably from the information provided. Please ask a member of staff on site; I don’t want to guess. This demo cannot contact them automatically.",
      unconfiguredReply: "This information has not been added to the demo profile yet.",
      contactMissing: "The demo profile has no contact details. If you are already on site, please ask a member of staff. This demo cannot notify anyone automatically.",
      contactNote: "Contact details are not sent or stored by this prototype."
    },
    no: {
      name: "Nordsee Camping Resort",
      facts: {
        pitches: "Demoprofilen viser plasser for bobiler, campingvogner og telt. Størrelser, kategorier og fasiliteter er ikke fastsatt ennå.",
        accommodation: "Demoprofilen viser feriehus i ulike størrelser. Kapasitet, fasiliteter og boligtyper er ikke fastsatt ennå.",
        checkin: "I demoen er innsjekking fra kl. 14.00.",
        checkout: "I demoen er utsjekking senest kl. 11.00.",
        dogs: "Ifølge demoprofilen er hunder velkomne.",
        wifi: "Ifølge demoprofilen er Wi-Fi gratis.",
        electricity: "Ifølge demoprofilen finnes det strømuttak. Flere tekniske detaljer er ikke oppgitt.",
        sanitary: "Ifølge demoprofilen er sanitæranlegget tilgjengelig hele døgnet.",
        walkIn: "Demoprofilen bekrefter ikke om det er mulig å komme uten bestilling. Det finnes ingen live-informasjon om belegget, så jeg kan ikke love at en plass er ledig.",
        quietPeriods: "Demoprofilen har ingen bekreftede opplysninger om rolige perioder eller åpningstider. Det er ofte roligere utenom skoleferiene, men ferieperiodene varierer etter region.",
        activities: "Demoprofilen bekrefter ingen aktiviteter eller underholdning ennå.",
        waterSports: "Demoprofilen bekrefter ingen tilbud om vannsport eller lokale forhold. Sjekk lokale opplysninger om tilbud, tilgang og sikkerhet før du planlegger."
      },
      fallbackReply: "Jeg kan ikke svare sikkert ut fra opplysningene som er lagt inn. Spør gjerne en medarbeider på plassen; jeg vil ikke gjette. Denne demoen kan ikke kontakte medarbeideren automatisk.",
      unconfiguredReply: "Denne opplysningen er ikke lagt inn i demoprofilen ennå.",
      contactMissing: "Demoprofilen inneholder ingen kontaktopplysninger. Hvis du allerede er på plassen, kan du spørre en medarbeider. Denne demoen kan ikke sende noen beskjed.",
      contactNote: "Kontaktopplysninger sendes eller lagres ikke i denne prototypen."
    },
    sv: {
      name: "Nordsee Camping Resort",
      facts: {
        pitches: "Demoprofilen visar platser för husbilar, husvagnar och tält. Storlekar, kategorier och faciliteter är ännu inte fastställda.",
        accommodation: "Demoprofilen visar semesterhus i olika storlekar. Kapacitet, utrustning och boendetyper är ännu inte fastställda.",
        checkin: "I demon är incheckning från kl. 14.00.",
        checkout: "I demon är utcheckning senast kl. 11.00.",
        dogs: "Enligt demoprofilen är hundar välkomna.",
        wifi: "Enligt demoprofilen finns gratis Wi-Fi.",
        electricity: "Enligt demoprofilen finns eluttag. Fler tekniska detaljer saknas.",
        sanitary: "Enligt demoprofilen är sanitetsutrymmena tillgängliga dygnet runt.",
        walkIn: "Demoprofilen bekräftar inte om det går att anlända utan bokning. Det finns inga liveuppgifter om beläggningen, så jag kan inte lova att en plats är ledig.",
        quietPeriods: "Demoprofilen har inga bekräftade uppgifter om lugna perioder eller öppettider. Det är ofta lugnare utanför skolloven, men loven varierar mellan regioner.",
        activities: "Demoprofilen bekräftar ännu inga aktiviteter eller underhållning.",
        waterSports: "Demoprofilen bekräftar inga vattensporter eller lokala förhållanden. Kontrollera lokala uppgifter om utbud, tillträde och säkerhet innan du planerar."
      },
      fallbackReply: "Jag kan inte svara säkert utifrån uppgifterna som finns. Fråga gärna en medarbetare på platsen; jag vill inte gissa. Den här demon kan inte kontakta medarbetaren automatiskt.",
      unconfiguredReply: "Den här uppgiften finns ännu inte i demoprofilen.",
      contactMissing: "Demoprofilen innehåller inga kontaktuppgifter. Om du redan är på platsen kan du fråga en medarbetare. Den här demon kan inte skicka något meddelande.",
      contactNote: "Kontaktuppgifter skickas eller sparas inte i den här prototypen."
    }
  },
  contactChannels: {
    phone: null,
    email: null
  },
  fallbackReply: "Das kann ich mit den hinterlegten Informationen nicht sicher beantworten. Bitte frag kurz einen Kollegen vor Ort; ich möchte nichts erfinden. Diese Demo kann den Kollegen nicht automatisch benachrichtigen.",
  unconfiguredReply: "Diese Information ist im Demo-Profil noch nicht hinterlegt.",
  openItems: [
    "Preise und Saisonzeiten",
    "Platzgrößen und Ausstattung",
    "Belegung und Ausstattung der Ferienhäuser",
    "Telefon und E-Mail der Rezeption",
    "Regeln für spontane Anreise",
    "Saison- und Schulferienkalender",
    "Aktivitäten und Wassersportangebote"
  ],
  contactNote: "Kontaktangaben werden in diesem Prototyp nicht übertragen oder gespeichert."
});
