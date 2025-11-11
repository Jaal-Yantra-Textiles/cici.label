/**
 * Block Type Definitions for cici.label
 * Based on the content structure from JYT backend
 */

export type LayoutType = 1 | 2 | 3 | 4;

export interface ImageAWSS3 {
  filename_disk: string;
}

export interface BlockContent {
  id: number;
  status: 'published' | 'draft';
  sort: number | null;
  user_created: string;
  date_created: string;
  user_updated: string;
  date_updated: string;
  imgSrc: string | null;
  title: string;
  author: string;
  desc: string;
  layoutType: LayoutType;
  imageAWSs3: ImageAWSS3;
}

export interface BlocksResponse {
  data: BlockContent[];
}

/**
 * Media Type Definitions
 */
export interface Media {
  id: string;
  filename: string;
  filename_disk: string;
  file_path: string;
  type?: string;
  mime_type?: string;
  filesize?: number;
  width?: number;
  height?: number;
  title?: string;
  description?: string;
  alt_text?: string;
  caption?: string;
  url?: string; // Legacy field
  is_public?: boolean;
}

export interface MediaResponse {
  medias: Media[];
  count: number;
}

/**
 * API Response Types
 */
export interface ApiError {
  message: string;
  errors?: any[];
}
