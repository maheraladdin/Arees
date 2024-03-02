import {View} from "react-native";
import {Stack, useGlobalSearchParams} from "expo-router";
import {ExploreHeader, Listing, ExploreMap} from "@/components/explore-page";
import {useEffect, useState} from "react";
import {Room} from "@prisma/client";


export default function ExplorePage() {

    const params = useGlobalSearchParams();
    const [items, setItems] = useState<Room[] | null>(null);

    useEffect(() => {
        console.log(params.search);
    }, [params.search]);

    useEffect(() => {
        console.log(params.category);
    }, [params.category]);

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch("/api/rooms")
                setItems(await res.json());
            } catch (e) {
                console.error(e);
            }
        })()
    }, [params.category]);

    return (
        <View style={{
            flex: 1,
            marginTop: 130,
        }}>
            <Stack.Screen options={{
                header: () => <ExploreHeader />,
            }} />
            <Listing items={items} />
            {/*<ExploreMap listings={listingGeo as RootGeo} />*/}
        </View>
    )
}