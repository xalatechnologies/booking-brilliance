import { useMemo, useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, Search, X, ChevronLeft, ChevronRight } from "lucide-react";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import {
  SectionRule,
  EditorialHeading,
  ProgressRail,
} from "@/components/editorial";
import { getAllPosts, formatPostDate } from "@/lib/posts";
import { getFraunces } from "@/lib/fonts";
import { staggerParent, staggerChild, viewportOnce } from "@/lib/motion";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 6;

const Blog = () => {
  const allPosts = getAllPosts();
  const [searchParams, setSearchParams] = useSearchParams();

  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [activeTag, setActiveTag] = useState<string>(
    searchParams.get("tag") ?? "Alle",
  );
  const [page, setPage] = useState<number>(() => {
    const p = parseInt(searchParams.get("page") ?? "1", 10);
    return Number.isFinite(p) && p > 0 ? p : 1;
  });

  // Reflect filter/search/page in the URL so the result is shareable
  useEffect(() => {
    const next = new URLSearchParams();
    if (query.trim()) next.set("q", query.trim());
    if (activeTag && activeTag !== "Alle") next.set("tag", activeTag);
    if (page > 1) next.set("page", String(page));
    setSearchParams(next, { replace: true });
  }, [query, activeTag, page, setSearchParams]);

  const tags = useMemo(() => {
    const set = new Set<string>();
    allPosts.forEach((p) => p.tag && set.add(p.tag));
    return ["Alle", ...Array.from(set).sort()];
  }, [allPosts]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allPosts.filter((p) => {
      if (activeTag !== "Alle" && p.tag !== activeTag) return false;
      if (!q) return true;
      const haystack = [
        p.title,
        p.description,
        p.author,
        p.tag,
        ...(p.keywords ?? []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [allPosts, query, activeTag]);

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, activeTag]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const startIdx = (currentPage - 1) * PAGE_SIZE;
  const paged = filtered.slice(startIdx, startIdx + PAGE_SIZE);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <SEO
        title="Blogg — Digilist | Innsikt om booking, sesongleie, samsvar og daglig drift"
        description="Artikler fra Digilists arbeid med norske kommuner og utleiere — bookingflyt, saksbehandling, sesongleie, sikker innlogging, fakturering, SSA-L 2026, GDPR og ISO 27001."
        canonical="https://digilist.no/blogg"
        breadcrumbs={[
          { name: "Hjem", url: "https://digilist.no/" },
          { name: "Blogg", url: "https://digilist.no/blogg" },
        ]}
      />
      <ProgressRail />
      <Navbar />

      <PageTransition>
        <main id="main">
          <section className="pt-28 lg:pt-32 pb-14 lg:pb-20 bg-paper">
            <div className="container mx-auto md:px-8 lg:px-12">
              <SectionRule label="DIGILIST · BLOGG" />

              <div className="grid lg:grid-cols-12 gap-8 lg:gap-gutter mb-12">
                <div className="lg:col-span-8">
                  <EditorialHeading as="h1" size="display">
                    Innsikt om{" "}
                    <em
                      className="italic"
                      style={{ fontVariationSettings: getFraunces("display") }}
                    >
                      norsk booking
                    </em>
                    .
                  </EditorialHeading>
                  <p className="mt-6 text-xl text-ink-soft measure leading-relaxed">
                    Artikler fra arbeid med norske kommuner og utleiere — fra
                    veiviser og saksbehandling til sesongleie, sikker
                    innlogging, fakturering og samsvar.
                  </p>
                </div>
              </div>

              {/* Search + tag filter */}
              <div className="border-y border-rule py-5 lg:py-6 mb-10 lg:mb-12">
                <div className="grid lg:grid-cols-12 gap-5 lg:gap-gutter items-center">
                  <div className="lg:col-span-5">
                    <label htmlFor="blog-search" className="sr-only">
                      Søk i artikler
                    </label>
                    <div className="relative">
                      <Search
                        className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-faint"
                        aria-hidden="true"
                      />
                      <input
                        id="blog-search"
                        type="search"
                        placeholder="Søk i artikler — SSA-L, sesongleie, GDPR …"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full bg-paper border border-hairline-strong rounded-sm pl-9 pr-9 py-2.5 text-base text-ink placeholder:text-ink-faint focus:outline-none focus:border-ink"
                      />
                      {query && (
                        <button
                          type="button"
                          aria-label="Tøm søk"
                          onClick={() => setQuery("")}
                          className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-7 h-7 rounded-sm text-ink-faint hover:text-ink hover:bg-paper-deep transition-colors"
                        >
                          <X className="h-4 w-4" aria-hidden="true" />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="lg:col-span-7">
                    <div
                      role="group"
                      aria-label="Filtrer etter kategori"
                      className="flex flex-wrap gap-2"
                    >
                      {tags.map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setActiveTag(t)}
                          aria-pressed={activeTag === t}
                          className={cn(
                            "inline-flex items-center px-3 py-1.5 border rounded-sm font-mono text-[0.8125rem] uppercase tracking-[0.08em] font-medium transition-colors duration-quick ease-editorial",
                            activeTag === t
                              ? "bg-navy text-on-navy border-navy hover:bg-navy/90"
                              : "bg-paper text-ink border-hairline-strong hover:bg-paper-deep hover:border-ink",
                          )}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-4 editorial-mono-caption text-ink-faint flex items-baseline justify-between">
                  <span>
                    {filtered.length === allPosts.length
                      ? `${allPosts.length} ARTIKLER`
                      : `${filtered.length} av ${allPosts.length} artikler`}
                  </span>
                  {totalPages > 1 && (
                    <span>
                      SIDE {currentPage} av {totalPages}
                    </span>
                  )}
                </div>
              </div>

              <motion.ol
                key={`${activeTag}-${query}-${currentPage}`}
                initial="hidden"
                animate="visible"
                variants={staggerParent}
                className="border-t border-rule"
              >
                {paged.map((post) => (
                  <motion.li
                    key={post.slug}
                    variants={staggerChild}
                    className="border-b border-rule"
                  >
                    <Link
                      to={`/blogg/${post.slug}`}
                      className="group block relative py-8 lg:py-12 transition-colors duration-quick ease-editorial hover:bg-paper-deep/40"
                    >
                      <span
                        aria-hidden="true"
                        className="absolute left-0 top-0 bottom-0 w-px bg-ink scale-y-0 group-hover:scale-y-100 origin-top transition-transform duration-normal ease-editorial"
                      />
                      <div className="grid lg:grid-cols-12 gap-6 lg:gap-gutter px-2 lg:px-6">
                        {post.cover && (
                          <div className="lg:col-span-3 order-2 lg:order-1">
                            <div className="relative aspect-[4/3] overflow-hidden rounded-sm border border-hairline-strong bg-navy">
                              <img
                                src={post.cover}
                                alt=""
                                loading="lazy"
                                decoding="async"
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-slow ease-editorial group-hover:scale-[1.04]"
                              />
                            </div>
                          </div>
                        )}
                        <div
                          className={
                            post.cover
                              ? "lg:col-span-2 order-1 lg:order-2"
                              : "lg:col-span-2 order-1"
                          }
                        >
                          <div className="flex items-start gap-4 lg:block">
                            {post.tag && (
                              <span className="inline-block editorial-mono-caption text-accent-text">
                                {post.tag}
                              </span>
                            )}
                            <span className="block editorial-mono-caption text-ink-faint lg:mt-2">
                              {formatPostDate(post.date)}
                            </span>
                          </div>
                        </div>
                        <div
                          className={`order-3 ${
                            post.cover ? "lg:col-span-7" : "lg:col-span-10"
                          }`}
                        >
                          <h2
                            className="font-serif text-3xl lg:text-4xl text-ink mb-3 transition-transform duration-normal ease-editorial group-hover:translate-x-1"
                            style={{
                              fontVariationSettings: getFraunces("section"),
                              letterSpacing: "-0.015em",
                              lineHeight: 1.1,
                            }}
                          >
                            {post.title}
                            <span className="inline-flex ml-2 align-baseline opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-normal ease-editorial">
                              <ArrowUpRight
                                className="h-5 w-5 text-accent-text"
                                aria-hidden="true"
                              />
                            </span>
                          </h2>
                          <p className="text-base text-ink-soft measure leading-relaxed">
                            {post.description}
                          </p>
                          <div className="mt-4 flex items-center gap-3 editorial-mono-caption text-ink-faint">
                            <span>{post.author}</span>
                            {post.readingMinutes && (
                              <>
                                <span
                                  aria-hidden="true"
                                  className="w-px h-3 bg-rule"
                                />
                                <span>
                                  {post.readingMinutes} min lesetid
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.li>
                ))}
              </motion.ol>

              {filtered.length === 0 && (
                <div className="py-16 text-center">
                  <p className="font-serif text-2xl text-ink mb-3">
                    Ingen treff.
                  </p>
                  <p className="text-base text-ink-soft">
                    Prøv et annet søkeord eller fjern filteret.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setQuery("");
                      setActiveTag("Alle");
                    }}
                    className="mt-6 inline-flex items-center gap-2 border border-hairline-strong bg-paper px-4 py-2 rounded-sm text-sm text-ink hover:bg-paper-deep hover:border-ink transition-colors"
                  >
                    Nullstill filter
                  </button>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <nav
                  aria-label="Sidenavigasjon"
                  className="mt-12 lg:mt-16 pt-8 border-t border-rule flex items-center justify-between gap-4"
                >
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage <= 1}
                    className="group inline-flex items-center gap-2 px-4 py-2.5 border border-hairline-strong bg-paper rounded-sm font-serif text-base text-ink hover:bg-paper-deep hover:border-ink transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    style={{ fontVariationSettings: getFraunces("sub") }}
                  >
                    <ChevronLeft
                      className="h-4 w-4 transition-transform duration-quick group-hover:-translate-x-0.5"
                      aria-hidden="true"
                    />
                    Forrige
                  </button>

                  <div className="flex items-center gap-1.5">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setPage(p)}
                          aria-current={p === currentPage ? "page" : undefined}
                          className={cn(
                            "inline-flex items-center justify-center min-w-10 h-10 px-2 rounded-sm font-mono text-sm tabular-nums transition-colors duration-quick ease-editorial",
                            p === currentPage
                              ? "bg-navy text-on-navy border border-navy"
                              : "border border-hairline-strong bg-paper text-ink hover:bg-paper-deep hover:border-ink",
                          )}
                        >
                          {p}
                        </button>
                      ),
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage >= totalPages}
                    className="group inline-flex items-center gap-2 px-4 py-2.5 border border-hairline-strong bg-paper rounded-sm font-serif text-base text-ink hover:bg-paper-deep hover:border-ink transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    style={{ fontVariationSettings: getFraunces("sub") }}
                  >
                    Neste
                    <ChevronRight
                      className="h-4 w-4 transition-transform duration-quick group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </button>
                </nav>
              )}
            </div>
          </section>
        </main>
      </PageTransition>

      <Footer />
    </div>
  );
};

export default Blog;
