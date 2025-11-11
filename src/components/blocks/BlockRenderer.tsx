"use client";

import React, { useRef, useEffect, useState } from 'react';
import { BlockContent, Media } from '@/types/blocks';
import { getPublicMedias } from '@redux/services/apiClient';

interface BlockRendererProps {
  block: BlockContent;
  baseUrl?: string;
}

/**
 * BlockRenderer - Dynamically renders blocks based on layoutType
 * Supports 4 different layout types with responsive design
 */
const BlockRenderer: React.FC<BlockRendererProps> = ({ block }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [randomMedia, setRandomMedia] = useState<Media | null>(null);
  const blockRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (blockRef.current) {
      observer.observe(blockRef.current);
    }

    return () => {
      if (blockRef.current) {
        observer.unobserve(blockRef.current);
      }
    };
  }, []);

  // Fetch random media on mount
  useEffect(() => {
    const fetchRandomMedia = async () => {
      try {
        const medias = await getPublicMedias(1); // Get 1 random media
        if (medias && medias.length > 0) {
          setRandomMedia(medias[0]);
        }
      } catch (error) {
        console.error('Error fetching random media:', error);
      }
    };

    fetchRandomMedia();
  }, []);

  const { title, desc, author } = block;
  const layoutType = block.layoutType || 1;

  // Construct image URL from random media
  const imageUrl = randomMedia?.file_path
    ? `${process.env.NEXT_PUBLIC_AWS_S3}${randomMedia.file_path}`
    : randomMedia?.filename_disk
      ? `${process.env.NEXT_PUBLIC_AWS_S3}/${randomMedia.filename_disk}`
      : '';

  // Layout Type 1: Image left, content right
  const LayoutType1 = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
      <div className="relative w-full h-[300px] md:h-[400px] rounded-2xl overflow-hidden group">
        <img 
          src={imageUrl} 
          alt={title}
          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
        />
      </div>
      <div className="space-y-4">
        <h2 className="font-nexa text-5xl md:text-6xl lg:text-7xl lowercase leading-tight">
          {block.title}
        </h2>
        <p className="text-sm md:text-base text-white/80 font-mono">
          {block.author}
        </p>
        <p className="text-base md:text-lg text-white/90">
          {block.desc}
        </p>
      </div>
    </div>
  );

  // Layout Type 2: Content left, image right
  const LayoutType2 = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
      <div className="space-y-4 md:text-right order-2 md:order-1">
        <h2 className="font-nexa text-5xl md:text-6xl lg:text-7xl lowercase leading-tight">
          {block.title}
        </h2>
        <p className="text-sm md:text-base text-white/80 font-mono">
          {block.author}
        </p>
        <p className="text-base md:text-lg text-white/90">
          {block.desc}
        </p>
      </div>
      <div className="relative w-full h-[300px] md:h-[400px] rounded-2xl overflow-hidden group order-1 md:order-2">
        <img 
          src={imageUrl} 
          alt={block.title}
          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
        />
      </div>
    </div>
  );

  // Layout Type 3: Stacked with image on top
  const LayoutType3 = () => (
    <div className="space-y-6">
      <div className="relative w-full h-[250px] md:h-[350px] rounded-2xl overflow-hidden group">
        <img 
          src={imageUrl} 
          alt={block.title}
          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
        />
      </div>
      <div className="space-y-4 text-center">
        <p className="text-sm md:text-base text-white/80 font-mono">
          {block.author}
        </p>
        <h2 className="font-nexa text-5xl md:text-6xl lg:text-7xl lowercase leading-tight">
          {block.title}
        </h2>
        <p className="text-base md:text-lg text-white/90 max-w-2xl mx-auto">
          {block.desc}
        </p>
      </div>
    </div>
  );

  // Layout Type 4: Centered with background image
  const LayoutType4 = () => (
    <div className="relative min-h-[500px] md:min-h-[600px] rounded-2xl overflow-hidden flex items-center justify-center">
      {/* Background image */}
      <div className="absolute inset-0">
        <img 
          src={imageUrl} 
          alt={block.title}
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent" />
      </div>
      
      {/* Content overlay */}
      <div className="relative z-10 text-center space-y-6 px-4 md:px-8 max-w-3xl">
        <h2 className="font-nexa text-5xl md:text-6xl lg:text-8xl lowercase leading-tight">
          {block.title}
        </h2>
        <p className="text-base md:text-xl text-white/90 font-mono">
          {block.author}
        </p>
        <p className="text-lg md:text-2xl text-white">
          {block.desc}
        </p>
      </div>
    </div>
  );

  const renderLayout = () => {
    switch (block.layoutType) {
      case 1:
        return <LayoutType1 />;
      case 2:
        return <LayoutType2 />;
      case 3:
        return <LayoutType3 />;
      case 4:
        return <LayoutType4 />;
      default:
        return <LayoutType1 />;
    }
  };

  return (
    <div 
      ref={blockRef}
      className="w-full min-h-screen flex items-center justify-center px-4 md:px-8 lg:px-16 py-16 opacity-0 translate-y-10 transition-all duration-700"
    >
      <div className="w-full max-w-7xl">
        {renderLayout()}
      </div>
    </div>
  );
};

export default BlockRenderer;
