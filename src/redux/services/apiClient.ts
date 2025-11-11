import { BlockContent, BlocksResponse, Media, MediaResponse } from "@/types/blocks";

// Core type definitions
export type SideBarData = {
  title: string;
  subTitle: string;
  paragraph: string;
  content: string;
};

export type MetaData = [];

export type WebsiteData = {
  id: number;
  metaData: [];
  title: string;
  footer: string;
  websiteName: string;
};

// Environment-based API URL configuration
const getApiUrl = (): string => {
  if (process.env.NODE_ENV === "production") {
    return process.env.NEXT_PUBLIC_API_URL as string;
  }
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:9000";
};

export const API_URL = getApiUrl();

/**
 * Fetch blocks for a specific domain and page
 * Uses the existing /web/website endpoint
 */
export const getBlocks = async (domain: string, slug: string = 'home'): Promise<BlockContent[]> => {
  try {
    const response = await fetch(`${API_URL}/web/website/${domain}/${slug}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch blocks: ${response.statusText}`);
    }

    const data = await response.json();
    
    // The API returns: { blocks: [...], title: "Home", ... }
    // Each block has: block.content.content (nested structure)
    if (data.blocks && Array.isArray(data.blocks)) {
      return data.blocks.map((block: any, index: number) => {
        // The actual content is nested: block.content.content
        const blockContent = block.content?.content || {};
        const blockSettings = block.content?.settings || {};
        const blockMetadata = block.content?.metadata || {};
        
        return {
          id: index + 1,
          status: "published",
          sort: blockMetadata.sort || null,
          user_created: blockMetadata.user_created || "",
          date_created: blockMetadata.date_created || data.published_at || new Date().toISOString(),
          user_updated: blockMetadata.user_updated || "",
          date_updated: blockMetadata.date_updated || data.published_at || new Date().toISOString(),
          imgSrc: blockContent.imgSrc || null,
          title: blockContent.title || block.name || "",
          author: blockContent.author || "",
          desc: blockContent.desc || "",
          layoutType: blockSettings.layoutType || 1,
          imageAWSs3: blockContent.imageAWSs3 || { filename_disk: "" }
        };
      });
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching blocks:', error);
    return [];
  }
};

/**
 * Fetch public media files from the public web endpoint
 */
export const getPublicMedias = async (limit: number = 20): Promise<Media[]> => {
  try {
    const response = await fetch(
      `${API_URL}/web/media?limit=${limit}&random=true`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch media: ${response.statusText}`);
    }

    const data: MediaResponse = await response.json();
    
    // Media is already randomized by the backend
    return data.medias || [];
  } catch (error) {
    console.error('Error fetching media:', error);
    return [];
  }
};

// Legacy functions - kept for backward compatibility
export const getWebsiteTitleAndFooter = async (): Promise<WebsiteData[]> => {
  // Implement if needed
  return [];
};

export const getSidebarData = async (ID: number): Promise<SideBarData> => {
  // Implement if needed
  throw new Error("Not implemented");
};

export const getMetaData = async (id: number): Promise<MetaData> => {
  // Implement if needed
  return [];
};
