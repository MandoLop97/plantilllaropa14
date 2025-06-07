
/**
 * Scroll utilities
 */

export const scrollToTop = (smooth = true): void => {
  window.scrollTo({
    top: 0,
    behavior: smooth ? 'smooth' : 'auto'
  });
};

export const scrollToElement = (elementId: string, smooth = true): void => {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({
      behavior: smooth ? 'smooth' : 'auto',
      block: 'start'
    });
  }
};

export const scrollToBottom = (smooth = true): void => {
  window.scrollTo({
    top: document.body.scrollHeight,
    behavior: smooth ? 'smooth' : 'auto'
  });
};
