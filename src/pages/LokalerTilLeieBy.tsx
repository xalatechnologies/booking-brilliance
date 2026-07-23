import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { CheckCircle2, ArrowRight } from "lucide-react";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  SectionRule,
  EditorialHeading,
  EditorialButton,
  EditorialCard,
  SpecRow,
  ProgressRail,
  Byline,
} from "@/components/editorial";
import { getFraunces } from "@/lib/fonts";
import PilotInvitationSection from "@/components/PilotInvitationSection";
import NotFound from "./NotFound";
import { BYER, GUIDANCE } from "@/content/lokalerByer";

const UPDATED = "23. juli 2026";

const LokalerTilLeieBy = () => {
  const { by } = useParams<{ by: string }>();
  const data = by ? BYER[by.toLowerCase()] : undefined;
  if (!data) return <NotFound />;

  const faq = data.faq.map((f) => ({ question: f.question, answer: f.answer }));
  const url = `https://digilist.no/lokaler-til-leie/${data.slug}`;

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <SEO
        title={`Lokaler til leie i ${data.name} — finn og book ledig lokale | Digilist`}
        description={`Lokaler til leie i ${data.name}: finn ledige selskapslokaler, møterom, kulturhus og haller i sanntid. Sammenlign private og kommunale lokaler, se pris og kapasitet, og book direkte.`}
        keywords={`lokaler til leie ${data.name.toLowerCase()}, leie lokale ${data.name.toLowerCase()}, lokale til leie ${data.name.toLowerCase()}, selskapslokale ${data.name.toLowerCase()}, møterom ${data.name.toLowerCase()}`}
        canonical={url}
        ogImage="https://digilist.no/og-image.png"
        ogType="article"
        faq={faq}
        breadcrumbs={[
          { name: "Hjem", url: "https://digilist.no/" },
          { name: "Lokaler til leie", url: "https://digilist.no/lokaler-til-leie" },
          { name: `Lokaler til leie i ${data.name}`, url },
        ]}
        article={{
          headline: `Lokaler til leie i ${data.name}: finn, sammenlign og book`,
          description: `Praktisk guide til å leie lokaler i ${data.name}: bydeler og venue-landskap, kapasitet, pris, når du bør booke, og hvordan du booker på nett.`,
          datePublished: "2026-07-23",
          dateModified: "2026-07-23",
          author: "Ibrahim Rahmani",
          authorRole: "Grunnlegger, Digilist",
          articleSection: `Lokaler til leie i ${data.name}`,
          keywords: [`lokaler til leie ${data.name.toLowerCase()}`, `leie lokale ${data.name.toLowerCase()}`],
        }}
      />
      <ProgressRail />
      <Navbar />

      <main id="main">
        <section className="pt-28 lg:pt-32 pb-16 lg:pb-24 bg-paper">
          <div className="container mx-auto md:px-8 lg:px-12">
            <SectionRule label={`LOKALER TIL LEIE · ${data.name.toUpperCase()}`} />
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-gutter items-start">
              <div className="lg:col-span-8">
                <EditorialHeading as="h1" size="hero" className="mb-6">
                  Lokaler til leie{" "}
                  <em
                    className="italic"
                    style={{ fontVariationSettings: getFraunces("hero") }}
                  >
                    {data.inName}
                  </em>
                  .
                </EditorialHeading>
                <p className="text-xl text-ink-soft measure leading-relaxed mb-6">
                  {data.intro}
                </p>
                <Byline author="Ibrahim Rahmani" role="Grunnlegger, Digilist" date={`Sist oppdatert ${UPDATED}`} className="mb-10" />
                <div className="flex flex-col sm:flex-row gap-4">
                  <EditorialButton
                    variant="primary"
                    size="lg"
                    href="https://app.digilist.no"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Finn ledig lokale
                  </EditorialButton>
                  <EditorialButton variant="outline" size="lg" icon={false} href="/lokaler-til-leie">
                    Alle lokaler til leie
                  </EditorialButton>
                </div>
              </div>
              <div className="lg:col-span-4">
                <EditorialCard className="bg-accent-tinted">
                  <h2
                    className="font-serif text-2xl text-ink mb-4"
                    style={{ fontVariationSettings: getFraunces("section") }}
                  >
                    {data.name}
                  </h2>
                  <SpecRow label="Region" value={data.region} />
                  <SpecRow label="Marked" value="Privat · offentlig" />
                  <SpecRow label="Tilgjengelighet" value="Sanntid" />
                  <SpecRow label="Betaling" value="Vipps · kort" />
                </EditorialCard>
              </div>
            </div>
          </div>
        </section>

        <section className="py-14 lg:py-20 bg-paper-tinted border-y border-rule">
          <div className="container mx-auto md:px-8 lg:px-12">
            <SectionRule label={`I. LOKALER I ${data.name.toUpperCase()}`} />
            <div className="grid lg:grid-cols-12 gap-8">
              <div className="lg:col-span-7">
                <EditorialHeading as="h2" size="section" className="mb-6">
                  Venue-landskapet i{" "}
                  <em className="italic">{data.name}</em>.
                </EditorialHeading>
                <p className="text-lg text-ink-soft leading-relaxed measure">
                  {data.landscape}
                </p>
              </div>
              <div className="lg:col-span-5">
                <EditorialCard className="bg-paper">
                  <h3
                    className="font-serif text-xl text-ink mb-4"
                    style={{ fontVariationSettings: getFraunces("sub"), fontStyle: "normal" }}
                  >
                    Vanlige lokaler {data.inName}
                  </h3>
                  <ul className="space-y-3">
                    {data.local.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <CheckCircle2
                          className="h-5 w-5 mt-0.5 shrink-0 text-accent-text"
                          strokeWidth={1.5}
                          aria-hidden="true"
                        />
                        <span className="text-base text-ink-soft">{item}</span>
                      </li>
                    ))}
                  </ul>
                </EditorialCard>
              </div>
            </div>
          </div>
        </section>

        <section className="py-14 lg:py-20 bg-paper">
          <div className="container mx-auto md:px-8 lg:px-12">
            <SectionRule label="II. KAPASITET OG PRIS" />
            <EditorialHeading as="h2" size="section" className="mb-8">
              Hva slags lokale – og hva koster det?
            </EditorialHeading>
            <div className="overflow-x-auto border border-rule">
              <table className="w-full text-left border-collapse min-w-[520px]">
                <thead>
                  <tr className="bg-paper-tinted border-b border-rule">
                    <th className="p-4 editorial-mono-caption font-normal text-ink-soft">Lokaltype</th>
                    <th className="p-4 editorial-mono-caption font-normal text-ink-soft">Typisk kapasitet</th>
                    <th className="p-4 editorial-mono-caption font-normal text-ink-soft">Typisk prisintervall</th>
                  </tr>
                </thead>
                <tbody>
                  {GUIDANCE.map((g) => (
                    <tr key={g.type} className="border-b border-rule last:border-0">
                      <td className="p-4 text-base text-ink">{g.type}</td>
                      <td className="p-4 text-base text-ink-soft">{g.cap}</td>
                      <td className="p-4 text-base text-ink-soft">{g.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-6 text-sm text-ink-soft measure">
              Intervallene er en grov pekepinn – ikke et tilbud – og varierer med
              kapasitet, område, ukedag og sesong. Se alltid prisen på det enkelte
              lokalet på Digilist før du bekrefter bookingen.
            </p>
          </div>
        </section>

        <section className="py-14 lg:py-20 bg-paper-tinted border-y border-rule">
          <div className="container mx-auto md:px-8 lg:px-12">
            <SectionRule label={`III. SLIK PLANLEGGER DU ${data.name.toUpperCase()}`} />
            <div className="grid lg:grid-cols-12 gap-8">
              <div className="lg:col-span-6">
                <EditorialHeading as="h2" size="section" className="mb-6">
                  Lokale tips for{" "}
                  <em className="italic">{data.name}</em>.
                </EditorialHeading>
                <ul className="space-y-4">
                  {data.planning.map((p) => (
                    <li key={p} className="flex items-start gap-3">
                      <CheckCircle2
                        className="h-5 w-5 mt-0.5 shrink-0 text-accent-text"
                        strokeWidth={1.5}
                        aria-hidden="true"
                      />
                      <span className="text-base text-ink-soft leading-relaxed">{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="lg:col-span-6">
                <EditorialCard className="bg-paper h-full">
                  <h3
                    className="font-serif text-xl text-ink mb-3"
                    style={{ fontVariationSettings: getFraunces("sub"), fontStyle: "normal" }}
                  >
                    {data.example.title}
                  </h3>
                  <p className="text-base text-ink-soft leading-relaxed">
                    {data.example.body}
                  </p>
                </EditorialCard>
              </div>
            </div>
          </div>
        </section>

        <section className="py-14 lg:py-20 bg-paper">
          <div className="container mx-auto md:px-8 lg:px-12">
            <SectionRule label="IV. LOKALTYPER" />
            <EditorialHeading as="h2" size="section" className="mb-8">
              Utforsk lokaltyper.
            </EditorialHeading>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-rule border border-rule">
              {data.types.map((t) => (
                <Link
                  key={t.to}
                  to={t.to}
                  className="group bg-paper p-5 lg:p-6 flex items-center justify-between gap-3 hover:bg-accent-tinted transition-colors"
                >
                  <span className="text-base text-ink group-hover:text-accent-text">
                    {t.label}
                  </span>
                  <ArrowRight
                    className="h-4 w-4 shrink-0 text-ink-soft group-hover:text-accent-text group-hover:translate-x-0.5 transition-all"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                </Link>
              ))}
            </div>
          </div>
        </section>

        <PilotInvitationSection />

        <section className="py-14 lg:py-20 bg-paper">
          <div className="container mx-auto md:px-8 lg:px-12">
            <SectionRule label="V. SPØRSMÅL OG SVAR" />
            <EditorialHeading as="h2" size="section" className="mb-10">
              Vanlige spørsmål om lokaler til leie {data.inName}.
            </EditorialHeading>
            <dl className="space-y-8 max-w-4xl">
              {data.faq.map((q) => (
                <div key={q.question} className="border-b border-rule pb-8">
                  <dt
                    className="font-serif text-2xl text-ink mb-3"
                    style={{
                      fontVariationSettings: getFraunces("section"),
                      letterSpacing: "-0.015em",
                    }}
                  >
                    {q.question}
                  </dt>
                  <dd className="text-base text-ink-soft leading-relaxed measure">
                    {q.answer}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-10 editorial-mono-caption">
              Se{" "}
              <Link
                to="/lokaler-til-leie"
                className="text-accent-text hover:underline underline-offset-4 decoration-[0.5px]"
              >
                lokaler til leie i hele Norge
              </Link>{" "}
              eller er du utleier?{" "}
              <Link
                to="/bookingsystem-utleie"
                className="text-accent-text hover:underline underline-offset-4 decoration-[0.5px]"
              >
                bookingsystem for utleie
              </Link>
              .
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default LokalerTilLeieBy;
