import {ExpoRequest, ExpoResponse} from "expo-router/server";
import {db} from "@/lib/db";

export async function POST(request: ExpoRequest) {
    const body = await request.json();

    if (!body.email) {
        return ExpoResponse.json({ message: "Email is required" });
    }

    const user = await db.user.findUnique({
        where: {
            email: body.email
        }
    });

    if(user) return ExpoResponse.json({user, message: "User already exists"});

    const newUser = await db.user.create({
        data: {
            email: body.email
        }
    });

    return ExpoResponse.json({user: newUser, message: "User created successfully"});
}