import {View} from "react-native";
import {Stack, useGlobalSearchParams} from "expo-router";
import {ExploreHeader, Listing} from "@/components/explore-page";
import {useEffect, useMemo} from "react";
import ListingData from "@/assets/data/airbnb-listings.geo.json";

export default function ExplorePage() {

    const params = useGlobalSearchParams();
    const items = useMemo(() => ListingData, []);

    useEffect(() => {
        console.log(params.search);
    }, [params.search]);

    useEffect(() => {
        console.log(params.category);
    }, [params.category]);

    return (
        <View style={{
            flex: 1,
            marginTop: 130,
        }}>
            <Stack.Screen options={{
                header: () => <ExploreHeader />,
            }} />
            <Listing listing={items} category={params.category as string} />
        </View>
    )
}