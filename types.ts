export enum UploadType {
  PERSON = 'PERSON',
  GARMENT = 'GARMENT',
}

export interface ImageState {
  file: File | null;
  previewUrl: string | null;
  base64: string | null;
}

export interface GenerationResult {
  imageUrl: string | null;
  error: string | null;
}
