import {ExpoResponse, ExpoRequest} from "expo-router/server";
import {db} from "@/lib/db";
import {Room} from "@prisma/client";

type RoomWithLove = Room & {
    love?: boolean;
}

export async function GET(req: ExpoRequest, { id }: { id: string }) {
    const email = req.expoUrl.searchParams.get("email");
    const room = await db.room.findUnique({
        where: {
            id
        }
    });

    if(!room) return ExpoResponse.json({ message: "Room not found" });

    let roomWithLove: RoomWithLove = {
        ...room,
        love: false
    }
    if(email) {
        const wishlist = await db.wishlist.findFirst({
            where: {
                roomId: roomWithLove.id,
                user: {
                    email
                }
            }
        });
        roomWithLove.love = !!wishlist;
    }
    
    return ExpoResponse.json(roomWithLove);
}