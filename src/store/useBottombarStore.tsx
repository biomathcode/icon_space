import { create } from "zustand";

interface BottombarState {
  isUp: boolean;
  toggleBottombar: () => void;
  openBottombar: () => void;
  closeBottombar: () => void;
}

const useBottombarStore = create<BottombarState>((set) => ({
  isUp: false,
  toggleBottombar: () => set((state) => ({ isUp: !state.isUp })),
  openBottombar: () => set({ isUp: true }),
  closeBottombar: () => set({ isUp: false }),
}));

export default useBottombarStore;
