import {View} from "react-native";
import {Stack, useGlobalSearchParams} from "expo-router";
import {ExploreHeader, Listing} from "@/components/explore-page";
import {useEffect, useMemo} from "react";
import listing from "@/assets/data/airbnb-listings.json";
import {Root} from "@/types/listing";


export default function ExplorePage() {

    const params = useGlobalSearchParams();
    const items = useMemo(() => listing as Root[], []);

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
            <Listing items={items} category={params.category as string} />
        </View>
    )
}