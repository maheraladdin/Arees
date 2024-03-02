import {View, Text, Pressable, StyleSheet} from "react-native";
import {useRef} from "react";
import {defaultStyles} from "@/constants/Styles";
import {Link} from "expo-router";
import {Image} from "expo-image";
import {Ionicons} from "@expo/vector-icons";
import Animated, {FadeInRight, FadeOutLeft} from "react-native-reanimated";
import { FlashList } from "@shopify/flash-list";
import {Room} from "@prisma/client";


type ListingProps = {
    items: Room[] | null;
}

const renderRow = ({item}: {item: Room, index: number}) => {
    return (item.review_scores_rating / item.number_of_reviews <= 10 && !!item.medium_url) ? (
        <Link href={`/listing/${item.id}`} asChild>
            <Pressable>
                <Animated.View style={styles.listing} entering={FadeInRight} exiting={FadeOutLeft} >
                    <Image
                        source={{uri: item.medium_url}}
                        style={styles.image}
                    />
                    <Pressable style={styles.heartIcon}>
                        <Ionicons name={"heart-outline"} size={24} color={"#f43f5e"}/>
                    </Pressable>
                    <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                        <Text numberOfLines={1} style={{fontFamily: "mon", width: 200}}>{item.name}</Text>
                        <View style={{flexDirection: "row", gap: 4, alignItems: "center"}}>
                            <Ionicons name={"star"} size={16} color={"#f59e0b"}/>
                            <Text
                                style={{fontFamily: "mon-sb"}}>{(item.review_scores_rating / item.number_of_reviews).toFixed(2)}</Text>
                        </View>
                    </View>
                    <Text numberOfLines={1} style={{fontFamily: "mon", width: 200}}>{item.room_type}</Text>
                    <View style={{flexDirection: 'row', gap: 4}}>
                        <Text style={{fontFamily: 'mon-sb'}}>€ {item.price}</Text>
                        <Text style={{fontFamily: 'mon'}}>night</Text>
                    </View>
                </Animated.View>
            </Pressable>
        </Link>
    ) : null
}

export default function Listing({items}: ListingProps) {
    const FlatListRef = useRef<FlashList<any> | null>(null);

    return (
        <View style={defaultStyles.container} >
            <FlashList
                estimatedItemSize={399}
                ref={FlatListRef}
                data={items}
                renderItem={renderRow}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    listing: {
        padding: 16,
        gap: 10,
        marginVertical: 16,
    },
    image: {
        width: "100%",
        aspectRatio: 1,
        borderRadius: 16,
    },
    heartIcon: {
        position: "absolute",
        right: 30,
        top: 30,
        padding: 5,
        backgroundColor: "white",
        borderRadius: 50,
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    }
});