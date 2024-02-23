import {Tabs} from "expo-router";
import Colors from "@/constants/Colors";
import { Ionicons, MaterialCommunityIcons} from "@expo/vector-icons";

export default function TabsLayout() {
    return (
        <Tabs screenOptions={{
            tabBarActiveTintColor: Colors.primary,
            tabBarLabelStyle: {
                fontFamily: "mon-sb"
            }
        }}>
            <Tabs.Screen name="index" options={{
                tabBarLabel: "Explore",
                tabBarIcon: ({color, size, focused}) => <MaterialCommunityIcons name={focused ? "compass" : "compass-outline"} size={size} color={color} />
            }} />
            <Tabs.Screen name="wishlist" options={{
                tabBarLabel: "Wishlist",
                tabBarIcon: ({color, size, focused}) => <Ionicons name={focused ? "heart" : "heart-outline"} size={size} color={color} />
            }} />
            <Tabs.Screen name="inbox" options={{
                tabBarLabel: "Inbox",
                tabBarIcon: ({color, size, focused}) => <MaterialCommunityIcons name={focused ? "message" : "message-outline"} size={size} color={color} />
            }} />
            <Tabs.Screen name="profile" options={{
                tabBarLabel: "Profile",
                tabBarIcon: ({color, size , focused}) => <Ionicons name={focused ? "person-circle" : "person-circle-outline"} size={size} color={color} />
            }} />
        </Tabs>
    )
}