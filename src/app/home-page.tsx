"use client";

import React, { useState, useEffect } from "react";
import { BlockContent, Media } from "@/types/blocks";
import { getBlocks, getPublicMedias } from "@redux/services/apiClient";
import { ShaderAnimation } from "@/components/ui/shader-animation";
import { ThreeJsGallery } from "@/components/ui/threejs-gallery";
import { CursiveText } from "@/components/ui/cursive-text";
import BlockRenderer from "@/components/blocks/BlockRenderer";

interface HomeProps {
  domain?: string;
  slug?: string;
}

const Home: React.FC<HomeProps> = ({ 
  domain = process.env.NEXT_PUBLIC_DOMAIN || "cicilabel.com",
  slug = "home" 
}) => {
  const [blocks, setBlocks] = useState<BlockContent[]>([]);
  const [medias, setMedias] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch blocks and media in parallel
        const [blocksData, mediasData] = await Promise.all([
          getBlocks(domain, slug),
          getPublicMedias(20)
        ]);
        
        console.log('Blocks:', blocksData);
        console.log('Medias:', mediasData);
        
        setBlocks(blocksData || []);
        setMedias(mediasData || []);
        setError(null);
      } catch (err) {
        console.error('Error loading data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load content');
        setBlocks([]);
        setMedias([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [domain, slug]);

  if (loading) {
    return (
      <>
        <ShaderAnimation />
        <main className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="loading" />
            <p className="mt-4 text-white/70">Loading...</p>
          </div>
        </main>
      </>
    );
  }

  if (error) {
    return (
      <>
        <ShaderAnimation />
        <main className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center max-w-2xl">
            <h1 className="font-nexa text-4xl md:text-6xl lowercase mb-4">
              Oops!
            </h1>
            <p className="text-white/70">
              Unable to load content. Please try again later.
            </p>
          </div>
        </main>
      </>
    );
  }

  return (
    <div className="relative min-h-screen">
      {/* Shader Background Animation */}
      <div className="fixed inset-0 z-0 opacity-30">
        <ShaderAnimation />
      </div>

      {/* Content */}
      <main className="relative z-10">
        {/* Cursive Writing Animation */}
        <CursiveText />

        {/* Blocks */}
        {blocks.length > 0 ? (
          blocks.map((block, index) => (
            <BlockRenderer key={block.id || index} block={block} />
          ))
        ) : (
          <div className="min-h-screen flex items-center justify-center px-4">
            <div className="text-center">
              <h1 className="font-nexa text-4xl md:text-6xl lowercase mb-4">
                Welcome
              </h1>
              <p className="text-white/70">
                Content coming soon...
              </p>
            </div>
          </div>
        )}

        {/* Three.js Gallery */}
        {medias.length > 0 && (
          <ThreeJsGallery medias={medias} />
        )}
      </main>
    </div>
  );
};

export default Home;
