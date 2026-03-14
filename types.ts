
export interface ImageState {
  original: string | null;
  current: string | null;
  history: string[];
}

export interface GenerationStatus {
  loading: boolean;
  error: string | null;
  message: string;
}

declare global {
  interface Window {
    aistudio?: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}
