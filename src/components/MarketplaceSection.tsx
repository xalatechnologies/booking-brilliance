import { Link } from "react-router-dom";
import {
  GlassWater,
  TreePine,
  Dumbbell,
  Music,
  PartyPopper,
  Sparkles,
  ArrowUpRight,
  type LucideIcon,
} from "lucide-react";
import { SectionRule, EditorialHeading } from "@/components/editorial";
import { getFraunces } from "@/lib/fonts";

interface Tile {
  title: string;
  tag: string;
  to: string;
  image: string;
  Icon: LucideIcon;
}

// The five consumer marketplaces (the "Finn" menu). Homepage counterpart to
// the kommune/platform content below, so digilist.no covers both audiences.
const TILES: Tile[] = [
  {
    title: "Lokaler",
    tag: "Selskap · møte · kultur",
    to: "/leie",
    image: "/images/cat/selskapslokale.jpg",
    Icon: GlassWater,
  },
  {
    title: "Overnatting",
    tag: "Hytte · leilighet · feriehus",
    to: "/overnatting",
    image: "/images/cat/hytte.jpg",
    Icon: TreePine,
  },
  {
    title: "Sport og aktivitet",
    tag: "Idrettshall · padel · svømming",
    to: "/leie/idrettshall",
    image: "/images/cat/idrettshall.jpg",
    Icon: Dumbbell,
  },
  {
    title: "Arrangementer",
    tag: "Konsert · teater · sport",
    to: "/arrangementer",
    image: "/images/cat/konsert.jpg",
    Icon: Music,
  },
  {
    title: "Utstyr",
    tag: "Fest · verktøy · friluft",
    to: "/utstyr",
    image: "/images/cat/festutstyr.jpg",
    Icon: PartyPopper,
  },
  {
    title: "Tjenester",
    tag: "Catering · DJ · dekor",
    to: "/tjenester",
    image: "/images/cat/dekor.jpg",
    Icon: Sparkles,
  },
];

const MarketplaceSection = () => {
  return (
    <section id="marketplace" className="py-14 lg:py-20 bg-paper">
      <div className="container mx-auto md:px-8 lg:px-12">
        <SectionRule label="FINN OG BOOK" />

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-gutter mb-8 lg:mb-10 items-end">
          <div className="lg:col-span-8">
            <EditorialHeading as="h2" size="section">
              Alt du kan finne og booke,{" "}
              <em
                className="italic"
                style={{ fontVariationSettings: getFraunces("display") }}
              >
                som privatperson
              </em>
              .
            </EditorialHeading>
          </div>
          <div className="lg:col-span-4">
            <p className="text-lg text-ink-soft leading-relaxed">
              Lokaler, overnatting, arrangementer, utstyr og tjenester, samlet på
              ett sted. Ekte priser, ledige tider og betaling med Vipps.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
          {TILES.map((t) => {
            const Icon = t.Icon;
            return (
              <Link
                key={t.to}
                to={t.to}
                className="group relative block overflow-hidden rounded-lg shadow-sm transition-all duration-300 ease-editorial hover:-translate-y-1 hover:shadow-xl"
                style={{ aspectRatio: "16 / 10" }}
              >
                <img
                  src={t.image}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-editorial group-hover:scale-[1.06]"
                  loading="lazy"
                  decoding="async"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/5"
                />
                <div className="absolute inset-0 p-4 lg:p-5 flex flex-col justify-between">
                  <span className="self-start inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm text-navy shadow-sm">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <h3
                      className="font-serif text-2xl lg:text-3xl text-white leading-tight"
                      style={{
                        fontVariationSettings: getFraunces("sub"),
                        letterSpacing: "-0.015em",
                      }}
                    >
                      {t.title}
                    </h3>
                    <p className="mt-1 font-mono text-[0.6rem] uppercase tracking-widest text-white/70">
                      {t.tag}
                    </p>
                    <span className="mt-3 inline-flex items-center gap-1.5 font-mono text-[0.65rem] uppercase tracking-widest text-white">
                      Finn
                      <ArrowUpRight
                        className="h-3.5 w-3.5 transition-transform duration-quick ease-editorial group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        aria-hidden="true"
                      />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default MarketplaceSection;
