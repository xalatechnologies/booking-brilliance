import UseCasePage from "@/components/UseCasePage";

export default function LeieHall() {
  return (
    <UseCasePage
      basePath="/leie"
      parentCrumb={{ name: "Leie", path: "/leie" }}
      sectionLabel="LEIE"
      slug="hall"
      breadcrumb="Hall"
      title="Leie hall"
      dek="Idrettshall, gymsal, aktivitetshall eller festhall. Se ledige haller nær deg, og book og betal direkte på nett."
      lead="Du kan leie hall på nett gjennom Digilist, både private og kommunale haller i samme kalender. Enten du trenger en idrettshall til trening og turnering, en gymsal til bursdag, en aktivitetshall til en samling eller en forsamlings- og festhall til et arrangement, ser du ledige tider i sanntid, med pris og regler synlig, og booker og betaler direkte med Vipps. I dag går veien til en ledig hall ofte via servicetorget eller en e-post med svartid på dager. Med sanntidskalenderen ser du selv hva som er ledig, og slipper søknad og venting for de timene som kan bookes direkte."
      seoTitle="Leie hall: finn og book ledig hall nær deg | Digilist"
      seoDescription="Leie hall på nett: idrettshall, gymsal, aktivitetshall og festhall. Se ledige haller i sanntid, book direkte og betal med Vipps. Både private og kommunale haller."
      keywords="leie hall, leie av hall, leie idrettshall, leie gymsal, leie aktivitetshall, leie festhall, leie forsamlingshus, booke hall, ledig hall, leie hall til arrangement"
      audience={[
        {
          persona: "Grupper som vil trene eller spille",
          context: "En gjeng som vil spille fotball, håndball eller badminton en kveld, uten å være klubb eller søke om fast treningstid. Ledige enkelttimer, booket direkte.",
        },
        {
          persona: "Foreldre og arrangører av bursdag og samling",
          context: "En gymsal eller aktivitetshall med plass til å løpe og leke er ofte det beste stedet for barnebursdag, klassefest eller familiesamling.",
        },
        {
          persona: "Lag og foreninger med ekstrabehov",
          context: "En ekstra økt før cup, et arrangement en helg, eller en hall når den faste tiden ikke strekker til, booket utenom sesongtildelingen.",
        },
        {
          persona: "Arrangører av turnering, messe eller storsamling",
          context: "Full hallflate til minicup, aktivitetsdag, loppemarked eller konsert, med tydelig kapasitet, utstyr og totalpris før du bekrefter.",
        },
      ]}
      problems={[
        "Ledige haller er usynlige: kalenderen ligger internt hos kommunen eller utleier, og du må ringe eller sende e-post for å høre hva som er ledig.",
        "Booking går via servicetorg eller skjema, med svartid på dager i stedet for minutter.",
        "Prisen er uklar: timepris, hel eller halv flate og eventuelle tillegg får du først vite når noen svarer.",
        "Betaling skjer med faktura i etterkant eller bankoverføring, uten kvittering i det du booker.",
        "Regler om utstyr, garderober, innesko og rydding kommer som overraskelser i stedet for å stå tydelig på forhånd.",
      ]}
      features={[
        {
          title: "Ledige haller i sanntid",
          body: "Kalenderen viser hvilke haller og hvilke timer som faktisk er ledige, kvelder, helger og hull i timeplanen. Du booker direkte og får bekreftelsen med en gang.",
        },
        {
          title: "Alle halltyper, ett søk",
          body: "Idrettshaller, gymsaler, aktivitetshaller, svømmehaller og forsamlings- og festhaller samlet på ett sted. Du slipper å vite hvem som eier hallen for å finne den.",
        },
        {
          title: "Book uten søknad",
          body: "Ledige enkelttimer bookes direkte, uten søknadsskjema og uten å vente på saksbehandling. Faste treningstider gjennom sesongen fordeles fortsatt i egen prosess.",
        },
        {
          title: "Pris synlig først",
          body: "Timeprisen for hel eller halv flate står på hallen, og totalprisen vises før du bekrefter. Ingen faktura med overraskelser i etterkant.",
        },
        {
          title: "Betal med Vipps",
          body: "Betal med Vipps eller kort i samme flyt som bookingen, og få kvittering med en gang. Ingen bankoverføring og ingen faktura å vente på.",
        },
        {
          title: "Private og kommunale haller samlet",
          body: "Både private utleiehaller og kommunale idretts- og aktivitetshaller ligger i samme kalender, slik at du kan sammenligne tilgjengelighet og pris på ett sted.",
        },
      ]}
      stories={[
        {
          customer: "Eksempel: aktivitetsgruppe i nabolaget",
          role: "Illustrasjon",
          headline: "Fra telefonrunde til booket hall på sekunder",
          body: "Slik kan det se ut: I stedet for å ringe servicetorget og vente på svar, søker gruppen på haller i nærheten, ser at aktivitetshallen er ledig lørdag formiddag, og booker med Vipps. Prisen og reglene sto tydelig før de bekreftet.",
          outcome: [
            { label: "Steder å ringe", value: "0" },
            { label: "Ledige haller", value: "Synlig i sanntid" },
            { label: "Bekreftelse", value: "Med en gang" },
          ],
        },
      ]}
      technical={[
        { label: "Halltyper", value: "Idretts-, gym-, aktivitets-, svømme- og festhall" },
        { label: "Marked", value: "Private og kommunale haller" },
        { label: "Betaling", value: "Vipps og kort, kvittering med en gang" },
        { label: "Kalender", value: "Sanntid, ledige enkelttimer" },
      ]}
      faq={[
        {
          question: "Hvor kan jeg leie en hall?",
          answer: "Du kan leie hall på nett gjennom bookingplattformer med sanntidskalender. På Digilist ser du ledige idrettshaller, gymsaler, aktivitetshaller og festhaller nær deg, både private og kommunale, og booker og betaler direkte uten en runde med telefoner og e-post.",
        },
        {
          question: "Kan jeg leie idrettshall eller gymsal til et privat arrangement?",
          answer: "Ja. Ledige enkelttimer i idrettshaller og gymsaler kan bookes av privatpersoner og grupper til trening, bursdag, turnering eller annen aktivitet. Du trenger ikke være klubb eller forening, og du trenger ikke søke for de timene som er ledige utenom sesongtildelingen.",
        },
        {
          question: "Hva koster det å leie en hall?",
          answer: "Prisen settes av kommunen eller utleier og varierer med halltype, om du leier hel eller halv flate, og tidspunkt. En gymsal koster gjerne mindre enn full flate i en stor idrettshall, og helger i høysesong mer enn hverdager. På Digilist står timeprisen på hver hall før du bekrefter.",
        },
        {
          question: "Hvordan booker jeg en ledig hall på nett?",
          answer: "Søk på sted og tidspunkt, se hvilke haller som er ledige i sanntid, velg en time og betal med Vipps eller kort. Bekreftelsen kommer med en gang, og du slipper å lage konto hos hver enkelt hall eller kommune.",
        },
      ]}
      siblings={[
        { title: "Leie idrettshall", slug: "idrettshall" },
        { title: "Leie svømmehall", slug: "svommehall" },
        { title: "Leie selskapslokale", slug: "selskapslokale" },
        { title: "Leie kulturhus", slug: "kulturhus" },
        { title: "Leie padelbane", slug: "padelbane" },
      ]}
      relatedPosts={[
        {
          title: "Book en ledig hall på 90 sekunder",
          slug: "booking-paa-90-sekunder-innbygger",
        },
      ]}
    />
  );
}
