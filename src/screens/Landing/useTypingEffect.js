// useTypingEffect.js
import { useEffect, useState } from "react";

const useTypingEffect = (text, typingSpeed, erasingSpeed) => {
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  useEffect(() => {
    const handleTyping = () => {
      if (isTyping) {
        if (currentTextIndex < text.length) {
          setDisplayText((prev) => prev + text[currentTextIndex]);
          setCurrentTextIndex((prev) => prev + 1);
        } else {
          setIsTyping(false);
          setTimeout(() => {
            setIsTyping(true);
            setCurrentTextIndex(0);
          }, 1000); // Pause before erasing
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText((prev) => prev.slice(0, -1));
        } else {
          setIsTyping(true);
          setCurrentTextIndex(0);
        }
      }
    };

    const typingInterval = setInterval(handleTyping, isTyping ? typingSpeed : erasingSpeed);
    return () => clearInterval(typingInterval);
  }, [isTyping, currentTextIndex, displayText, text, typingSpeed, erasingSpeed]);

  return displayText;
};

export default useTypingEffect;