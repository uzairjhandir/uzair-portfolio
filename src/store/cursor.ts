import { create } from 'zustand';

export type CursorMode = 'default' | 'hover' | 'text' | 'image' | 'video' | 'hidden';

interface CursorState {
  mode: CursorMode;
  text?: string;
  image?: string;
  video?: string;
  setMode: (mode: CursorMode) => void;
  setCursorData: (data: { text?: string; image?: string; video?: string }) => void;
  resetCursor: () => void;
}

export const useCursorStore = create<CursorState>((set) => ({
  mode: 'default',
  text: undefined,
  image: undefined,
  video: undefined,
  setMode: (mode) => set({ mode }),
  setCursorData: (data) => set((state) => ({ ...state, ...data })),
  resetCursor: () => set({ mode: 'default', text: undefined, image: undefined, video: undefined }),
}));
