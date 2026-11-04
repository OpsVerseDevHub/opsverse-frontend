import { create } from "zustand";

export type NotifType = "task" | "github" | "slack" | "system";

export interface AppNotif {
  id:    string;
  type:  NotifType;
  title: string;
  body:  string;
  ts:    number;
  read:  boolean;
  link?: string;
}

interface NotifState {
  items: AppNotif[];
  unread: number;
  add:   (n: Omit<AppNotif, "id" | "ts" | "read">) => void;
  markAllRead: () => void;
  clear: () => void;
}

export const useNotifStore = create<NotifState>((set, get) => ({
  items:  [],
  unread: 0,

  add: (n) => {
    const notif: AppNotif = {
      ...n,
      id:   crypto.randomUUID(),
      ts:   Date.now(),
      read: false,
    };
    set((s) => ({
      items:  [notif, ...s.items].slice(0, 50),
      unread: s.unread + 1,
    }));
  },

  markAllRead: () =>
    set((s) => ({
      items:  s.items.map((n) => ({ ...n, read: true })),
      unread: 0,
    })),

  clear: () => set({ items: [], unread: 0 }),
}));
