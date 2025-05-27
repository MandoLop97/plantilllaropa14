
export const scrollToElement = (elementId: string, options?: ScrollIntoViewOptions) => {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      ...options
    });
  }
};

export const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
