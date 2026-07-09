/**
 * /blogg/preview/:draftId — admin preview of an unpublished blog draft.
 *
 * Pulls the draft straight from Convex (no caching, no Vite import.meta.glob)
 * and renders it through the same chrome as a real blog post — same
 * typography, same SEO meta layout, same end-of-article CTA — so a
 * reviewer can see exactly how the post will look once it lands in
 * src/content/blog/<slug>.md after the next `pnpm content:sync` +
 * `./deploy.sh`.
 *
 * Auth: uses the `adminToken` arg pattern (localStorage key
 * `digilist-admin-basic-auth-v1`). Without a valid token, Convex
 * rejects the query and the page shows a sign-in prompt.
 */
import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { useConvex } from "convex/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft } from "lucide-react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import {
  Byline,
  EditorialHeading,
  ProgressRail,
} from "@/components/editorial";
import { AUTH_KEY, adminToken } from "./admin/intelligence-shared";
import { formatPostDate } from "@/lib/posts";

interface DraftDoc {
  _id: Id<"drafts">;
  channel: string;
  title: string;
  body: string;
  frontmatter_json: string;
  status: string;
  created_at: string;
  model: string;
}

interface ParsedFrontmatter {
  slug?: string;
  title?: string;
  description?: string;
  date?: string;
  author?: string;
  role?: string;
  tag?: string;
  cover?: string;
  keywords?: string[];
}

/**
 * Mirrors the parseFrontmatter helper in src/lib/posts.ts so the
 * preview's interpretation of `--- yaml ---` is identical to what
 * the production builder applies to checked-in blog files.
 */
