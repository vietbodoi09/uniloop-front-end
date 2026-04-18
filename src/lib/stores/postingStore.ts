import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface PostingDraft {
  title: string;
  description: string;
  listingType: "sell" | "exchange";
  condition: "new" | "like_new" | "used" | "for_parts";
  price?: number;
  subjectId?: string | null;
  images: string[];
  locationLabel: string;
  lat?: number;
  lng?: number;
}

interface PostingState {
  draft: PostingDraft;
  step: 1 | 2 | 3;
  update: (patch: Partial<PostingDraft>) => void;
  setStep: (s: 1 | 2 | 3) => void;
  reset: () => void;
}

const empty: PostingDraft = {
  title: "",
  description: "",
  listingType: "sell",
  condition: "used",
  images: [],
  locationLabel: "",
};

export const usePostingStore = create<PostingState>()(
  persist(
    (set) => ({
      draft: empty,
      step: 1,
      update: (patch) => set((s) => ({ draft: { ...s.draft, ...patch } })),
      setStep: (step) => set({ step }),
      reset: () => set({ draft: empty, step: 1 }),
    }),
    { name: "uniloop-posting-draft" }
  )
);
