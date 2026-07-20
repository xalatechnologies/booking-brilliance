import { motion } from "framer-motion";
import {
  SectionRule,
  EditorialHeading,
  StoryCard,
  EditorialButton,
} from "@/components/editorial";
import { staggerParent, staggerChild, viewportOnce } from "@/lib/motion";
import { getFraunces } from "@/lib/fonts";

const BrukerhistorierSection = () => {
  return (
    <section
      id="brukerhistorier"
      className="py-14 lg:py-20 bg-paper"
    >
      <div className="container mx-auto md:px-8 lg:px-12">
        <SectionRule label="BRUKERHISTORIER" />

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-gutter mb-10 lg:mb-14">
          <div className="lg:col-span-7">
            <EditorialHeading as="h2" size="section">
              Hvem bruker{" "}
              <em
                className="italic"
                style={{
                  fontVariationSettings: '"opsz" 96, "wght" 400, "SOFT" 30, "WONK" 0',
                }}
              >
                Digilist?
              </em>
            </EditorialHeading>
          </div>
          <div className="lg:col-span-5 flex items-end">
            <p
              className="text-xl text-ink-soft italic"
              style={{ fontVariationSettings: getFraunces("sub") }}
            >
              Hverdagshistorier fra norske utleiere. Bookinger, automatisering og
              regnskap, sammenhengende.
            </p>
          </div>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerParent}
          className="grid lg:grid-cols-2 gap-6 lg:gap-8"
        >
          <motion.div variants={staggerChild}>
            <StoryCard
              meta={["Kunde", "Selskapslokale", "Live 2025"]}
              customer="Rønningen Selskapslokale"
              logoSrc="/clients/ronning.png"
              headline="Fra excelark til kalenderautomatikk."
              dek="Privat selskapslokale i Asker som leier ut til selskaper, bryllup og jubileer."
              body={
                <>
                  <p>
                    Som eier av et selskapslokale ønsket Rønningen å slutte å holde
                    styr på bookinger i regneark. Med Digilist får gjestene en lenke
                    der de selv ser ledige helger, betaler depositum og signerer
                    leieavtalen digitalt.
                  </p>
                </>
              }
              quote={{
                text:
                  "Vi har eliminert dobbeltbookinger og fått automatisk faktura. Hver booking går fra forespørsel til betalt på under fem minutter.",
                byline: "Eier",
                role: "Rønningen Selskapslokale",
              }}
              stats={[
                { label: "Reduserte adm.-tid", value: "−65 %" },
                { label: "Bookinger fra mobil", value: "+82 %" },
                { label: "Dobbeltbookinger", value: "0" },
              ]}
              cta={
                <EditorialButton
                  variant="link"
                  size="md"
                  href="#kontakt"
                  onClick={(e) => {
                    e.preventDefault();
                    const el = document.getElementById("kontakt");
                    if (el)
                      el.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                >
                  Be om referanse
                </EditorialButton>
              }
            />
          </motion.div>

          <motion.div variants={staggerChild}>
            <StoryCard
              meta={["Kunde", "Kommune", "Live 2024"]}
              customer="Nordre Follo kommune"
              logoSrc="/clients/nordre-follo.svg"
              headline="Én plattform for haller, møterom og kantiner."
              dek="Kommunal kulturetat med tolv anlegg, ca. 340 lag og foreninger og 1 200 bookinger i måneden."
              body={
                <>
                  <p>
                    Kulturkonsulenten håndterer sesongleie til lag og foreninger,
                    privatbookinger og sambruk mellom kantiner og møterom. Driftsroller
                    (vaktmestere, renhold, vektere) varsles automatisk ved
                    bookingbekreftelse. Tilskudd til lag og foreninger fordeles via
                    sesongleie-modulen.
                  </p>
                </>
              }
              quote={{
                text:
                  "Vi har samlet tolv anlegg, hundrevis av foreninger og kommunal fakturering i én plattform, og innbyggerne booker via ID-porten.",
                byline: "Kulturkonsulent",
                role: "Nordre Follo kommune",
              }}
              stats={[
                { label: "Anlegg i drift", value: "12" },
                { label: "Aktive lag/foreninger", value: "~340" },
                { label: "Bookinger / måned", value: "~1 200" },
              ]}
              cta={
                <EditorialButton
                  variant="link"
                  size="md"
                  href="#kontakt"
                  onClick={(e) => {
                    e.preventDefault();
                    const el = document.getElementById("kontakt");
                    if (el)
                      el.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                >
                  Be om referanse
                </EditorialButton>
              }
            />
          </motion.div>
        </motion.div>

        <p className="mt-12 editorial-mono-caption text-center">
          Flere referanser tilgjengelig på forespørsel. Kontakt salg for kunde- og
          nøkkeltallreferanser.
        </p>
      </div>
    </section>
  );
};

export default BrukerhistorierSection;
