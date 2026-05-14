import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

/**
 * On route change:
 *   - If the URL has a hash, smooth-scroll to that anchor.
 *   - Otherwise jump (or smooth-scroll on short distances) to the top.
 * Honors prefers-reduced-motion.
 */
const ScrollToTop = () => {
  const { pathname, hash, key } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace(/^#/, "");
      const tryScroll = (attempt: number) => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({
            behavior: prefersReducedMotion() ? "auto" : "smooth",
            block: "start",
          });
          return;
        }
        if (attempt < 8) {
          setTimeout(() => tryScroll(attempt + 1), 60);
        }
      };
      tryScroll(0);
      return;
    }

    const reduced = prefersReducedMotion();
    const distance = window.scrollY;
    if (!reduced && distance < 2000) {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }
  }, [pathname, hash, key]);

  return null;
};

export default ScrollToTop;
