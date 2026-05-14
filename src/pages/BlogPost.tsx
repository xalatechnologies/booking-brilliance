import { Link, useParams, Navigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  EditorialHeading,
  Byline,
  ProgressRail,
} from "@/components/editorial";
import { getPostBySlug, getAllPosts, formatPostDate } from "@/lib/posts";
import { getFraunces } from "@/lib/fonts";

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
        breadcrumbs={[
          { name: "Hjem", url: "https://digilist.no/" },
          { name: "Blogg", url: "https://digilist.no/blogg" },
          { name: post.title, url },
        ]}
      />
      <ProgressRail />
      <Navbar />

      <main>
        <article className="pt-28 lg:pt-32 pb-16 lg:pb-24 bg-paper">
          <div className="container mx-auto px-4">
            <nav
              className="editorial-mono-caption mb-10"
              aria-label="Brødsmuler"
            >
              <Link
                to="/blogg"
                className="text-accent-text hover:underline underline-offset-4 decoration-[0.5px]"
              >
                ← Tilbake til blogg
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
              <ol className="grid md:grid-cols-3 gap-px bg-rule border border-rule">
                {related.map((p) => (
                  <li key={p.slug} className="bg-paper p-6 lg:p-8">
                    <Link to={`/blogg/${p.slug}`} className="group block">
                      {p.tag && (
                        <span className="editorial-mono-caption text-accent-text mb-3 inline-block">
                          {p.tag}
                        </span>
                      )}
                      <h3
                        className="font-serif text-2xl text-ink mb-3 group-hover:underline underline-offset-8 decoration-[0.5px]"
                        style={{
                          fontVariationSettings: getFraunces("section"),
                          letterSpacing: "-0.015em",
                          lineHeight: 1.15,
                        }}
                      >
                        {p.title}
                      </h3>
                      <p className="text-base text-ink-soft leading-relaxed">
                        {p.description.slice(0, 120)}...
                      </p>
                    </Link>
                  </li>
                ))}
              </ol>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default BlogPost;
