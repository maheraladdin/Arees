import {View} from "react-native";
import {ExploreMap} from "@/components/explore-page";

export default function mapModal() {
    return (
        <View style={{flex: 1}}>
            <ExploreMap />
        </View>
    )
}