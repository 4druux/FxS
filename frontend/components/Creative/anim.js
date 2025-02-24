// lib/animations/button.js
export const buttonAnimation = {
  initial: {
    width: 2,
    left: "1.15rem",
  },
  enter: {
    width: "100%",
    left: 0,
    transition: {
      duration: 0.5,
      ease: [0.76, 0, 0.24, 1],
    },
  },
  exit: {
    width: 2,
    left: "calc(100% - 1.15rem)",
    transition: {
      duration: 0.5,
      ease: [0.76, 0, 0.24, 1],
    },
  },
};

export const textAnimation = {
  initial: {
    x: 0,
  },
  enter: {
    x: -20,
    transition: {
      duration: 0.5,
      ease: [0.76, 0, 0.24, 1],
    },
  },
  exit: {
    x: 0,
    transition: {
      duration: 0.5,
      ease: [0.76, 0, 0.24, 1],
    },
  },
};
