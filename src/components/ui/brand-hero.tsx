"use client"

import { useEffect, useState } from "react"

export function BrandHero() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Calculate opacity and scale based on scroll
  const opacity = Math.max(0, 1 - scrollY / 500)
  const scale = Math.max(0.8, 1 - scrollY / 2000)

  return (
    <div className="w-full min-h-screen flex items-center justify-center px-4">
      <div 
        className="text-center"
        style={{
          opacity,
          transform: `scale(${scale})`,
          transition: 'opacity 0.1s ease-out, transform 0.1s ease-out'
        }}
      >
        <h1 className="font-nexa text-8xl sm:text-9xl md:text-[10rem] lg:text-[12rem] xl:text-[14rem] lowercase tracking-[0.2em] text-white mb-4 animate-float leading-none">
          cici label
        </h1>
        <p className="text-white/60 text-sm md:text-base tracking-widest uppercase">
          Scroll to explore
        </p>
      </div>
    </div>
  )
}
