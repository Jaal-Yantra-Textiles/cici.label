"use client";

import React, { useState, useEffect } from 'react';
import { Media } from '@/types/blocks';

interface MediaGalleryProps {
  limit?: number;
  apiUrl?: string;
}

/**
 * MediaGallery - Displays media files in a random masonry grid
 * Fetches public media from JYT backend
 */
export const MediaGallery: React.FC<MediaGalleryProps> = ({ 
  limit = 20,
  apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9000'
}) => {
  const [medias, setMedias] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMedias = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${apiUrl}/web/media?limit=${limit}&random=true`
        );
        console.log(response)
        if (!response.ok) {
          throw new Error('Failed to fetch media');
        }

        const data = await response.json();
        
        // Media is already randomized by the backend
        setMedias(data.medias || []);
      } catch (err) {
        console.error('Error fetching media:', err);
        setError(err instanceof Error ? err.message : 'Failed to load media');
      } finally {
        setLoading(false);
      }
    };

    fetchMedias();
  }, [limit, apiUrl]);

  if (loading) {
    return (
      <div className="w-full py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-nexa text-4xl md:text-5xl lowercase text-center mb-12">
            Loading Gallery...
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div 
                key={i} 
                className="aspect-square bg-white/10 rounded-lg animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-white/70">Unable to load gallery</p>
        </div>
      </div>
    );
  }

  if (medias.length === 0) {
    return null;
  }

  return (
    <div className="w-full py-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-nexa text-4xl md:text-6xl lowercase text-center mb-12 animate-float">
          Our Gallery
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {medias.map((media, index) => {
            // Construct image URL using file_path or filename_disk
            const imageUrl = media.file_path 
              ? `${process.env.NEXT_PUBLIC_AWS_S3}${media.file_path}`
              : media.filename_disk
                ? `${process.env.NEXT_PUBLIC_AWS_S3}/${media.filename_disk}`
                : '';

            return (
              <div 
                key={media.id || index}
                className="relative group overflow-hidden rounded-lg aspect-square bg-white/5 hover:scale-105 transition-transform duration-300"
                style={{
                  animationDelay: `${index * 0.1}s`
                }}
              >
                <img 
                  src={imageUrl}
                  alt={media.alt_text || media.title || media.filename || `Gallery image ${index + 1}`}
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                  loading="lazy"
                  onError={(e) => {
                    // Hide broken images
                    e.currentTarget.style.display = 'none';
                  }}
                />
                
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <p className="text-sm text-white/90 truncate">
                    {media.title || media.filename || 'Image'}
                  </p>
                  {media.caption && (
                    <p className="text-xs text-white/70 truncate mt-1">
                      {media.caption}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MediaGallery;
