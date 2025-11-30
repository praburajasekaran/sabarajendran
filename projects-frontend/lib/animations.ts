/**
 * Animation Configuration
 * Framer Motion variants and animation utilities for smooth, performant animations
 * All animations respect prefers-reduced-motion for accessibility
 */

import { Variants, Transition } from "framer-motion";

// Standard easing curves
export const easings = {
  easeInOut: [0.4, 0, 0.2, 1],
  easeOut: [0, 0, 0.2, 1],
  easeIn: [0.4, 0, 1, 1],
  sharp: [0.4, 0, 0.6, 1],
} as const;

// Standard transition durations (in seconds)
export const durations = {
  fast: 0.15,
  normal: 0.3,
  slow: 0.5,
} as const;

// Base transition configuration
export const baseTransition: Transition = {
  duration: durations.normal,
  ease: easings.easeInOut,
};

/**
 * Page Transition Variants
 * For smooth transitions between pages/routes
 */
export const pageTransition: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: durations.normal,
      ease: easings.easeOut,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: durations.fast,
      ease: easings.easeIn,
    },
  },
};

/**
 * Fade In Variants
 * Simple fade in animation
 */
export const fadeIn: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: baseTransition,
  },
  exit: {
    opacity: 0,
    transition: {
      duration: durations.fast,
    },
  },
};

/**
 * Slide Up Variants
 * Slide up from bottom with fade
 */
export const slideUp: Variants = {
  initial: {
    opacity: 0,
    y: 24,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: baseTransition,
  },
  exit: {
    opacity: 0,
    y: -24,
    transition: {
      duration: durations.fast,
    },
  },
};

/**
 * Scale In Variants
 * Scale up from center with fade
 */
export const scaleIn: Variants = {
  initial: {
    opacity: 0,
    scale: 0.95,
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: baseTransition,
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: durations.fast,
    },
  },
};

/**
 * Stagger Container Variants
 * For staggered children animations (like project grids)
 */
export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.05, // 50ms delay between children
      delayChildren: 0.1, // Start after 100ms
    },
  },
  exit: {
    transition: {
      staggerChildren: 0.03,
      staggerDirection: -1, // Reverse order on exit
    },
  },
};

/**
 * Stagger Item Variants
 * For individual items in a staggered container
 */
export const staggerItem: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: baseTransition,
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: {
      duration: durations.fast,
    },
  },
};

/**
 * Card Hover Variants
 * Subtle lift effect for cards
 */
export const cardHover: Variants = {
  initial: {
    y: 0,
    boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  },
  hover: {
    y: -4,
    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    transition: {
      duration: durations.fast,
      ease: easings.easeOut,
    },
  },
};

/**
 * Drawer/Slide In Variants
 * For mobile filter drawer, modals, etc.
 */
export const drawerSlide: Variants = {
  initial: {
    x: "100%",
  },
  animate: {
    x: 0,
    transition: {
      duration: durations.normal,
      ease: easings.easeOut,
    },
  },
  exit: {
    x: "100%",
    transition: {
      duration: durations.fast,
      ease: easings.easeIn,
    },
  },
};

/**
 * Backdrop Variants
 * For overlay backgrounds behind modals/drawers
 */
export const backdrop: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      duration: durations.fast,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: durations.fast,
    },
  },
};

/**
 * Toast Notification Variants
 * For toast/notification sliding in from top
 */
export const toastSlide: Variants = {
  initial: {
    opacity: 0,
    y: -100,
    scale: 0.95,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: durations.normal,
      ease: easings.easeOut,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.95,
    transition: {
      duration: durations.fast,
      ease: easings.easeIn,
    },
  },
};

/**
 * Pulse Animation
 * For loading indicators
 */
export const pulse: Variants = {
  initial: {
    opacity: 1,
  },
  animate: {
    opacity: [1, 0.5, 1],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: easings.easeInOut,
    },
  },
};

/**
 * Skeleton Loading Variants
 * Shimmer effect for skeleton screens
 */
export const shimmer: Variants = {
  initial: {
    backgroundPosition: "-1000px 0",
  },
  animate: {
    backgroundPosition: "1000px 0",
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "linear",
    },
  },
};

/**
 * Badge/Count Transition Variants
 * For animating number changes in badges
 */
export const countChange: Variants = {
  initial: {
    scale: 1,
  },
  animate: {
    scale: [1, 1.2, 1],
    transition: {
      duration: 0.3,
      ease: easings.easeOut,
    },
  },
};

/**
 * Get reduced motion preference
 * Returns true if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Create motion-safe transition
 * Respects prefers-reduced-motion by disabling animations
 */
export function safeTransition(transition: Transition): Transition {
  if (prefersReducedMotion()) {
    return {
      duration: 0.01,
    };
  }
  return transition;
}

/**
 * Create motion-safe variants
 * Respects prefers-reduced-motion by simplifying animations
 */
export function safeVariants(variants: Variants): Variants {
  if (prefersReducedMotion()) {
    return {
      initial: { opacity: 0 },
      animate: { opacity: 1, transition: { duration: 0.01 } },
      exit: { opacity: 0, transition: { duration: 0.01 } },
    };
  }
  return variants;
}
