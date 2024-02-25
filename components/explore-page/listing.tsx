import {View, Text} from "react-native";
import ListingData from "@/assets/data/airbnb-listings.geo.json";

type ListingProps = {
    listing: typeof ListingData;
    category: string;
}

export default function Listing({listing, category}: ListingProps) {
    return (
        <View>
            <Text>Explore Listing</Text>
        </View>
    )
}