import { create } from "zustand"

export interface UIState {
  // Sidebar & Navigation
  isSidebarOpen: boolean
  isSidebarCollapsed: boolean
  setSidebarOpen: (isOpen: boolean) => void
  toggleSidebar: () => void
  toggleSidebarCollapse: () => void

  // Search & Command Palette
  isSearchOpen: boolean
  setSearchOpen: (isOpen: boolean) => void
  toggleSearch: () => void

  // Mobile Drawer
  isMobileDrawerOpen: boolean
  setMobileDrawerOpen: (isOpen: boolean) => void

  // Notification Sheet
  isNotificationSheetOpen: boolean
  setNotificationSheetOpen: (isOpen: boolean) => void
}

export const useUIStore = create<UIState>((set) => ({
  isSidebarOpen: false,
  isSidebarCollapsed: false,
  setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  toggleSidebarCollapse: () =>
    set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),

  isSearchOpen: false,
  setSearchOpen: (isOpen) => set({ isSearchOpen: isOpen }),
  toggleSearch: () => set((state) => ({ isSearchOpen: !state.isSearchOpen })),

  isMobileDrawerOpen: false,
  setMobileDrawerOpen: (isOpen) => set({ isMobileDrawerOpen: isOpen }),

  isNotificationSheetOpen: false,
  setNotificationSheetOpen: (isOpen) =>
    set({ isNotificationSheetOpen: isOpen }),
}))
