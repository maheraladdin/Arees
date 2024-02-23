import {Text, View} from "react-native";
import {useLocalSearchParams} from "expo-router";
export default function ListingIdPage() {
    const {id} = useLocalSearchParams<{id: string}>();
    return (
        <View>
            <Text>Listing ({id})</Text>
        </View>
    )
}