import { ExpoRequest, ExpoResponse } from 'expo-router/server';
import {db} from "@/lib/db";
import {Room, RoomType, Wishlist} from "@prisma/client";
import {z} from "zod";

type RoomWithLove = Room & {
    love?: boolean;
}

export async function GET(request: ExpoRequest) {
    const search = request.expoUrl.searchParams.get("search") || "";
    const category = request.expoUrl.searchParams.get("category") as RoomType;
    const email = request.expoUrl.searchParams.get("email");

    const isCategoryExists = z.nativeEnum(RoomType).safeParse(category);

    let rooms: Room[];
    if(isCategoryExists.success) {
        rooms = await db.room.findMany({
            where: {
                OR: [
                    {
                        name: {
                            contains: search,
                            mode: "insensitive"
                        }
                    },
                    {
                        description: {
                            contains: search,
                            mode: "insensitive"
                        }
                    }
                ],
                room_type: {
                    equals: category
                }
            },
        });
    } else {
        rooms = await db.room.findMany({
            where: {
                OR: [
                    {
                        name: {
                            contains: search,
                            mode: "insensitive"
                        }
                    },
                    {
                        description: {
                            contains: search,
                            mode: "insensitive"
                        }
                    }
                ]
            }
        });
    }

    let wishlist: Wishlist[] = [];
    if(!!email) {
         wishlist = await db.wishlist.findMany({
            where: {
                user: {
                    email
                }
            }
        });
    }

    let roomsWithLove: RoomWithLove[] = rooms.map(room => {
        const isLoved = wishlist.some(wish => wish.roomId === room.id);
        return {
            ...room,
            love: isLoved
        }
    });

    return ExpoResponse.json(roomsWithLove);
}
