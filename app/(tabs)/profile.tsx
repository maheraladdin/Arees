import {Pressable, Text, View} from "react-native";
import {useAuth} from "@clerk/clerk-expo";
import {Link} from "expo-router";
export default function ProfilePage() {
    const {signOut, isSignedIn} = useAuth();
    return (
        <View>
            {isSignedIn ? (
            <Pressable onPress={() => signOut()}>
                <Text>signOut</Text>
            </Pressable>
            ) : (
                <Link href={"/auth"}>
                    <Text> signIn </Text>
                </Link>
            )}
        </View>
    )
}