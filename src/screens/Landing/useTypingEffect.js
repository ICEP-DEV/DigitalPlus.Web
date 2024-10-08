import { useState, useEffect } from 'react';

const useTypingEffect = (text, typingSpeed = 100, erasingSpeed = 50) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isErasing, setIsErasing] = useState(false);
  const [textIndex, setTextIndex] = useState(0);
  
  useEffect(() => {
    let timeout;
    
    const handleTyping = () => {
      if (!isErasing && textIndex < text.length) {
        // Typing effect
        setDisplayedText((prev) => prev + text[textIndex]);
        setTextIndex((prev) => prev + 1);
      } else if (isErasing && textIndex > 0) {
        // Erasing effect
        setDisplayedText((prev) => prev.slice(0, -1));
        setTextIndex((prev) => prev - 1);
      } else if (textIndex === text.length) {
        // Pause after completing the typing before erasing
        timeout = setTimeout(() => setIsErasing(true), 1000);
      } else if (textIndex === 0 && isErasing) {
        // Pause after erasing before re-typing
        timeout = setTimeout(() => setIsErasing(false), 500);
      }
    };

    // Choose typing or erasing speed based on the current action
    const speed = isErasing ? erasingSpeed : typingSpeed;
    timeout = setTimeout(handleTyping, speed);

    return () => clearTimeout(timeout);
  }, [textIndex, isErasing, text, typingSpeed, erasingSpeed]);

  return displayedText;
};

export default useTypingEffect;
