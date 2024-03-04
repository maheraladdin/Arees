import {create} from "zustand";
import {Room} from "@prisma/client";

type RoomWithLove = Room & {
    love: boolean;
}

type ItemsState = {
    items: RoomWithLove[];
    setItems: (items: RoomWithLove[]) => void;
    toggleLove: (id: string) => void;
    loveStatus: (id: string) => boolean;
}

export const useItems = create<ItemsState>((set, get) => ({
    items: [],
    setItems: (items) => set({ items }),
    toggleLove: (id) => set(state => {
        const index = state.items.findIndex(item => item.id === id);
        const items = [...state.items];
        items[index].love = !items[index].love;
        return { items };
    }),
    loveStatus: (id) => {
        const item = get().items.find((item) => item?.id === id);
        return !!item?.love;
    }
}));