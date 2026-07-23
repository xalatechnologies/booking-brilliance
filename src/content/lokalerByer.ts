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
  stavanger: {
    slug: "stavanger",
    name: "Stavanger",
    inName: "i Stavanger",
    region: "Rogaland",
    intro:
      "Stavanger og Nord-Jæren har et variert marked for lokaler til leie – fra selskapslokaler og konferanselokaler til møterom, kulturhus og idrettshaller. Energinæringen gjør konferanse- og møtemarkedet stort, samtidig som det finnes mange grendehus og bydelslokaler til private arrangementer. På Digilist ser du ledige tider i sanntid og booker direkte.",
    landscape:
      "I sentrum og Gamle Stavanger ligger mange selskaps- og restaurantlokaler, mens bydeler som Storhaug, Hillevåg, Eiganes og Madla har grendehus og foreningslokaler som ofte leies ut rimeligere. Konferanse- og møtemarkedet er sterkt knyttet til energinæringen og Forus-området mellom Stavanger og Sandnes. Nabokommunene Sandnes, Sola og Randaberg utvider tilbudet ytterligere.",
    types: SHARED_TYPES,
    local: [
      "Selskaps- og festlokaler til bryllup, jubileum og konfirmasjon",
      "Konferanse- og møtelokaler, sterkt preget av energinæringen på Forus",
      "Grendehus og bydelslokaler i Storhaug, Hillevåg og Madla",
      "Kulturhus og storsaler til større arrangementer",
      "Både private utleielokaler og kommunale lokaler i Stavanger kommune",
    ],
    planning: [
      "Konkurransen om konferanselokaler er størst når energinæringen har arrangementer – vær tidlig ute i vår- og høstsesongen.",
      "Se på grendehus i bydelene og i nabokommunene Sandnes og Sola for rimeligere private arrangementer.",
      "Stavanger er en bilby med spredt bebyggelse – sjekk parkering og adkomst for gjestene.",
      "Book hverdager eller utenom høysesong for større utvalg og lavere pris.",
    ],
    example: {
      title: "Eksempel: konfirmasjon for 60 i Stavanger",
      body: "Skal du feire konfirmasjon for 60 gjester en lørdag i mai, er du i høysesong – start søket flere måneder før. Filtrer på kapasitet fra 60 og kjøkken, sammenlign selskapslokaler i sentrum mot grendehus i bydelene eller i Sandnes, og sjekk sanntidskalenderen for de aktuelle lørdagene før du bekrefter.",
    },
    faq: [
      { question: "Hvor finner jeg lokaler til leie i Stavanger?", answer: "Du finner lokaler til leie i Stavanger på Digilist, der private selskapslokaler, møterom, konferanselokaler, kulturhus og kommunale lokaler i Stavanger kommune ligger samlet med ledige tider i sanntid. Du filtrerer på lokaltype, område og fasiliteter og booker direkte." },
      { question: "Hva slags lokaler kan jeg leie i Stavanger?", answer: "I Stavanger-området kan du leie selskaps- og festlokaler, møterom og konferanselokaler (mange knyttet til energinæringen på Forus), kulturhus, grendehus og idrettshaller. Både private og kommunale lokaler er samlet på Digilist." },
      { question: "Hvor tidlig bør jeg booke lokale i Stavanger?", answer: "Populære selskapslokaler og konferanselokaler bookes ofte flere måneder i forveien, særlig i vår- og høstsesongen når energinæringen har mange arrangementer. Møterom og mindre lokaler kan bookes med kortere varsel." },
      { question: "Hva koster det å leie lokale i Stavanger?", answer: "Prisen varierer med lokaltype, kapasitet, område, ukedag og sesong. Grendehus og lokaler i bydelene og nabokommunene ligger ofte lavere enn sentrale selskaps- og konferanselokaler. Se alltid prisen på det enkelte lokalet på Digilist før du booker." },
    ],
  },
  kristiansand: {
    slug: "kristiansand",
    name: "Kristiansand",
    inName: "i Kristiansand",
    region: "Agder",
    intro:
      "Kristiansand er Sørlandets største by og har et bredt tilbud av lokaler til leie – selskapslokaler, møterom, konferanselokaler, kulturhus og idrettshaller. Som sommerby får byen ekstra press på lokaler i høysesongen. På Digilist ser du ledige tider i sanntid og booker direkte, i stedet for å ringe rundt.",
    landscape:
      "Den rutenettformede bykjernen Kvadraturen samler mange sentrale selskaps- og møtelokaler, mens bydeler som Lund, Grim og Vågsbygd har grendehus og foreningslokaler som ofte leies ut rimeligere. Handels- og konferansetilbudet strekker seg mot Sørlandsparken øst for byen. Sommeren er høysesong på Sørlandet, og etterspørselen etter lokaler til fester og arrangementer er da størst.",
    types: SHARED_TYPES,
    local: [
      "Selskaps- og festlokaler til bryllup, jubileum og konfirmasjon i Kvadraturen",
      "Grendehus og foreningslokaler i Lund, Grim og Vågsbygd",
      "Møte- og konferanselokaler i sentrum og mot Sørlandsparken",
      "Kulturhus og storsaler til større arrangementer",
      "Både private utleielokaler og kommunale lokaler i Kristiansand kommune",
    ],
    planning: [
      "Sommeren er høysesong på Sørlandet – book festlokaler til juni–august i god tid, gjerne flere måneder før.",
      "Kvadraturen er sentral og gåvennlig, men sjekk parkering for tilreisende gjester.",
      "Vurder grendehus i bydelene for rimeligere private arrangementer utenom sentrum.",
      "Book hverdager eller utenom sommersesongen for større utvalg og lavere pris.",
    ],
    example: {
      title: "Eksempel: bryllup for 80 i Kristiansand",
      body: "Skal du gifte deg for 80 gjester en lørdag i juli, er du midt i Sørlandets høysesong – start søket 9–12 måneder før. Filtrer på kapasitet fra 80, kjøkken og universell utforming, sammenlign selskapslokaler i Kvadraturen mot grendehus i Lund eller Vågsbygd, og sjekk sanntidskalenderen før du bekrefter.",
    },
    faq: [
      { question: "Hvor finner jeg lokaler til leie i Kristiansand?", answer: "Du finner lokaler til leie i Kristiansand på Digilist, der private selskapslokaler, møterom, kulturhus og kommunale lokaler i Kristiansand kommune ligger samlet med ledige tider i sanntid. Du filtrerer på lokaltype, område og fasiliteter og booker direkte." },
      { question: "Hva slags lokaler kan jeg leie i Kristiansand?", answer: "I Kristiansand kan du leie selskaps- og festlokaler, møterom og konferanselokaler, kulturhus, grendehus og idrettshaller. Både private og kommunale lokaler er samlet på Digilist, slik at du kan sammenligne dem ett sted." },
      { question: "Hvor tidlig bør jeg booke lokale i Kristiansand?", answer: "Sommeren er høysesong på Sørlandet, og populære festlokaler til juni–august bookes ofte flere måneder i forveien. Møterom og lokaler utenom sommersesongen kan bookes med kortere varsel. Sanntidskalenderen viser umiddelbart om datoen din er ledig." },
      { question: "Hva koster det å leie lokale i Kristiansand?", answer: "Prisen varierer med lokaltype, kapasitet, område, ukedag og sesong. Grendehus i bydelene ligger ofte lavere enn sentrale selskapslokaler i Kvadraturen, og sommeren er dyrere enn resten av året. Se alltid prisen på det enkelte lokalet før du booker." },
    ],
  },
  tromso: {
    slug: "tromso",
    name: "Tromsø",
    inName: "i Tromsø",
    region: "Troms",
    intro:
      "Tromsø er Nord-Norges største by og har et voksende marked for lokaler til leie – selskapslokaler, møterom, konferanselokaler, kulturhus og idrettshaller. Nordlys- og midnattssolsesongene gir byen egne topper i etterspørselen etter arrangementslokaler. På Digilist ser du ledige tider i sanntid og booker direkte.",
    landscape:
      "De fleste sentrale lokalene ligger på Tromsøya, i og rundt sentrum, mens bydeler som Kvaløysletta og Kroken har grendehus og foreningslokaler som ofte leies ut rimeligere. Universitetsmiljøet ved UiT preger konferanse- og møtemarkedet. Tilbudet er mindre enn i de største byene lenger sør, så det lønner seg å være tidlig ute – særlig i nordlyssesongen om vinteren og rundt midnattssol om sommeren.",
    types: SHARED_TYPES,
    local: [
      "Selskaps- og festlokaler til bryllup, jubileum og konfirmasjon i sentrum",
      "Møte- og konferanselokaler, mange knyttet til universitetsmiljøet ved UiT",
      "Grendehus og foreningslokaler på Kvaløysletta og i Kroken",
      "Kulturhus og storsaler til større arrangementer",
      "Både private utleielokaler og kommunale lokaler i Tromsø kommune",
    ],
    planning: [
      "Tilbudet er mindre enn i sørlige storbyer – book i god tid, særlig i nordlyssesongen (vinter) og rundt midnattssol (sommer).",
      "Ta høyde for vær og vintertransport når du velger lokale og planlegger adkomst for gjestene.",
      "Vurder grendehus på Kvaløysletta eller i Kroken for rimeligere private arrangementer.",
      "Book hverdager eller utenom de travleste sesongene for større utvalg og lavere pris.",
    ],
    example: {
      title: "Eksempel: firmasamling for 40 i Tromsø",
      body: "Skal du arrangere en firmasamling for 40 personer i nordlyssesongen, bør du booke tidlig – tilbudet er mindre og etterspørselen høy. Filtrer på kapasitet fra 40, møteromsutstyr og sentral beliggenhet på Tromsøya, sjekk adkomst og parkering for vinterforhold, og bekreft datoen i sanntidskalenderen.",
    },
    faq: [
      { question: "Hvor finner jeg lokaler til leie i Tromsø?", answer: "Du finner lokaler til leie i Tromsø på Digilist, der private selskapslokaler, møterom, konferanselokaler, kulturhus og kommunale lokaler i Tromsø kommune ligger samlet med ledige tider i sanntid. Du filtrerer på lokaltype, område og fasiliteter og booker direkte." },
      { question: "Hva slags lokaler kan jeg leie i Tromsø?", answer: "I Tromsø kan du leie selskaps- og festlokaler, møterom og konferanselokaler (mange knyttet til UiT-miljøet), kulturhus, grendehus og idrettshaller. Både private og kommunale lokaler er samlet på Digilist." },
      { question: "Hvor tidlig bør jeg booke lokale i Tromsø?", answer: "Tilbudet er mindre enn i de største byene lenger sør, så det lønner seg å være tidlig ute – særlig i nordlyssesongen om vinteren og rundt midnattssol om sommeren. Sanntidskalenderen viser umiddelbart om datoen din er ledig." },
      { question: "Hva koster det å leie lokale i Tromsø?", answer: "Prisen varierer med lokaltype, kapasitet, område, ukedag og sesong. Grendehus i bydelene ligger ofte lavere enn sentrale selskapslokaler, og de travleste sesongene er dyrere. Se alltid prisen på det enkelte lokalet på Digilist før du booker." },
    ],
  },
  drammen: {
    slug: "drammen",
    name: "Drammen",
    inName: "i Drammen",
    region: "Buskerud",
    intro:
      "Drammen er en elveby med et variert tilbud av lokaler til leie – selskapslokaler, møterom, konferanselokaler, kulturhus og idrettshaller. Nær beliggenhet til Oslo gjør byen til et rimeligere alternativ for arrangementer i Oslo-regionen. På Digilist ser du ledige tider i sanntid og booker direkte.",
    landscape:
      "Byen er delt av Drammenselva i de to historiske bysidene Bragernes på nordsiden og Strømsø på sørsiden, som samler de fleste sentrale lokalene. Bydeler som Åssiden og Gulskogen har grendehus og foreningslokaler som ofte leies ut rimeligere. Drammen har de siste årene fornyet elvefronten og kulturtilbudet, og med rundt en halvtimes reisevei til Oslo er byen et rimeligere valg for mange arrangementer i hovedstadsområdet.",
    types: SHARED_TYPES,
    local: [
      "Selskaps- og festlokaler til bryllup, jubileum og konfirmasjon på Bragernes og Strømsø",
      "Møte- og konferanselokaler sentralt, som rimeligere alternativ til Oslo",
      "Grendehus og foreningslokaler i Åssiden og Gulskogen",
      "Kulturhus og storsaler til større arrangementer",
      "Både private utleielokaler og kommunale lokaler i Drammen kommune",
    ],
    planning: [
      "Drammen ligger rundt en halvtime fra Oslo – et rimeligere alternativ for arrangementer i Oslo-regionen.",
      "De to bysidene Bragernes og Strømsø samler de sentrale lokalene, med god kollektivdekning via Drammen stasjon.",
      "Vurder grendehus i Åssiden eller Gulskogen for rimeligere private arrangementer.",
      "Book hverdager eller utenom høysesong for større utvalg og lavere pris.",
    ],
    example: {
      title: "Eksempel: jubileum for 70 i Drammen",
      body: "Skal du feire et rundt jubileum for 70 gjester og vil holde kostnaden nede sammenlignet med Oslo, er Drammen et godt valg. Filtrer på kapasitet fra 70 og kjøkken, sammenlign selskapslokaler på Bragernes og Strømsø mot grendehus i Åssiden, og sjekk sanntidskalenderen for datoen før du bekrefter.",
    },
    faq: [
      { question: "Hvor finner jeg lokaler til leie i Drammen?", answer: "Du finner lokaler til leie i Drammen på Digilist, der private selskapslokaler, møterom, kulturhus og kommunale lokaler i Drammen kommune ligger samlet med ledige tider i sanntid. Du filtrerer på lokaltype, byside og fasiliteter og booker direkte." },
      { question: "Er Drammen et rimeligere alternativ til Oslo?", answer: "For mange arrangementer, ja. Drammen ligger rundt en halvtime fra Oslo med god kollektivdekning, og lokaler her er ofte rimeligere enn tilsvarende i Oslo sentrum. På Digilist kan du sammenligne pris og tilgjengelighet før du booker." },
      { question: "Hvor tidlig bør jeg booke lokale i Drammen?", answer: "Populære selskaps- og festlokaler bookes ofte flere måneder i forveien, særlig lørdager i høysesongen. Møterom og mindre lokaler kan bookes med kortere varsel. Sanntidskalenderen viser umiddelbart om datoen din er ledig." },
      { question: "Hva koster det å leie lokale i Drammen?", answer: "Prisen varierer med lokaltype, kapasitet, område, ukedag og sesong, men ligger ofte lavere enn i Oslo. Grendehus i bydelene er som regel rimeligere enn sentrale selskapslokaler. Se alltid prisen på det enkelte lokalet før du booker." },
    ],
  },
  baerum: {
    slug: "baerum",
    name: "Bærum",
    inName: "i Bærum",
    region: "Akershus",
    intro:
      "Bærum vest for Oslo har et bredt tilbud av lokaler til leie – fra konferanse- og møtelokaler i næringsområdene til selskapslokaler, grendehus og idrettshaller. Nærheten til Oslo og et sterkt næringsliv gjør bedrifts- og konferansemarkedet stort. På Digilist ser du ledige tider i sanntid og booker direkte.",
    landscape:
      "Sandvika er kommunesenteret og samler mange sentrale lokaler, mens Fornebu og Lysaker er sterke nærings- og konferanseområder med møte- og selskapslokaler rettet mot bedrifter. Områder som Bekkestua, Stabekk og Høvik har velhus, grendehus og foreningslokaler som leies ut til private arrangementer. Med kort vei til Oslo er Bærum aktuelt både for hovedstadsnære bedriftsarrangementer og lokale familiefeiringer.",
    types: SHARED_TYPES,
    local: [
      "Konferanse- og møtelokaler på Fornebu og Lysaker rettet mot bedrifter",
      "Selskaps- og festlokaler til bryllup, jubileum og konfirmasjon i Sandvika-området",
      "Velhus, grendehus og foreningslokaler i Bekkestua, Stabekk og Høvik",
      "Kulturhus og storsaler til større arrangementer",
      "Både private utleielokaler og kommunale lokaler i Bærum kommune",
    ],
    planning: [
      "For bedriftsarrangementer er Fornebu og Lysaker sterke områder med god møteroms- og konferansekapasitet.",
      "For private feiringer er velhus og grendehus i boligområdene ofte rimeligere enn sentrale selskapslokaler.",
      "Bærum har kort vei til Oslo og god kollektivdekning – praktisk for gjester fra hovedstadsområdet.",
      "Book hverdager eller utenom høysesong for større utvalg og lavere pris.",
    ],
    example: {
      title: "Eksempel: bedriftsseminar for 50 i Bærum",
      body: "Skal du arrangere et bedriftsseminar for 50 personer, er Fornebu eller Lysaker naturlige valg med god konferansekapasitet og enkel adkomst fra Oslo. Filtrer på kapasitet fra 50, møteromsutstyr og parkering, sammenlign de aktuelle lokalene, og bekreft datoen i sanntidskalenderen før du booker.",
    },
    faq: [
      { question: "Hvor finner jeg lokaler til leie i Bærum?", answer: "Du finner lokaler til leie i Bærum på Digilist, der private selskaps- og konferanselokaler, møterom, velhus og kommunale lokaler i Bærum kommune ligger samlet med ledige tider i sanntid. Du filtrerer på lokaltype, område og fasiliteter og booker direkte." },
      { question: "Hvor egner Bærum seg for bedriftsarrangementer?", answer: "Fornebu og Lysaker er sterke nærings- og konferanseområder med møte- og selskapslokaler rettet mot bedrifter, og med enkel adkomst fra Oslo. På Digilist ser du ledige tider og booker konferanselokalet direkte." },
      { question: "Kan jeg leie grendehus eller velhus i Bærum til privat fest?", answer: "Ja. Velhus, grendehus og foreningslokaler i boligområder som Bekkestua, Stabekk og Høvik leies ut til private arrangementer, ofte rimeligere enn sentrale selskapslokaler. På Digilist ligger de sammen med private lokaler." },
      { question: "Hva koster det å leie lokale i Bærum?", answer: "Prisen varierer med lokaltype, kapasitet, område, ukedag og sesong. Velhus og grendehus i boligområdene ligger ofte lavere enn konferanse- og selskapslokaler på Fornebu og i Sandvika. Se alltid prisen på det enkelte lokalet før du booker." },
    ],
  },
};

export const BY_SLUGS = Object.keys(BYER);