function parseFrontmatter(raw: string): {
  data: ParsedFrontmatter;
  content: string;
} {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { data: {}, content: raw };
  const data: Record<string, unknown> = {};
  for (const line of match[1].split(/\r?\n/)) {
    const kv = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!kv) continue;
    const key = kv[1];
    let value: string = kv[2].trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (value.startsWith("[") && value.endsWith("]")) {
      const inner = value.slice(1, -1).trim();
      data[key] = inner
        ? inner
            .split(",")
            .map((s) => s.trim().replace(/^["']|["']$/g, ""))
            .filter(Boolean)
        : [];
      continue;
    }
    data[key] = value;
  }
  return { data: data as ParsedFrontmatter, content: match[2] };
}

export default function BlogPreview() {
  const { draftId } = useParams<{ draftId: string }>();
  const convex = useConvex();
  const [draft, setDraft] = useState<DraftDoc | null | "unauthorized" | "notfound">(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!draftId) return;
    const token = adminToken();
    if (!token) {
      setDraft("unauthorized");
      return;
    }
    let cancelled = false;
    convex
      .query(api.content.drafts.get, {
        adminToken: token,
        id: draftId as Id<"drafts">,
      })
      .then((d) => {
        if (cancelled) return;
        if (!d) {
          setDraft("notfound");
          return;
        }
        setDraft(d as DraftDoc);
      })
      .catch((err) => {
        if (cancelled) return;
        const msg = err instanceof Error ? err.message : String(err);
        if (msg.includes("Unauthorized")) {
          setDraft("unauthorized");
        } else {
          setError(msg);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [convex, draftId]);

  const parsed = useMemo(() => {
    if (!draft || typeof draft === "string") return null;
    const yaml = parseFrontmatter(draft.body);
    let fm: ParsedFrontmatter = {};
    try {
      fm = JSON.parse(draft.frontmatter_json) as ParsedFrontmatter;
    } catch {
      /* fall through to yaml-only */
    }
    return {
      slug: yaml.data.slug || fm.slug || "preview",
      title: yaml.data.title || fm.title || draft.title,
      description: yaml.data.description || fm.description || "",
      date: yaml.data.date || fm.date || draft.created_at.slice(0, 10),
      author: yaml.data.author || fm.author || "Digilist",
      role: yaml.data.role || fm.role,
      tag: yaml.data.tag || fm.tag,
      cover: yaml.data.cover || fm.cover,
      keywords: yaml.data.keywords || fm.keywords,
      content: yaml.content,
    };
  }, [draft]);

  if (draft === "notfound") return <Navigate to="/blogg" replace />;

  if (draft === "unauthorized") {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <p className="editorial-mono-caption text-ink-faint mb-3">
            FORHÅNDSVISNING KREVER INNLOGGING
          </p>
          <h1 className="font-serif text-3xl text-ink mb-4">
            Logg inn på admin
          </h1>
          <p className="text-sm text-ink-soft mb-6">
            Forhåndsvisning av draft-er er kun synlig for autoriserte
            administratorer. Logg inn på admin-konsollet og prøv igjen.
          </p>
          <Link
            to="/admin/intelligence"
            className="font-mono text-xs uppercase tracking-widest text-accent-text hover:underline"
          >
            → Til admin/intelligence
          </Link>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center px-4">
        <div className="max-w-md">
          <p className="editorial-mono-caption text-red-700 mb-2">FEIL</p>
          <p className="text-sm text-ink">{error}</p>
        </div>
      </div>
    );
  }

  if (!draft || typeof draft === "string" || !parsed) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center">
        <p className="font-mono text-xs uppercase tracking-widest text-ink-faint">
          Laster…
        </p>
      </div>
    );
  }

  const isBlog = draft.channel === "blog";

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <SEO
        title={`[PREVIEW] ${parsed.title} · Digilist`}
        description={parsed.description}
        robots="noindex,nofollow"
      />
      <ProgressRail />
      <Navbar />

      {/* Preview banner — unmissable, makes it obvious this is not the
          public version. */}
      <div className="sticky top-16 z-50 bg-amber-500 text-on-navy">
        <div className="container mx-auto md:px-8 lg:px-12 py-2 flex items-center justify-between gap-4 text-xs">
          <p className="font-mono uppercase tracking-widest">
            PREVIEW · DRAFT #{draft._id.slice(0, 8)} · {draft.status} ·{" "}
            {draft.channel.toUpperCase()} · {draft.model}
          </p>
          <Link
            to="/admin/intelligence/vekst/drafts"
            className="font-mono uppercase tracking-widest underline underline-offset-2"
          >
            ← Approval queue
          </Link>
        </div>
      </div>

      <PageTransition>
        <main id="main">
          <article className="pt-12 lg:pt-16 pb-16 lg:pb-24 bg-paper">
            <div className="container mx-auto md:px-8 lg:px-12">
              <nav
                className="editorial-mono-caption mb-10"
                aria-label="Brødsmuler"
              >
                <Link
                  to="/blogg"
                  className="group inline-flex items-center gap-2 text-accent-text"
                >
                  <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                  <span className="group-hover:underline underline-offset-4 decoration-[0.5px]">
                    Tilbake til blogg
                  </span>
                </Link>
              </nav>

              <header className="max-w-3xl mb-12">
                {parsed.tag && (
                  <p className="editorial-mono-caption text-accent-text mb-4">
                    {parsed.tag}
                  </p>
                )}
                <EditorialHeading as="h1" size="display" className="mb-6">
                  {parsed.title}
                </EditorialHeading>
                {parsed.description && (
                  <p className="text-xl text-ink-soft italic measure leading-relaxed mb-8">
                    {parsed.description}
                  </p>
                )}
                <Byline
                  author={parsed.author}
                  role={parsed.role}
                  date={formatPostDate(parsed.date)}
                />
              </header>

              {parsed.cover && (
                <figure className="max-w-4xl mb-14 lg:mb-20">
                  <div className="relative aspect-[16/9] overflow-hidden rounded-sm border border-hairline-strong bg-navy">
                    <img
                      src={parsed.cover}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                  <figcaption className="mt-3 editorial-mono-caption text-ink-faint">
                    FIG. · {parsed.tag ?? "Illustrasjon"}
                  </figcaption>
                </figure>
              )}

              <div className="post-body max-w-3xl">
                {isBlog ? (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {parsed.content}
                  </ReactMarkdown>
                ) : (
                  // LinkedIn/X drafts are plain text — render as
                  // monospace so reviewers see what the platform
                  // will actually post.
                  <pre className="whitespace-pre-wrap font-mono text-sm text-ink bg-paper-strong border border-hairline rounded-sm p-5">
                    {parsed.content}
                  </pre>
                )}
              </div>
            </div>
          </article>
        </main>
      </PageTransition>
      <Footer />
    </div>
  );
}

// Avoid the linter griping about AUTH_KEY being imported but unused —
// kept exported from the module so we don't lose the contract.
export { AUTH_KEY };
