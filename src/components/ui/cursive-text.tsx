"use client"

import { useEffect, useRef, useState } from "react"

export function CursiveText() {
  const [visibleLetters, setVisibleLetters] = useState(0)
  const text = "cici label"
  
  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleLetters(prev => {
        if (prev < text.length) {
          return prev + 1
        }
        return prev
      })
    }, 150) // Each letter appears every 150ms

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="w-full min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="font-nexa text-6xl sm:text-8xl md:text-9xl lg:text-[10rem] xl:text-[12rem] lowercase tracking-[0.15em] text-white leading-none">
          {text.split('').map((letter, index) => (
            <span
              key={index}
              className={`inline-block transition-all duration-700 ${
                index < visibleLetters 
                  ? 'opacity-100 translate-y-0 scale-100' 
                  : 'opacity-0 translate-y-8 scale-50'
              }`}
              style={{
                transitionDelay: `${index * 50}ms`,
                animation: index < visibleLetters 
                  ? `drawLetter 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${index * 150}ms forwards`
                  : 'none'
              }}
            >
              {letter === ' ' ? '\u00A0' : letter}
            </span>
          ))}
        </h1>
        
        <p className="text-white/60 text-sm md:text-base tracking-widest uppercase mt-8 opacity-0 animate-fadeIn" style={{ animationDelay: '2s' }}>
          Scroll to explore
        </p>
      </div>

      <style jsx>{`
        @keyframes drawLetter {
          0% {
            opacity: 0;
            transform: translateY(30px) scale(0.8) rotate(-5deg);
            filter: blur(4px);
          }
          50% {
            opacity: 0.5;
            filter: blur(2px);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1) rotate(0deg);
            filter: blur(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 0.6;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 1s ease-out forwards;
        }

        /* Add a subtle glow effect */
        h1 span {
          text-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </div>
  )
}
