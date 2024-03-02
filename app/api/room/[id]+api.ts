import {ExpoResponse, ExpoRequest} from "expo-router/server";
import {db} from "@/lib/db";

export async function GET(req: ExpoRequest, { id }: { id: string }) {
    const room = await db.room.findUnique({
        where: {
            id
        }
    });

    return ExpoResponse.json(room);
}