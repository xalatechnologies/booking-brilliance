import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
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

      <PageTransition>
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

            <motion.ol
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              variants={staggerParent}
              className="border-t border-rule"
            >
              {posts.map((post) => (
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
                      <div className={post.cover ? "lg:col-span-2 order-1 lg:order-2" : "lg:col-span-2 order-1"}>
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
                      <div className={`order-3 ${post.cover ? "lg:col-span-7" : "lg:col-span-10"}`}>
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
                              <span>{post.readingMinutes} min lesetid</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.li>
              ))}
            </motion.ol>

            {posts.length === 0 && (
              <p className="text-base text-ink-soft mt-10">
                Ingen artikler ennå.
              </p>
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
