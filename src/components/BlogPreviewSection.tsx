import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import {
  SectionRule,
  EditorialHeading,
  EditorialButton,
} from "@/components/editorial";
import { getAllPosts, formatPostDate } from "@/lib/posts";
import { staggerParent, staggerChild, viewportOnce } from "@/lib/motion";
import { getFraunces } from "@/lib/fonts";
import { cn } from "@/lib/utils";

const FALLBACK_COVER = "/images/blog/_placeholder.svg";

const BlogPreviewSection = () => {
  const posts = getAllPosts().slice(0, 6);
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateButtons = () => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  };

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    updateButtons();
    el.addEventListener("scroll", updateButtons, { passive: true });
    window.addEventListener("resize", updateButtons);
    return () => {
      el.removeEventListener("scroll", updateButtons);
      window.removeEventListener("resize", updateButtons);
    };
  }, [posts.length]);

  const scrollBy = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-slide]");
    const step = card ? card.offsetWidth + 32 : el.clientWidth * 0.85;
    el.scrollBy({ left: step * dir, behavior: "smooth" });
  };

  if (posts.length === 0) return null;

  return (
    <section
      id="blogg-preview"
      aria-labelledby="blogg-preview-heading"
      className="py-20 lg:py-32 bg-paper-deep/40 border-y border-rule"
    >
      <div className="container mx-auto md:px-8 lg:px-12">
        <SectionRule label="V. INNSIKT" />

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-gutter mb-12 lg:mb-20">
          <div className="lg:col-span-7">
            <EditorialHeading
              as="h2"
              size="section"
              id="blogg-preview-heading"
            >
              Lesestoff fra{" "}
              <em
                className="italic"
                style={{
                  fontVariationSettings:
                    '"opsz" 96, "wght" 400, "SOFT" 30, "WONK" 0',
                }}
              >
                redaksjonen
              </em>
              .
            </EditorialHeading>
          </div>
          <div className="lg:col-span-5 flex flex-col justify-end gap-8">
            <p
              className="text-xl lg:text-2xl text-ink-soft italic measure"
              style={{
                fontVariationSettings: getFraunces("sub"),
                lineHeight: 1.45,
              }}
            >
              Tre artikler om kommunal booking, sesongleie og samsvar — skrevet
              for saksbehandlere, kulturkonsulenter og digitaliseringsledere.
            </p>
            <div className="flex items-center justify-between border-t border-rule pt-6">
              <EditorialButton variant="link" size="md" href="/blogg">
                Se alle artikler
              </EditorialButton>
              <div className="hidden lg:flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => scrollBy(-1)}
                  disabled={!canScrollLeft}
                  aria-label="Forrige artikkel"
                  className={cn(
                    "inline-flex items-center justify-center w-11 h-11 border border-hairline-strong rounded-sm text-ink transition-all duration-quick ease-editorial",
                    "hover:bg-paper-deep hover:border-ink disabled:opacity-30 disabled:cursor-not-allowed",
                  )}
                >
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollBy(1)}
                  disabled={!canScrollRight}
                  aria-label="Neste artikkel"
                  className={cn(
                    "inline-flex items-center justify-center w-11 h-11 border border-hairline-strong rounded-sm text-ink transition-all duration-quick ease-editorial",
                    "hover:bg-paper-deep hover:border-ink disabled:opacity-30 disabled:cursor-not-allowed",
                  )}
                >
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerParent}
        >
          <div
            ref={scrollerRef}
            className={cn(
              "flex gap-8 lg:gap-10 overflow-x-auto pb-8 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide",
            )}
          >
            {posts.map((post, i) => (
              <motion.article
                key={post.slug}
                data-slide
                variants={staggerChild}
                className="snap-start shrink-0 w-[88%] sm:w-[64%] md:w-[48%] lg:w-[36%] xl:w-[32%]"
              >
                <Link
                  to={`/blogg/${post.slug}`}
                  className="group flex flex-col h-full bg-paper border border-hairline-strong hover:border-ink transition-all duration-normal ease-editorial rounded-sm overflow-hidden hover:-translate-y-1"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-navy">
                    <img
                      src={post.cover || FALLBACK_COVER}
                      alt={post.title}
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-slow ease-editorial group-hover:scale-[1.04]"
                      onError={(e) => {
                        const img = e.currentTarget;
                        if (img.src.endsWith(FALLBACK_COVER)) {
                          img.style.display = "none";
                          return;
                        }
                        img.src = FALLBACK_COVER;
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent pointer-events-none" />
                    {post.tag && (
                      <span className="absolute top-4 left-4 editorial-mono-caption bg-paper/95 backdrop-blur-sm text-accent-text px-2.5 py-1 border border-hairline-strong">
                        {post.tag}
                      </span>
                    )}
                    <span className="absolute bottom-4 right-4 inline-flex items-center justify-center w-9 h-9 bg-paper/90 backdrop-blur-sm border border-hairline-strong rounded-sm text-ink transition-transform duration-normal ease-editorial group-hover:translate-x-1 group-hover:-translate-y-1">
                      <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                    </span>
                  </div>
                  <div className="flex flex-col flex-1 p-7 lg:p-8">
                    <div className="editorial-mono-caption text-ink-faint mb-4 flex items-center gap-3">
                      <span>{formatPostDate(post.date)}</span>
                      {post.readingMinutes && (
                        <>
                          <span
                            aria-hidden="true"
                            className="w-px h-3 bg-rule"
                          />
                          <span>{post.readingMinutes} min lesetid</span>
                        </>
                      )}
                    </div>
                    <h3
                      className="font-serif text-2xl lg:text-3xl text-ink mb-3 transition-colors duration-quick group-hover:text-accent-text"
                      style={{
                        fontVariationSettings: getFraunces("sub"),
                        lineHeight: 1.15,
                      }}
                    >
                      {post.title}
                    </h3>
                    <p className="text-sm lg:text-base text-ink-soft leading-relaxed flex-1">
                      {post.description}
                    </p>
                    <div className="mt-6 pt-5 border-t border-rule editorial-mono-caption text-ink-faint flex items-center justify-between">
                      <span className="truncate">{post.author}</span>
                      <span className="text-accent-text whitespace-nowrap">
                        Les artikkel →
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        </motion.div>

        <div className="mt-10 flex lg:hidden items-center gap-3 justify-center">
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            disabled={!canScrollLeft}
            aria-label="Forrige artikkel"
            className="inline-flex items-center justify-center w-12 h-12 border border-hairline-strong rounded-sm text-ink disabled:opacity-30"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => scrollBy(1)}
            disabled={!canScrollRight}
            aria-label="Neste artikkel"
            className="inline-flex items-center justify-center w-12 h-12 border border-hairline-strong rounded-sm text-ink disabled:opacity-30"
          >
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default BlogPreviewSection;
