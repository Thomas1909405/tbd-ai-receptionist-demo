/* Leeres, austauschbares Profil als Startpunkt für einen weiteren Betrieb. */
window.TBD_PROFILES = window.TBD_PROFILES || [];
window.TBD_PROFILES.push({
  id: "neuer-betrieb-musterprofil",
  name: "Neuer Campingplatz · Musterprofil",
  fictional: true,
  facts: {},
  locales: {
    da: {
      name: "Ny campingplads · profilskabelon",
      facts: {},
      fallbackReply: "Denne campingplads har endnu ikke lagt denne oplysning ind. Spørg venligst en medarbejder på pladsen; jeg vil ikke gætte. Denne demo videresender ikke spørgsmålet.",
      unconfiguredReply: "Denne oplysning er endnu ikke lagt ind for denne campingplads.",
      contactMissing: "Der er endnu ikke lagt kontaktoplysninger ind. Hvis du er på pladsen, kan du spørge en medarbejder.",
      contactNote: "Kontaktoplysninger bliver ikke sendt eller gemt i denne prototype."
    },
    en: {
      name: "New campsite · profile template",
      facts: {},
      fallbackReply: "This campsite has not provided that information yet. Please ask a member of staff on site; I don’t want to guess. This demo does not forward questions.",
      unconfiguredReply: "This information has not been added for this campsite yet.",
      contactMissing: "Contact details have not been added yet. If you are on site, please ask a member of staff.",
      contactNote: "Contact details are not sent or stored by this prototype."
    }
  },
  contactChannels: { phone: null, email: null },
  fallbackReply: "Dazu gibt es für diesen Platz noch keine hinterlegte Information. Bitte frag einen Kollegen vor Ort; ich möchte nichts erfinden. Diese Demo leitet die Frage nicht weiter.",
  openItems: [
    "Name und Standort",
    "Stellplatzarten und Ausstattung",
    "Unterkünfte und Belegung",
    "Check-in und Check-out",
    "Haustiere, WLAN, Strom und Sanitär",
    "Spontane Anreise und Verfügbarkeiten",
    "Saison, Schulferien und Aktivitäten",
    "Kontaktdaten der Rezeption"
  ],
  unconfiguredReply: "Diese Information ist für diesen Betrieb noch nicht hinterlegt.",
  contactNote: "Kontaktangaben werden in diesem Prototyp nicht übertragen oder gespeichert."
});
