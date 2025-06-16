
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

  const handleClick = () => {
    scrollToTop();
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={handleClick}
      aria-label="Volver al inicio"
      className="fixed bottom-6 right-6 bg-primary-500 text-primary-50 rounded-full p-3 shadow-lg hover:shadow-xl hover:bg-primary-600 active:bg-primary-700 transition-all duration-200 z-40 border border-primary-400"
    >
      <ChevronUp size={20} />
    </button>
  );
};

export default ScrollToTopButton;
