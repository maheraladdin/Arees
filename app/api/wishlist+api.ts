import {ExpoRequest, ExpoResponse} from "expo-router/server";
import {db} from "@/lib/db";
import {Room} from "@prisma/client";

type RoomWithLove = Room & {
    love?: boolean;
}

/**
 * Add or remove a room from the user's wishlist
 * @param req
 * @constructor
 * @return {Promise<ExpoResponse>}
 * @body {email: string, roomId: string}
 * @method PATCH
 */
export async function PATCH(req: ExpoRequest) {
    const body = await req.json();
    const {email, roomId}: {email: string, roomId: string} = body;

    const user = await db.user.findUnique({
        where: {
            email
        },
        include: {
            wishlists: {
                where: {
                    roomId
                },
            }
        }
    });

    if(!user) return ExpoResponse.json({message: "User not found"});

    if(user.wishlists.length > 0) {
        const id = user.wishlists[0].id;
        await db.wishlist.delete({
            where: {
                id,
            }
        });

        return ExpoResponse.json({message: "Removed from wishlist"});
    }

    await db.wishlist.create({
        data: {
            userId: user.id,
            roomId
        }
    });

    return ExpoResponse.json({message: "Added to wishlist"});
}