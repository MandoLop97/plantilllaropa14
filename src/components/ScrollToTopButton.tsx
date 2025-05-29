import React, { useEffect, useState } from 'react';
import { ChevronUp } from 'lucide-react';
import { scrollToTop } from '../utils/scroll';

const ScrollToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      aria-label="Volver al inicio"
      className="fixed bottom-6 right-6 bg-picton-blue-600 text-white rounded-full p-3 shadow-lg hover:bg-picton-blue-700 transition-all duration-200 z-40"
    >
      <ChevronUp size={20} />
    </button>
  );
};

export default ScrollToTopButton;
