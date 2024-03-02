import { ExpoRequest, ExpoResponse } from 'expo-router/server';
import {db} from "@/lib/db";

export async function GET(request: ExpoRequest) {
    const rooms = await db.room.findMany();
    return ExpoResponse.json(rooms);
}
