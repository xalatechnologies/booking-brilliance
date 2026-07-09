import { Link, useParams, Navigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft } from "lucide-react";
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
  // Sidebar recommendations: same-tag articles first (topically relevant while
  // reading), backfilled with the newest others. Distinct from the "Fortsett å
  // lese" latest strip at the foot of the page.
  const sidebarRelated = [
    ...getAllPosts().filter(
      (p) => p.slug !== post.slug && p.tag && p.tag === post.tag,
    ),
    ...related,
  ]
    .filter((p, i, arr) => arr.findIndex((x) => x.slug === p.slug) === i)
    .slice(0, 3);
  // Strip a trailing "book a demo" CTA from the body — the CTA band below the
  // article already provides one, so an in-article copy is a duplicate. Only
  // pops CTA paragraph(s) at the very end, so mid-article mentions are safe.
  const isCta = (p: string) =>
    /\[book\s+(?:en\s+)?demo/i.test(p) ||
    /^\*\*\s*book\s+en\s+demo/i.test(p.trim()) ||
    /book\s+demo\s*→/i.test(p);
  const bodyParas = post.content.trimEnd().split(/\n{2,}/);
  while (bodyParas.length > 1 && isCta(bodyParas[bodyParas.length - 1]))
    bodyParas.pop();
  const body = bodyParas.join("\n\n");

  return (
    <div className="min-h-screen bg-background overflow-x-clip">
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
        <article className="pt-24 lg:pt-28 pb-16 lg:pb-24 bg-paper">
          <div className="container mx-auto md:px-8 lg:px-12">
            {/* Breadcrumb + category share one line to keep the top tight. */}
            <div className="flex items-center justify-between gap-4 mb-7">
              <nav className="editorial-mono-caption" aria-label="Brødsmuler">
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
              {post.tag && (
                <span className="editorial-mono-caption text-accent-text">
                  {post.tag}
                </span>
              )}
            </div>

            {/* Full-width split: article fills the left, a wide sidebar on the
                right, spanning the container (no centering). */}
            <div className="grid gap-x-10 gap-y-12 lg:grid-cols-[minmax(0,1fr)_20rem] xl:gap-x-16 xl:grid-cols-[minmax(0,1fr)_22rem]">
              {/* Main article column */}
              <div className="min-w-0">
                <header className="mb-10 lg:mb-12">
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
                      FIG. · {post.tag ?? "Illustrasjon"}
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
                    {body}
                  </ReactMarkdown>
                </div>
              </div>

              {/* Sticky sidebar — reading meta, TOC, related, share */}
              <aside aria-label="Artikkelinfo">
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

                  {sidebarRelated.length > 0 && (
                    <div>
                      <p className="editorial-mono-caption text-accent-text mb-4">
                        Relaterte artikler
                      </p>
                      <ul className="flex flex-col divide-y divide-rule border-y border-rule">
                        {sidebarRelated.map((r) => (
                          <li key={r.slug}>
                            <Link
                              to={`/blogg/${r.slug}`}
                              className="group flex flex-col gap-1.5 py-3.5"
                            >
                              <span className="editorial-mono-caption text-ink-faint">
                                {r.tag ?? "Artikkel"}
                              </span>
                              <span
                                className="font-serif text-[1.05rem] leading-snug text-ink transition-colors group-hover:text-accent-text"
                                style={{ letterSpacing: "-0.01em" }}
                              >
                                {r.title}
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
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
                </div>
              </aside>
            </div>

          </div>
        </article>

        {/* End-of-article call to action */}
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
                <h2
                  className="mt-3 font-serif text-3xl lg:text-4xl text-ink leading-tight"
                  style={{
                    fontVariationSettings: getFraunces("section"),
                    letterSpacing: "-0.015em",
                  }}
                >
                  Klar for å se Digilist i praksis?
                </h2>
                <p className="mt-3 text-lg text-ink-soft measure leading-relaxed">
                  Book en personlig demo, eller still spørsmål direkte i chat.
                  Vi svarer på under et minutt i kontortid.
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
      </main>
      </PageTransition>

      <Footer />
    </div>
  );
};

export default BlogPost;
