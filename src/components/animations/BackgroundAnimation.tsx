"use client";

import React from 'react';

/**
 * Modern gradient blob animation background
 * Replaces the heavy anime.js SVG morphing with lightweight CSS animations
 */
export const BackgroundAnimation: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Base gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-secondary to-tertiary animate-gradient-shift" 
           style={{ backgroundSize: '200% 200%' }} />
      
      {/* Floating blob elements */}
      <div className="absolute inset-0 opacity-40">
        {/* Blob 1 - Purple */}
        <div 
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl animate-blob"
        />
        
        {/* Blob 2 - Blue */}
        <div 
          className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"
        />
        
        {/* Blob 3 - Pink */}
        <div 
          className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"
        />
      </div>

      {/* Subtle overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/50 to-transparent" />
    </div>
  );
};

export default BackgroundAnimation;
