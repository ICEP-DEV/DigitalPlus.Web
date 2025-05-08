import { useEffect, useRef } from 'react';

export const useScrollAnimation = (threshold = 0.1) => {
  const ref = useRef(null);
  const animatedElements = useRef(new Set());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const elements = entry.target.querySelectorAll('[data-animate]');
            elements.forEach((el) => {
              
              if (animatedElements.current.has(el)) return;
              
              const animationClass = el.getAttribute('data-animate');
              const delay = el.getAttribute('data-delay') || 0;
              
              // Reset animation state
              el.style.opacity = '0';
              el.style.transform = 'translateY(20px)';
              el.style.transition = 'all 0.6s ease-out';
              
              setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
                el.classList.add(animationClass);
                animatedElements.current.add(el); 
              }, delay * 1000);
            });
          }
        });
      },
      { 
        threshold: threshold,
        rootMargin: '0px 0px -50px 0px' 
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
      // Clear the Set when component unmounts
      animatedElements.current.clear();
    };
  }, [threshold]);

  return ref;
};