"use client";

import { useEffect, useState, useRef } from "react";

interface ScrambleTextProps {
  text: string;
  className?: string;
  delay?: number;
}

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&";

export function ScrambleText({ text, className = "", delay = 0 }: ScrambleTextProps) {
  const [displayed, setDisplayed] = useState("");
  const frameRef = useRef(0);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    let frame = 0;
    const totalFrames = text.length * 3;

    const start = () => {
      const interval = setInterval(() => {
        frame++;
        const progress = frame / totalFrames;
        const resolved = Math.floor(progress * text.length);

        let result = "";
        for (let i = 0; i < text.length; i++) {
          if (i < resolved) {
            result += text[i];
          } else if (text[i] === " ") {
            result += " ";
          } else {
            result += CHARS[Math.floor(Math.random() * CHARS.length)];
          }
        }

        setDisplayed(result);
        frameRef.current = frame;

        if (frame >= totalFrames) {
          setDisplayed(text);
          clearInterval(interval);
        }
      }, 30);

      return interval;
    };

    timeout = setTimeout(() => {
      const interval = start();
      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timeout);
  }, [text, delay]);

  return <span className={className}>{displayed || text}</span>;
}
