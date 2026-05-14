import { motion, useReducedMotion } from "framer-motion";
import { ReactNode } from "react";
import { pageEnter } from "@/lib/motion";

interface Props {
  children: ReactNode;
  className?: string;
}

const PageTransition = ({ children, className }: Props) => {
  const reduced = useReducedMotion();
  if (reduced) return <>{children}</>;
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={pageEnter}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
