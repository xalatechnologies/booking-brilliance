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
} from "@/components/editorial";
import { getPostBySlug, getAllPosts, formatPostDate } from "@/lib/posts";
import { getFraunces } from "@/lib/fonts";
import { staggerParent, staggerChild, viewportOnce } from "@/lib/motion";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getPostBySlug(slug) : undefined;

  if (!post) return <Navigate to="/blogg" replace />;

  const url = `https://digilist.no/blogg/${post.slug}`;
  const related = getAllPosts()
    .filter((p) => p.slug !== post.slug)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <SEO
        title={`${post.title} — Digilist Blogg`}
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
      <main>
        <article className="pt-28 lg:pt-32 pb-16 lg:pb-24 bg-paper">
          <div className="container mx-auto px-4">
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

            <header className="max-w-3xl mb-12">
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
              <figure className="max-w-4xl mb-14 lg:mb-20">
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

            <div className="post-body max-w-3xl">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {post.content}
              </ReactMarkdown>
            </div>
          </div>
        </article>

        {related.length > 0 && (
          <section className="py-14 lg:py-20 bg-paper-deep/40 border-t border-rule">
            <div className="container mx-auto px-4">
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
