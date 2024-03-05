import {Image} from "expo-image";
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import React, {useLayoutEffect, useMemo, useState} from 'react';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import {View, Text, StyleSheet, Dimensions, Share, Pressable} from 'react-native';

import Animated, {
    SlideInDown,
    interpolate,
    useAnimatedRef,
    useAnimatedStyle,
    useScrollViewOffset,
} from 'react-native-reanimated';

import { defaultStyles } from '@/constants/Styles';
import {Room} from "@prisma/client";
import {useUser} from "@clerk/clerk-expo";
import {useItems} from "@/hooks/useItems";
import {Reserve} from "@/components/reserve";

const { width } = Dimensions.get('window');
const IMG_HEIGHT = 300;

type RoomWithLove = Room & {
    love: boolean;
}

export default function ListingIdPage() {
    const { id } = useLocalSearchParams<{id: string}>();
    const {user} = useUser();
    const {toggleLove, items} = useItems();
    const [heart, setHeart] = useState<boolean>(items.find(item => item.id === id)?.love || false);
    const room = useMemo(() => items.find(item => item.id === id) as RoomWithLove, [items, id]);
    const navigation = useNavigation();
    const scrollRef = useAnimatedRef<Animated.ScrollView>();

    const shareListing = async () => {
        try {
            await Share.share({
                title: room.name!,
                url: room.listing_url!,
            });
        } catch (err) {
            console.log(err);
        }
    }

    const onToggleWishlist = async (item: RoomWithLove) => {
        if(!user) return;
        // optimistic update
        setHeart(prevState => !prevState);

        // toggle wishlist
        const res = await fetch("/api/wishlist", {
            method: "PATCH",
            body: JSON.stringify({
                email: user.emailAddresses[0].emailAddress,
                roomId: item.id,
            })
        });

        // if the request fails, revert the optimistic update
        if(res.status !== 200) {
            setHeart(prevState => !prevState);
            return;
        }

        // update the wishlist state
        toggleLove(item.id);
    }

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: '',
            headerTransparent: true,

            headerBackground: () => (
                <Animated.View style={[headerAnimatedStyle, styles.header]}></Animated.View>
            ),
            headerRight: () => (
                <View style={styles.bar}>
                    <Pressable style={styles.roundButton} onPress={shareListing}>
                        <Ionicons name="share-outline" size={22} color={'#000'} />
                    </Pressable>
                    <Pressable onPress={() => onToggleWishlist(room)} style={styles.roundButton}>
                        <Ionicons name={heart ? "heart" : "heart-outline"} size={22} color={"#f43f5e"} />
                    </Pressable>
                </View>
            ),
            headerLeft: () => (
                <Pressable style={styles.roundButton} onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={24} color={'#000'} />
                </Pressable>
            ),
        });
    }, [heart]);

    const scrollOffset = useScrollViewOffset(scrollRef);

    const imageAnimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateY: interpolate(
                        scrollOffset.value,
                        [-IMG_HEIGHT, 0, IMG_HEIGHT, IMG_HEIGHT],
                        [-IMG_HEIGHT / 2, 0, IMG_HEIGHT * 0.75]
                    ),
                },
                {
                    scale: interpolate(scrollOffset.value, [-IMG_HEIGHT, 0, IMG_HEIGHT], [2, 1, 1]),
                },
            ],
        };
    });

    const headerAnimatedStyle = useAnimatedStyle(() => {
        return {
            opacity: interpolate(scrollOffset.value, [0, IMG_HEIGHT / 1.5], [0 , 1]),
        };
    }, []);

    return (
        <View style={styles.container}>
            <Animated.ScrollView
                contentContainerStyle={{ paddingBottom: 100 }}
                ref={scrollRef}
                scrollEventThrottle={16}>
                <Animated.Image
                    source={{ uri: room?.xl_picture_url as string }}
                    style={[styles.image, imageAnimatedStyle]}
                    resizeMode="cover"
                />

                <View style={styles.infoContainer}>
                    <Text style={styles.name}>{room?.name}</Text>
                    <Text style={styles.location}>
                        {room?.room_type} in {room?.smart_location}
                    </Text>
                    <Text style={styles.rooms}>
                        {room?.guests_included} guests · {room?.bedrooms} bedrooms · {room?.beds} bed ·{' '}
                        {room?.bathrooms} bathrooms
                    </Text>
                    <View style={{ flexDirection: 'row', gap: 4 }}>
                        <Ionicons name="star" size={16} />
                        <Text style={styles.ratings}>
                            {!!room?.review_scores_rating && room?.review_scores_rating / 20} · {room?.number_of_reviews} reviews
                        </Text>
                    </View>
                    <View style={styles.divider} />

                    <View style={styles.hostView}>
                        <Image source={{ uri: room?.host_picture_url as string }} style={styles.host} />

                        <View>
                            <Text style={{ fontWeight: '500', fontSize: 16 }}>Hosted by {room?.host_name}</Text>
                            <Text>Host since {room?.host_since}</Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <Text style={styles.description}>{room?.description}</Text>
                </View>
            </Animated.ScrollView>

            <Animated.View style={defaultStyles.footer} entering={SlideInDown.delay(200)}>
                <View
                    style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Pressable style={styles.footerText}>
                        <Text style={styles.footerPrice}>€{room?.price}</Text>
                        <Text>night</Text>
                    </Pressable>

                    <Reserve item={room} />
                </View>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    image: {
        height: IMG_HEIGHT,
        width: width,
    },
    infoContainer: {
        padding: 24,
        backgroundColor: '#fff',
    },
    name: {
        fontSize: 26,
        fontWeight: 'bold',
        fontFamily: 'mon-sb',
    },
    location: {
        fontSize: 18,
        marginTop: 10,
        fontFamily: 'mon-sb',
    },
    rooms: {
        fontSize: 16,
        color: Colors.grey,
        marginVertical: 4,
        fontFamily: 'mon',
    },
    ratings: {
        fontSize: 16,
        fontFamily: 'mon-sb',
    },
    divider: {
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: Colors.grey,
        marginVertical: 16,
    },
    host: {
        width: 50,
        height: 50,
        borderRadius: 50,
        backgroundColor: Colors.grey,
    },
    hostView: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    footerText: {
        height: '100%',
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    footerPrice: {
        fontSize: 18,
        fontFamily: 'mon-sb',
    },
    roundButton: {
        width: 40,
        height: 40,
        borderRadius: 50,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        color: Colors.primary,
    },
    bar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
    },
    header: {
        backgroundColor: '#fff',
        height: 100,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: Colors.grey,
    },
    description: {
        fontSize: 16,
        marginTop: 10,
        fontFamily: 'mon',
    },
});