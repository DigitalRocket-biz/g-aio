export interface Thread {
    id: string;
    title: string;
    lastMessage?: string;
    isStarred: boolean;
    updatedAt: string;
}