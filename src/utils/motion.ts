export const MOTION = {
  instant: 0.1,
  micro: 0.15,
  fast: 0.2,
  normal: 0.3,
  medium: 0.45,
  cinematic: 0.7,
  dramatic: 1.0,
  epic: 1.5
};

export const EASING = {
  smooth: [0.22, 1, 0.36, 1] as const,
  enter: [0.16, 1, 0.3, 1] as const,
  exit: [0.7, 0, 0.84, 0] as const,
  cinematic: [0.19, 1, 0.22, 1] as const,
  dramatic: [0.12, 0.8, 0.25, 1] as const,
  linear: [0, 0, 1, 1] as const
};

export const SPRING = {
  micro: { type: "spring" as const, stiffness: 500, damping: 25, mass: 0.7 },
  bouncy: { type: "spring" as const, stiffness: 300, damping: 18, mass: 0.8 },
  heavy: { type: "spring" as const, stiffness: 280, damping: 16 }
};

export const PAGE_TRANSITION = {
  initial: { opacity: 0, y: 24, scale: 0.97 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: MOTION.medium, ease: EASING.enter } },
  exit: { opacity: 0, scale: 0.96, y: 10, transition: { duration: MOTION.fast, ease: EASING.exit } }
};

export const STAGGER_CHILD = {
  initial: { opacity: 0, y: 24, scale: 0.97 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: MOTION.medium, ease: EASING.enter } }
};
