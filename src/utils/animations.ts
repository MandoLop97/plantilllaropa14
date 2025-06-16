
/**
 * Animation utilities
 */

export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.3 }
};

export const slideInFromLeft = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.4 }
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.3 }
};

export const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

// Additional exports needed by components
export const animationVariants = {
  fadeIn,
  fadeInUp,
  slideInFromLeft,
  scaleIn,
  staggerChildren
};

export const transitionConfig = {
  smooth: { duration: 0.3, ease: "easeOut" },
  productGrid: { duration: 0.2, ease: "easeOut" },
  spring: { type: "spring", stiffness: 400, damping: 25 }
};

export const createStaggerDelay = (index: number) => ({
  delay: index * 0.1
});
