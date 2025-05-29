
import { APP_CONFIG } from '../constants/app';

export const animationVariants = {
  fadeIn: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  },
  
  scaleIn: {
    initial: { opacity: 0, scale: 0.9, y: 30 },
    animate: { opacity: 1, scale: 1, y: 0 }
  },
  
  slideIn: {
    initial: { opacity: 0, height: 0, y: -10 },
    animate: { opacity: 1, height: "auto", y: 0 },
    exit: { opacity: 0, height: 0, y: -10 }
  }
};

export const transitionConfig = {
  smooth: { 
    duration: APP_CONFIG.ANIMATION_DELAYS.CATEGORY_TRANSITION,
    ease: [0.25, 0.46, 0.45, 0.94]
  },
  
  accordion: { 
    duration: 0.4, 
    ease: [0.4, 0.0, 0.2, 1],
    height: { duration: 0.3 }
  },
  
  productGrid: {
    duration: APP_CONFIG.ANIMATION_DELAYS.PRODUCT_ANIMATION,
    ease: [0.25, 0.46, 0.45, 0.94]
  }
};

export const createStaggerDelay = (index: number, baseDelay: number = APP_CONFIG.ANIMATION_DELAYS.PRODUCT_GRID_DELAY) => ({
  delay: index * baseDelay
});
