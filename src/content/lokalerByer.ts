// Data for the geo landing pages under /lokaler-til-leie/:by.
// Each city carries real, substantive local context — the venue landscape, the
// districts, planning guidance and a worked example — so the page is genuinely
// useful, not a thin template with a swapped name. Add a city here + a prerender
// ROUTES entry to ship it. Never fabricate specific venue names, inventory counts
// or prices; speak to the category truthfully.

export interface ByFaq {
  question: string;
  answer: string;
}

export interface ByData {
  slug: string;
  name: string; // "Oslo"
  inName: string; // "i Oslo"
  region: string;
  intro: string;
  landscape: string;
  types: { label: string; to: string }[];
  local: string[];
  planning: string[];
  example: { title: string; body: string };
  faq: ByFaq[];
}

// Rough, honest price/capacity pointers shared across cities (varierer alltid).
export const GUIDANCE = [
  { type: "Selskapslokale / festlokale", cap: "30–150 gjester", price: "5 000–30 000 kr / dag" },
  { type: "Grendehus / foreningslokale", cap: "40–120 gjester", price: "1 000–5 000 kr / dag" },
  { type: "Møterom", cap: "4–20 personer", price: "300–2 500 kr / dag" },
  { type: "Konferanselokale", cap: "20–200 personer", price: "2 000–15 000 kr / dag" },
  { type: "Kulturhus / storsal", cap: "50–400 personer", price: "3 000–20 000 kr / arr." },
  { type: "Idrettshall", cap: "Lag / grupper", price: "200–1 500 kr / time" },
];

const SHARED_TYPES = [
  { label: "Selskapslokale", to: "/leie/selskapslokale" },
  { label: "Møterom", to: "/leie/moterom" },
  { label: "Konferanselokale", to: "/leie/konferanselokale" },
  { label: "Kulturhus", to: "/leie/kulturhus" },
  { label: "Idrettshall", to: "/leie/idrettshall" },
  { label: "Kontorlokaler", to: "/leie/kontorlokaler" },
];

