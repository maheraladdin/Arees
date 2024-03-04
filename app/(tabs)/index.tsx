import {View, StyleSheet, TouchableOpacity, Text} from "react-native";
import {Stack, useGlobalSearchParams, useRouter} from "expo-router";
import {ExploreHeader, Listing} from "@/components/explore-page";
import {useEffect} from "react";
import {useItems} from "@/hooks/useItems";
import qs from "query-string";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import {Room} from "@prisma/client";
import {useUser} from "@clerk/clerk-expo";

type RoomWithLove = Room & {
    love: boolean;
}

export default function ExplorePage() {
    const {user} = useUser();
    const router = useRouter();
    const params = useGlobalSearchParams();
    const items = useItems(state => state.items);
    const setItems = useItems(state => state.setItems);

    useEffect(() => {
        (async () => {
            try {
                // get all rooms
                const url = qs.stringifyUrl({
                    url: "/api/rooms",
                    query: {
                        category: params.category,
                        search: params.search,
                        email: user?.emailAddresses[0].emailAddress,
                    }
                })
                const data: RoomWithLove[] = await fetch(url).then(res => res.json());
                setItems(data);
            } catch (e) {
                console.error(e);
            }
        })()
    }, [params.category, params.search]);

    return (
        <View style={{
            flex: 1,
            marginTop: 130,
        }}>
            <Stack.Screen options={{
                header: () => <ExploreHeader />,
            }} />
            <Listing items={items} />
            <View style={styles.absoluteBtn}>
                <TouchableOpacity onPress={(e) => {
                    e.stopPropagation();
                    router.push("/(modals)/map");
                }} style={styles.btn}>
                    <Text style={styles.btnText}>Map</Text>
                    <Ionicons name={"map"} size={20} color={"#fff"} />
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    sheetContainer: {
        backgroundColor: "white",
        borderRadius: 10,
        elevation: 4,
        shadowColor: "#000",
        shadowOpacity: 0.3,
        shadowRadius: 4,
        shadowOffset: {
            width: 1,
            height: 1,
        },
    },
    absoluteBtn: {
        position: "absolute",
        bottom: 30,
        width: "100%",
        alignItems: "center",
    },
    btn: {
        backgroundColor: Colors.primary,
        padding: 16,
        height: 50,
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 30,
        gap: 8
    },
    btnText: {
        color: "#fff",
        fontFamily: "mon-sb",
    }
});
