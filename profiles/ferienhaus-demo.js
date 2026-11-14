/* Fiktives Ferienhausprofil zum Prüfen des wiederverwendbaren TBD Core. */
window.TBD_PROFILES = window.TBD_PROFILES || [];
window.TBD_PROFILES.push({
  id: "ferienhaus-demo",
  name: "DünenNest Ferienhäuser",
  category: "holiday-rental",
  fictional: true,
  facts: {
    accommodation: "Dieses fiktive Demo-Profil zeigt beispielhaft Ferienhäuser und Ferienwohnungen. Objektanzahl, Größen, Belegung und Ausstattung sind keine echten Angebotsdaten.",
    checkin: "Als reiner Demo-Beispielwert ist die Anreise ab 16:00 Uhr vorgesehen. Ein echter Gastgeber müsste diese Zeit bestätigen.",
    checkout: "Als reiner Demo-Beispielwert ist die Abreise bis 10:00 Uhr vorgesehen. Ein echter Gastgeber müsste diese Zeit bestätigen.",
    dogs: "Die Haustierregel ist im fiktiven Beispiel noch nicht festgelegt. Bitte vor einer Buchung beim Gastgeber nachfragen.",
    wifi: "Im fiktiven Beispiel ist WLAN als vorhanden markiert. Für einen echten Betrieb müsste dies bestätigt werden.",
    activities: "In diesem Demo-Profil sind keine konkreten Freizeitangebote oder lokalen Empfehlungen bestätigt."
  },
  locales: {
    da: {
      name: "KlitHjem Ferieboliger",
      facts: {
        accommodation: "Denne fiktive demo viser som eksempel sommerhuse og ferielejligheder. Antal boliger, størrelse, gæstekapacitet og faciliteter er ikke reelle tilbudsoplysninger.",
        checkin: "Som en ren demoeksempelværdi er ankomst fra kl. 16.00. En rigtig vært skal bekræfte tidspunktet.",
        checkout: "Som en ren demoeksempelværdi er afrejse senest kl. 10.00. En rigtig vært skal bekræfte tidspunktet.",
        dogs: "Reglerne for kæledyr er endnu ikke fastlagt i det fiktive eksempel. Spørg værten før booking.",
        wifi: "I det fiktive eksempel er wi-fi markeret som tilgængeligt. En rigtig udlejer skal bekræfte dette.",
        activities: "Demo-profilen bekræfter ingen konkrete aktiviteter eller lokale anbefalinger."
      },
      bookingTypes: ["Vælg", "Sommerhus", "Feriebolig", "Lejlighed", "Flere ferieboliger", "Ikke afklaret"],
      fallbackReply: "Det fremgår ikke af demo-oplysningerne. Kontakt venligst værten; denne prototype kan ikke sende beskeder videre.",
      unconfiguredReply: "Denne oplysning er ikke angivet i demo-profilen.",
      contactMissing: "Der er ikke angivet kontaktoplysninger for værten. Denne demo kan ikke kontakte nogen.",
      contactNote: "Oplysninger bliver ikke sendt eller gemt i denne prototype."
    },
    en: {
      name: "DuneNest Holiday Homes",
      facts: {
        accommodation: "This fictional demo profile shows holiday houses and apartments as examples. Property count, sizes, guest capacity and amenities are not real listing details.",
        checkin: "As a demo-only example, arrival is from 4:00 pm. A real host would need to confirm this time.",
        checkout: "As a demo-only example, departure is by 10:00 am. A real host would need to confirm this time.",
        dogs: "The pet policy is not set in this fictional example. Please ask the host before booking.",
        wifi: "Wi-Fi is marked as available in this fictional example. A real host would need to confirm this.",
        activities: "No specific activities or local recommendations are confirmed in this demo profile."
      },
      bookingTypes: ["Please choose", "Holiday house", "Holiday apartment", "Apartment", "Multiple properties", "Not decided"],
      fallbackReply: "That information is not in the demo profile. Please contact the host; this prototype cannot forward a message.",
      unconfiguredReply: "This information has not been added to the demo profile.",
      contactMissing: "No host contact details are set. This demo cannot contact anyone.",
      contactNote: "Information is not sent or stored by this prototype."
    },
    no: {
      name: "DuneNest Feriehus",
      facts: {
        accommodation: "Denne fiktive demoen viser feriehus og ferieleiligheter som eksempler. Antall boliger, størrelse, kapasitet og fasiliteter er ikke reelle tilbudsopplysninger.",
        checkin: "Som eksempel i demoen er ankomst fra kl. 16.00. En ekte vert må bekrefte tidspunktet.",
        checkout: "Som eksempel i demoen er avreise senest kl. 10.00. En ekte vert må bekrefte tidspunktet.",
        dogs: "Reglene for kjæledyr er ikke fastsatt i dette fiktive eksempelet. Spør verten før bestilling.",
        wifi: "I dette fiktive eksempelet er Wi-Fi markert som tilgjengelig. En ekte utleier må bekrefte dette.",
        activities: "Demoprofilen bekrefter ingen konkrete aktiviteter eller lokale anbefalinger."
      },
      bookingTypes: ["Velg", "Feriehus", "Ferieleilighet", "Leilighet", "Flere ferieboliger", "Ikke bestemt"],
      fallbackReply: "Dette står ikke i demoopplysningene. Kontakt verten; denne prototypen kan ikke sende meldinger videre.",
      unconfiguredReply: "Denne opplysningen er ikke lagt inn i demoprofilen ennå.",
      contactMissing: "Demoprofilen inneholder ingen kontaktopplysninger til verten. Denne demoen kan ikke kontakte noen.",
      contactNote: "Opplysninger sendes eller lagres ikke i denne prototypen."
    },
    sv: {
      name: "DuneNest Semesterboenden",
      facts: {
        accommodation: "Den här fiktiva demon visar semesterhus och semesterlägenheter som exempel. Antal boenden, storlekar, kapacitet och utrustning är inga verkliga erbjudandeuppgifter.",
        checkin: "Som exempel i demon är ankomst från kl. 16.00. En riktig värd behöver bekräfta tiden.",
        checkout: "Som exempel i demon är avresa senast kl. 10.00. En riktig värd behöver bekräfta tiden.",
        dogs: "Regler för husdjur är inte fastställda i det här fiktiva exemplet. Fråga värden före bokning.",
        wifi: "I det fiktiva exemplet anges Wi-Fi som tillgängligt. En riktig uthyrare behöver bekräfta detta.",
        activities: "Demoprofilen bekräftar inga särskilda aktiviteter eller lokala rekommendationer."
      },
      bookingTypes: ["Välj", "Semesterhus", "Semesterlägenhet", "Lägenhet", "Flera boenden", "Inte bestämt"],
      fallbackReply: "Det framgår inte av demouppgifterna. Kontakta värden; den här prototypen kan inte vidarebefordra meddelanden.",
      unconfiguredReply: "Den här uppgiften finns ännu inte i demoprofilen.",
      contactMissing: "Demoprofilen innehåller inga kontaktuppgifter till värden. Den här demon kan inte kontakta någon.",
      contactNote: "Uppgifter skickas eller sparas inte i den här prototypen."
    }
  },
  contactChannels: { phone: null, email: null },
  fallbackReply: "Dazu liegen keine bestätigten Demo-Informationen vor. Bitte kontaktiere den Gastgeber; dieser Prototyp kann keine Nachricht weiterleiten.",
  unconfiguredReply: "Diese Information ist im fiktiven Demo-Profil nicht hinterlegt.",
  openItems: [
    "Objekttypen, Größe und Belegung",
    "An- und Abreise sowie Schlüsselübergabe",
    "Haustiere, WLAN, Parkplatz und Ausstattung",
    "Reinigung, Bettwäsche und Hausregeln",
    "Preise, Saisonzeiten und Stornobedingungen",
    "Gastgeberkontakt und Notfallhinweise"
  ],
  contactNote: "Kontaktangaben werden in diesem Prototyp nicht übertragen oder gespeichert."
});
