import { Link, useParams, Navigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import {
  EditorialHeading,
  Byline,
  ProgressRail,
  EditorialButton,
} from "@/components/editorial";
import { getPostBySlug, getAllPosts, formatPostDate } from "@/lib/posts";
import { getFraunces } from "@/lib/fonts";
import { staggerParent, staggerChild, viewportOnce } from "@/lib/motion";
import { openChatbot } from "@/lib/chatbot/open";

const CHAT_HREFS = new Set([
  "mailto:kontakt@digilist.no",
  "#chat",
  "#snakk-med-oss",
]);

/** URL-safe anchor slug from a heading's text (matches the TOC to the H2 ids). */
function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Pull the "## " headings out of the markdown for the in-article TOC. */
function extractHeadings(md: string): { id: string; text: string }[] {
  const out: { id: string; text: string }[] = [];
  const re = /^##\s+(.+?)\s*$/gm;
  let m: RegExpExecArray | null;
  while ((m = re.exec(md)) !== null) {
    const text = m[1].replace(/[*_`]/g, "").trim();
    if (text) out.push({ id: slugify(text), text });
  }
  return out;
}

/** Plain-text node → string, for deriving a heading id from ReactMarkdown children. */
function nodeText(node: React.ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(nodeText).join("");
  if (node && typeof node === "object" && "props" in (node as never))
    return nodeText((node as { props: { children?: React.ReactNode } }).props.children);
  return "";
}

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getPostBySlug(slug) : undefined;

  if (!post) return <Navigate to="/blogg" replace />;

  const url = `https://digilist.no/blogg/${post.slug}`;
  const related = getAllPosts()
    .filter((p) => p.slug !== post.slug)
    .slice(0, 3);
  const toc = extractHeadings(post.content);
  const readingMin = Math.max(
    1,
    Math.round(post.content.split(/\s+/).filter(Boolean).length / 200),
  );
  const share = [
    { label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}` },
    { label: "X", href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(post.title)}` },
    { label: "E-post", href: `mailto:?subject=${encodeURIComponent(post.title)}&body=${encodeURIComponent(url)}` },
  ];

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <SEO
        title={post.title.length > 50 ? post.title : `${post.title} — Digilist`}
        description={post.description}
        canonical={url}
        ogType="article"
        ogImage={
          post.cover
            ? post.cover.startsWith("http")
              ? post.cover
              : `https://digilist.no${post.cover}`
            : "https://digilist.no/og-image.png"
        }
        breadcrumbs={[
          { name: "Hjem", url: "https://digilist.no/" },
          { name: "Blogg", url: "https://digilist.no/blogg" },
          { name: post.title, url },
        ]}
        article={{
          headline: post.title,
          description: post.description,
          datePublished: post.date,
          author: post.author,
          authorRole: post.role,
          image: post.cover,
          articleSection: post.tag,
          keywords: post.keywords,
          wordCount: post.content.split(/\s+/).filter(Boolean).length,
        }}
      />
      <ProgressRail />
      <Navbar />

      <PageTransition>
      <main id="main">
        <article className="pt-28 lg:pt-32 pb-16 lg:pb-24 bg-paper">
          <div className="container mx-auto md:px-8 lg:px-12">
            <nav
              className="editorial-mono-caption mb-10"
              aria-label="Brødsmuler"
            >
              <Link
                to="/blogg"
                className="group inline-flex items-center gap-2 text-accent-text"
              >
                <ArrowLeft
                  className="h-3.5 w-3.5 transition-transform duration-quick ease-editorial group-hover:-translate-x-1"
                  aria-hidden="true"
                />
                <span className="group-hover:underline underline-offset-4 decoration-[0.5px]">
                  Tilbake til blogg
                </span>
              </Link>
            </nav>

            <div className="grid lg:grid-cols-12 gap-x-8 lg:gap-x-gutter gap-y-12">
              {/* Main article column */}
              <div className="lg:col-span-8 min-w-0">
                <header className="mb-10 lg:mb-12">
                  {post.tag && (
                    <p className="editorial-mono-caption text-accent-text mb-4">
                      {post.tag}
                    </p>
                  )}
                  <EditorialHeading as="h1" size="display" className="mb-6">
                    {post.title}
                  </EditorialHeading>
                  <p
                    className="text-xl text-ink-soft italic measure leading-relaxed mb-8"
                    style={{ fontVariationSettings: getFraunces("sub") }}
                  >
                    {post.description}
                  </p>
                  <Byline
                    author={post.author}
                    role={post.role}
                    date={formatPostDate(post.date)}
                  />
                </header>

                {post.cover && (
                  <figure className="mb-12 lg:mb-14">
                    <div className="relative aspect-[16/9] overflow-hidden rounded-sm border border-hairline-strong bg-navy">
                      <img
                        src={post.cover}
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </div>
                    <figcaption className="mt-3 editorial-mono-caption text-ink-faint">
                      FIG. — {post.tag ?? "Illustrasjon"}
                    </figcaption>
                  </figure>
                )}

                <div className="post-body max-w-[68ch]">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h2: ({ children, ...props }) => (
                        <h2
                          id={slugify(nodeText(children))}
                          style={{ scrollMarginTop: "7rem" }}
                          {...props}
                        >
                          {children}
                        </h2>
                      ),
                      a: ({ href, children, ...props }) => {
                        if (href && CHAT_HREFS.has(href)) {
                          return (
                            <button
                              type="button"
                              onClick={() => openChatbot({ mode: "chat" })}
                              className="underline underline-offset-4 decoration-[0.5px] text-accent-text hover:text-ink transition-colors"
                            >
                              {children}
                            </button>
                          );
                        }
                        return (
                          <a href={href} {...props}>
                            {children}
                          </a>
                        );
                      },
                    }}
                  >
                    {post.content}
                  </ReactMarkdown>
                </div>
              </div>

              {/* Sticky sidebar — TOC, reading meta, share, CTA */}
              <aside className="lg:col-span-4" aria-label="Artikkelinfo">
                <div className="lg:sticky lg:top-28 flex flex-col gap-8 lg:border-l lg:border-rule lg:pl-8">
                  <p className="editorial-mono-caption text-ink-faint flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span>{readingMin} min lesetid</span>
                    <span aria-hidden="true" className="text-accent-text">
                      ·
                    </span>
                    <span>{formatPostDate(post.date)}</span>
                  </p>

                  {toc.length >= 2 && (
                    <nav aria-label="I denne artikkelen">
                      <p className="editorial-mono-caption text-accent-text mb-4">
                        I denne artikkelen
                      </p>
                      <ul className="flex flex-col gap-1 border-l border-rule">
                        {toc.map((h) => (
                          <li key={h.id}>
                            <a
                              href={`#${h.id}`}
                              className="block -ml-px border-l border-transparent pl-4 py-1 text-[0.95rem] leading-snug text-ink-soft transition-colors hover:border-ink hover:text-ink"
                            >
                              {h.text}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </nav>
                  )}

                  <div>
                    <p className="editorial-mono-caption text-accent-text mb-3">
                      Del artikkelen
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {share.map((s) => (
                        <a
                          key={s.label}
                          href={s.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center rounded-sm border border-hairline-strong px-3 py-1.5 font-mono text-xs uppercase tracking-[0.08em] text-ink-soft transition-colors hover:border-ink hover:text-ink"
                        >
                          {s.label}
                        </a>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-sm border border-hairline-strong bg-accent-tinted p-6">
                    <p
                      className="mb-4 font-serif text-xl leading-snug text-ink"
                      style={{ fontVariationSettings: getFraunces("sub") }}
                    >
                      Vil du se hvordan det fungerer i praksis?
                    </p>
                    <EditorialButton variant="primary" size="md" href="/book-demo">
                      Book en demo
                    </EditorialButton>
                  </div>
                </div>
              </aside>
            </div>

          </div>
        </article>

        {/* End-of-article CTA — full-bleed tinted band, matches PilotInvitation */}
        <section
          aria-label="Neste steg"
          className="bg-accent-tinted border-t border-hairline-strong py-14 lg:py-20"
        >
          <div className="container mx-auto md:px-8 lg:px-12">
            <div className="grid lg:grid-cols-12 gap-6 lg:gap-gutter items-end">
              <div className="lg:col-span-8">
                <span className="editorial-mono-caption text-accent-text">
                  NESTE STEG
                </span>
                <h3
                  className="mt-3 font-serif text-3xl lg:text-4xl text-ink leading-tight"
                  style={{
                    fontVariationSettings: getFraunces("section"),
                    letterSpacing: "-0.015em",
                  }}
                >
                  Klar for å se Digilist i praksis?
                </h3>
                <p className="mt-3 text-lg text-ink-soft measure leading-relaxed">
                  Book en personlig demo, eller still spørsmål direkte i chat
                  — vi svarer på under et minutt i kontortid.
                </p>
              </div>
              <div className="lg:col-span-4 flex flex-wrap gap-3 lg:justify-end">
                <EditorialButton variant="primary" size="md" href="/book-demo">
                  Book demo
                </EditorialButton>
                <EditorialButton
                  variant="outline"
                  size="md"
                  onClick={() => openChatbot({ mode: "chat" })}
                >
                  Snakk med oss
                </EditorialButton>
              </div>
            </div>
          </div>
        </section>

        {related.length > 0 && (
          <section className="py-14 lg:py-20 bg-paper-deep/40 border-t border-rule">
            <div className="container mx-auto md:px-8 lg:px-12">
              <p className="editorial-mono-caption mb-8">Fortsett å lese</p>
              <motion.ol
                initial="hidden"
                whileInView="visible"
                viewport={viewportOnce}
                variants={staggerParent}
                className="grid md:grid-cols-3 gap-px bg-rule border border-rule"
              >
                {related.map((p) => (
                  <motion.li
                    key={p.slug}
                    variants={staggerChild}
                    className="bg-paper"
                  >
                    <Link
                      to={`/blogg/${p.slug}`}
                      className="group flex flex-col h-full p-6 lg:p-8 transition-colors duration-quick ease-editorial hover:bg-paper-deep/40"
                    >
                      {p.tag && (
                        <span className="editorial-mono-caption text-accent-text mb-3 inline-block">
                          {p.tag}
                        </span>
                      )}
                      <h3
                        className="font-serif text-2xl text-ink mb-3 transition-transform duration-normal ease-editorial group-hover:translate-x-1"
                        style={{
                          fontVariationSettings: getFraunces("section"),
                          letterSpacing: "-0.015em",
                          lineHeight: 1.15,
                        }}
                      >
                        {p.title}
                      </h3>
                      <p className="text-base text-ink-soft leading-relaxed flex-1">
                        {p.description.slice(0, 120)}...
                      </p>
                      <span className="mt-5 pt-4 border-t border-rule editorial-mono-caption text-accent-text inline-flex items-center gap-1">
                        Les artikkel
                        <ArrowUpRight
                          className="h-3.5 w-3.5 transition-transform duration-quick ease-editorial group-hover:translate-x-1 group-hover:-translate-y-1"
                          aria-hidden="true"
                        />
                      </span>
                    </Link>
                  </motion.li>
                ))}
              </motion.ol>
            </div>
          </section>
        )}
      </main>
      </PageTransition>

      <Footer />
    </div>
  );
};

export default BlogPost;
