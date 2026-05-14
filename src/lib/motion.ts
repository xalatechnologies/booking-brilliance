import type { Variants, Transition } from "framer-motion";

const editorialEase: Transition["ease"] = [0.22, 1, 0.36, 1];

export const revealUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.72, ease: editorialEase },
  },
};

export const revealFade: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.72, ease: editorialEase },
  },
};

export const staggerParent: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

export const staggerChild: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.72, ease: editorialEase },
  },
};

export const viewportOnce = {
  once: true,
  amount: 0.05,
  margin: "0px 0px 0px 0px",
};

/** Page-enter transition for routed pages */
export const pageEnter: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: editorialEase },
  },
};

/** List-item hover with magnetic translate + underline reveal */
export const listItemHover: Variants = {
  rest: { x: 0 },
  hover: { x: 6, transition: { duration: 0.4, ease: editorialEase } },
};

export const arrowDart: Variants = {
  rest: { x: 0, y: 0, opacity: 0.6 },
  hover: {
    x: 4,
    y: -4,
    opacity: 1,
    transition: { duration: 0.35, ease: editorialEase },
  },
};
