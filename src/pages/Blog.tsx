import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  SectionRule,
  EditorialHeading,
  ProgressRail,
} from "@/components/editorial";
import { getAllPosts, formatPostDate } from "@/lib/posts";
import { getFraunces } from "@/lib/fonts";

const Blog = () => {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <SEO
        title="Blogg — Digilist | Innsikt om kommunal booking, sesongleie og samsvar"
        description="Artikler om bookingsystem for kommuner, sesongleie, SSA-L 2026, GDPR og ISO 27001 — fra Digilists arbeid med norske kommuner og utleiere."
        canonical="https://digilist.no/blogg"
        breadcrumbs={[
          { name: "Hjem", url: "https://digilist.no/" },
          { name: "Blogg", url: "https://digilist.no/blogg" },
        ]}
      />
      <ProgressRail />
      <Navbar />

      <main>
        <section className="pt-28 lg:pt-32 pb-14 lg:pb-20 bg-paper">
          <div className="container mx-auto px-4">
            <SectionRule label="DIGILIST · BLOGG" />

            <div className="grid lg:grid-cols-12 gap-8 lg:gap-gutter mb-12">
              <div className="lg:col-span-8">
                <EditorialHeading as="h1" size="display">
                  Innsikt om{" "}
                  <em
                    className="italic"
                    style={{ fontVariationSettings: getFraunces("display") }}
                  >
                    kommunal booking
                  </em>
                  .
                </EditorialHeading>
                <p className="mt-6 text-xl text-ink-soft measure leading-relaxed">
                  Artikler om kommunale bookingsystemer, sesongleie, samsvar og
                  digitalisering av kommunale tjenester.
                </p>
              </div>
            </div>

            <ol className="border-t border-rule">
              {posts.map((post) => (
                <li
                  key={post.slug}
                  className="border-b border-rule py-8 lg:py-10"
                >
                  <Link
                    to={`/blogg/${post.slug}`}
                    className="group grid lg:grid-cols-12 gap-6 lg:gap-gutter"
                  >
                    <div className="lg:col-span-2 flex items-start gap-4 lg:block">
                      {post.tag && (
                        <span className="inline-block editorial-mono-caption text-accent-text">
                          {post.tag}
                        </span>
                      )}
                      <span className="block editorial-mono-caption text-ink-faint lg:mt-2">
                        {formatPostDate(post.date)}
                      </span>
                    </div>
                    <div className="lg:col-span-10">
                      <h2
                        className="font-serif text-3xl lg:text-4xl text-ink mb-3 group-hover:underline underline-offset-8 decoration-[0.5px]"
                        style={{
                          fontVariationSettings: getFraunces("section"),
                          letterSpacing: "-0.015em",
                          lineHeight: 1.1,
                        }}
                      >
                        {post.title}
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
                            <span>{post.readingMinutes} min lesetid</span>
                          </>
                        )}
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ol>

            {posts.length === 0 && (
              <p className="text-base text-ink-soft mt-10">
                Ingen artikler ennå.
              </p>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Blog;
