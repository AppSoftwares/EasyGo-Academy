// src/store/useUIStore.js
import { create } from 'zustand';

export const useUIStore = create((set) => ({
  sidebarOpen: true,
  modalOpen: false,
  modalContent: null,
  toastMessage: null,

  toggleSidebar: () => set(state => ({ sidebarOpen: !state.sidebarOpen })),
  
  openModal: (content) => set({ modalOpen: true, modalContent: content }),
  
  closeModal: () => set({ modalOpen: false, modalContent: null }),
  
  showToast: (message) => {
    set({ toastMessage: message });
    setTimeout(() => set({ toastMessage: null }), 3000);
  }
}));