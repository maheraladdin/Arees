import {View} from "react-native";
import {Link} from "expo-router";
export default function ExplorePage() {
    return (
        <View style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center"
        }}>
            <Link style={{paddingBottom: 100}} href={"/booking"}>Booking</Link>
            <Link style={{paddingBottom: 100}} href={"/auth"}>Login</Link>
            <Link href={"/listing/123"}>listing</Link>
        </View>
    )
}