export const BYER: Record<string, ByData> = {
  oslo: {
    slug: "oslo",
    name: "Oslo",
    inName: "i Oslo",
    region: "Oslo",
    intro:
      "Oslo har det største og mest varierte markedet for lokaler til leie i Norge – fra selskapslokaler og festlokaler til møterom, konferanselokaler, kulturhus og idrettshaller. På Digilist ser du ledige tider i sanntid og booker direkte, i stedet for å ringe rundt til lokaler på tvers av bydelene.",
    landscape:
      "Etterspørselen er høyest i sentrum og de sentrale bydelene som Grünerløkka, Frogner, St. Hanshaugen og Gamle Oslo, hvor du finner alt fra restaurantlokaler og selskapslokaler til møterom og kulturhus. Bydeler som Nordre Aker, Østensjø, Nordstrand og Alna har mange grendehus, bydelshus og kommunale lokaler som leies ut til private arrangementer, ofte til lavere pris enn sentrumslokalene. Kontor- og konferansemiljøet er sterkt rundt Skøyen, Nydalen og Kvadraturen.",
    types: SHARED_TYPES,
    local: [
      "Selskaps- og festlokaler til bryllup, jubileum og firmafest",
      "Møterom og konferanselokaler i sentrum, på Skøyen og i Nydalen",
      "Kulturhus, grendehus og bydelslokaler til private arrangementer",
      "Idrettshaller og gymsaler til trening, kamper og aktivitet",
      "Både private utleielokaler og kommunale lokaler i Oslo kommune",
    ],
    planning: [
      "Vær tidlig ute: i Oslo bookes populære festlokaler til lørdager i mai–september ofte 6–12 måneder i forveien.",
      "Sjekk kollektivdekning og parkering – i sentrale bydeler er offentlig transport ofte viktigere for gjestene enn parkeringsplasser.",
      "Vurder bydelene utenfor sentrum (Nordre Aker, Østensjø, Nordstrand) for grendehus og bydelshus til lavere pris.",
      "Book hverdager eller utenfor høysesong hvis du er fleksibel – da er både utvalget større og prisen lavere.",
    ],
    example: {
      title: "Eksempel: bryllup for 90 i Oslo",
      body: "Skal du arrangere bryllup for 90 gjester en lørdag i juni, bør du starte søket 9–12 måneder før. Filtrer på kapasitet fra 90, kjøkken og universell utforming, sammenlign selskapslokaler i sentrum mot rimeligere bydelshus lenger ut, og sjekk sanntidskalenderen for de aktuelle lørdagene før du bekrefter.",
    },
    faq: [
      {
        question: "Hvor finner jeg lokaler til leie i Oslo?",
        answer:
          "Du finner lokaler til leie i Oslo ved å søke på Digilist, der både private festlokaler, møterom og kulturhus og kommunale lokaler i Oslo kommune ligger samlet med ledige tider i sanntid. Du filtrerer på lokaltype, bydel og fasiliteter og booker den datoen du trenger direkte.",
      },
      {
        question: "Hvor tidlig bør jeg booke lokale i Oslo?",
        answer:
          "I Oslo er etterspørselen høy, og populære selskaps- og festlokaler til store arrangementer bookes ofte 6–12 måneder i forveien, særlig for lørdager i høysesongen. Møterom og mindre lokaler kan gjerne bookes med noen dagers eller ukers varsel. Med sanntidskalenderen ser du med én gang om datoen din er ledig.",
      },
      {
        question: "Kan jeg leie kommunale lokaler i Oslo til privat fest?",
        answer:
          "Ja. Mange grendehus, bydelshus og kulturhus i Oslo leies ut til private arrangementer som bryllup, konfirmasjon og bursdag. På Digilist ligger både private og kommunale lokaler i samme oversikt, slik at du kan sammenligne dem på ett sted.",
      },
      {
        question: "Hva koster det å leie lokale i Oslo?",
        answer:
          "Prisen varierer med lokaltype, kapasitet, bydel, ukedag og sesong. Grendehus og bydelshus ligger ofte lavere enn sentrale selskaps- og restaurantlokaler, og lørdager i høysesong koster mer enn hverdager. Se alltid prisen på det enkelte lokalet på Digilist før du booker.",
      },
    ],
  },
  bergen: {
    slug: "bergen",
    name: "Bergen",
    inName: "i Bergen",
    region: "Vestland",
    intro:
      "Bergen kombinerer historiske og moderne lokaler til leie – fra selskapslokaler og kulturhus til møterom og konferanselokaler for byens nærings- og universitetsmiljø. På Digilist ser du hva som er ledig i sanntid og booker direkte, uten en runde med e-post og telefon.",
    landscape:
      "Sentrum og Bryggen-området har et bredt utvalg av selskaps- og møtelokaler, ofte med karakter og historie, mens bydeler som Årstad, Bergenhus, Fana og Åsane har grendehus, kulturhus og kommunale lokaler som leies ut til private arrangementer. Som universitets- og konferanseby med UiB og NHH er det jevn etterspørsel etter møterom og konferanselokaler også på hverdager. Vær- og sesongforhold på Vestlandet gjør at innendørs lokaler er ekstra ettertraktet gjennom hele året.",
    types: SHARED_TYPES,
    local: [
      "Selskapslokaler og festlokaler til bryllup og feiring",
      "Møterom og konferanselokaler for nærings- og universitetsmiljøet",
      "Kulturhus og grendehus til private arrangementer",
      "Idrettshaller og gymsaler til trening og aktivitet",
      "Både private utleielokaler og kommunale lokaler i Bergen kommune",
    ],
    planning: [
      "Book tidlig for lørdager i høysesong – historiske sentrumslokaler er populære og fylles opp raskt.",
      "Vurder bydelene (Årstad, Fana, Åsane) for grendehus og kulturhus til lavere pris enn sentrum.",
      "Tenk på været: innendørs alternativer og god garderobe/inngang er verdt å sjekke på Vestlandet.",
      "Er arrangementet knyttet til UiB eller NHH, er det ekstra press på møte- og konferanselokaler i semesteret – vær tidlig ute.",
    ],
    example: {
      title: "Eksempel: konferanse for 60 i Bergen",
      body: "Skal du holde en dagskonferanse for 60 deltakere, filtrer på konferanselokale, kapasitet fra 60, AV-utstyr og sentral beliggenhet nær kollektivknutepunkt. Sammenlign sentrumslokaler mot rimeligere alternativer i bydelene, og book en ledig hverdag i sanntidskalenderen – hverdager er både billigere og lettere å få.",
    },
    faq: [
      {
        question: "Hvor finner jeg lokaler til leie i Bergen?",
        answer:
          "Du finner lokaler til leie i Bergen på Digilist, der private festlokaler, møterom, kulturhus og kommunale lokaler i Bergen kommune ligger samlet med ledige tider i sanntid. Du filtrerer på lokaltype, område og fasiliteter og booker direkte.",
      },
      {
        question: "Hva slags lokaler kan jeg leie i Bergen?",
        answer:
          "I Bergen kan du leie selskapslokaler og festlokaler, møterom og konferanselokaler, kulturhus og grendehus, samt idrettshaller. Både private og kommunale lokaler er samlet på Digilist, slik at du kan sammenligne dem på ett sted.",
      },
      {
        question: "Hvor tidlig bør jeg booke lokale i Bergen?",
        answer:
          "Populære selskaps- og festlokaler bookes ofte flere måneder i forveien, særlig for lørdager i høysesongen. Møterom og konferanselokaler kan ofte bookes med kortere varsel utenom semesterets travleste perioder. Med sanntidskalenderen ser du umiddelbart om datoen din er ledig.",
      },
      {
        question: "Kan jeg leie kommunale lokaler i Bergen til privat arrangement?",
        answer:
          "Ja. Mange grendehus, kulturhus og kommunale lokaler i Bergen kommune leies ut til private arrangementer. På Digilist ligger de sammen med private festlokaler, slik at du kan sammenligne pris og tilgjengelighet på ett sted.",
      },
    ],
  },
  trondheim: {
    slug: "trondheim",
    name: "Trondheim",
    inName: "i Trondheim",
    region: "Trøndelag",
    intro:
      "Trondheim har et aktivt marked for lokaler til leie, preget av studentbyen og teknologimiljøet rundt NTNU og SINTEF – fra selskapslokaler og kulturhus til møterom og konferanselokaler. På Digilist ser du ledige tider i sanntid og booker direkte.",
    landscape:
      "Midtbyen og områder som Bakklandet, Lade, Byåsen og Nardo har et bredt utvalg av selskaps- og møtelokaler, mens grendehus og kommunale lokaler i bydelene leies ut til private arrangementer. Som studie- og konferanseby med NTNU er det jevn etterspørsel etter møterom, konferanselokaler og idrettshaller gjennom hele semesteret, og studentrelaterte arrangementer preger enkelte perioder – som immatrikulering om høsten – med ekstra press på lokaler.",
    types: SHARED_TYPES,
    local: [
      "Selskapslokaler og festlokaler til bryllup, jubileum og fest",
      "Møterom og konferanselokaler for nærings- og studentmiljøet",
      "Kulturhus og grendehus til private arrangementer",
      "Idrettshaller og gymsaler til trening, kamper og aktivitet",
      "Både private utleielokaler og kommunale lokaler i Trondheim kommune",
    ],
    planning: [
      "Unngå de travleste studentperiodene (som semesterstart om høsten) hvis du kan – da er presset på lokaler størst.",
      "Midtbyen er sentral for gjester som kommer kollektivt; bydelene gir ofte mer plass og lavere pris.",
      "Book festlokaler til lørdager i høysesong i god tid – gjerne flere måneder før.",
      "Trenger du idrettshall eller gymsal, sjekk sanntidskalenderen for faste ledige tider gjennom uka.",
    ],
    example: {
      title: "Eksempel: firmafest for 50 i Trondheim",
      body: "Planlegger du en firmafest for 50 i Midtbyen, filtrer på selskapslokale, kapasitet fra 50, kjøkken/servering og sentral beliggenhet. Sammenlign sentrumslokaler mot rimeligere alternativer på Lade eller Byåsen, sjekk ledige fredager/lørdager i sanntidskalenderen, og legg til catering som tilleggstjeneste før du bekrefter.",
    },
    faq: [
      {
        question: "Hvor finner jeg lokaler til leie i Trondheim?",
        answer:
          "Du finner lokaler til leie i Trondheim på Digilist, der private festlokaler, møterom, kulturhus og kommunale lokaler i Trondheim kommune ligger samlet med ledige tider i sanntid. Du filtrerer på lokaltype, område og fasiliteter og booker direkte.",
      },
      {
        question: "Kan jeg leie idrettshall eller gymsal i Trondheim?",
        answer:
          "Ja. Idrettshaller og gymsaler i Trondheim kan leies til trening, kamper og arrangementer. På Digilist ser du ledige tider i sanntid og booker den tiden du trenger, uten å vente på svar per e-post.",
      },
      {
        question: "Hvor tidlig bør jeg booke lokale i Trondheim?",
        answer:
          "Populære selskaps- og festlokaler bookes ofte flere måneder i forveien, særlig lørdager i høysesongen. I studentrelaterte topperioder er presset ekstra stort. Sanntidskalenderen viser umiddelbart om datoen din er ledig.",
      },
      {
        question: "Hva koster det å leie lokale i Trondheim?",
        answer:
          "Prisen varierer med lokaltype, kapasitet, område, ukedag og sesong. Grendehus og lokaler i bydelene ligger ofte lavere enn sentrale selskapslokaler i Midtbyen. Se alltid prisen på det enkelte lokalet på Digilist før du booker.",
      },
    ],
  },
};

export const BY_SLUGS = Object.keys(BYER);
