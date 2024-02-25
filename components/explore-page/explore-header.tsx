import {
    View,
    StyleSheet,
    SafeAreaView,
    Pressable,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    FlatList,
    Text,
} from "react-native";
import {Ionicons, MaterialIcons} from "@expo/vector-icons";
import {useCallback, useEffect, useId, useRef, useState} from "react";
import * as Haptics from "expo-haptics";

import Colors from "@/constants/Colors";
import {useGlobalSearchParams, useRouter} from "expo-router";

type Category = {
    name: string;
    icon: typeof MaterialIcons.defaultProps.name;
}[]

const categories: Category = [
    {
        name: 'Tiny homes',
        icon: 'home',
    },
    {
        name: 'Cabins',
        icon: 'house-siding',
    },
    {
        name: 'Trending',
        icon: 'local-fire-department',
    },
    {
        name: 'Play',
        icon: 'videogame-asset',
    },
    {
        name: 'City',
        icon: 'apartment',
    },
    {
        name: 'Beachfront',
        icon: 'beach-access',
    },
    {
        name: 'Countryside',
        icon: 'nature-people',
    }
];

export default function ExploreHeader() {
    const id = useId();
    const router = useRouter();
    const FlatListRef = useRef<FlatList | null>(null);
    const itemsRef = useRef<Array<View | null>>([]);
    const [search, setSearch] = useState<string>("");
    const [categroyName, setCategoryName] = useState<string>("");
    const [activeIndex, setActiveIndex] = useState(0);

    const onSearch = useCallback((search: string) => {
        router.setParams({search, category: categroyName});
    },[router, categroyName]);

    const setCategory = useCallback(async (index: number) => {
        setCategoryName(categories[index].name);
        const element = itemsRef.current[index];
        setActiveIndex(index);
        element?.measure(() => {
            FlatListRef.current?.scrollToItem({animated: true, item: categories[index], viewPosition: 0.5})
        });
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        router.setParams({category: categories[index].name, search});
    }, [router, search]);


    return (
        <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <View style={styles.container}>
                    <View style={styles.actionRow}>
                        <Pressable style={styles.searchBtn}>
                            <Ionicons name={'search'} size={24} />
                            <TextInput value={search} onBlur={() => onSearch(search)} onChangeText={text => setSearch(text)} style={{fontFamily: "mon-sb"}} placeholder={"Where to?"} placeholderTextColor={"#EEE"} />
                        </Pressable>
                    </View>
                    <FlatList
                        contentContainerStyle={{
                            alignItems: 'center',
                            gap: 20,
                            paddingHorizontal: 16,
                        }}
                        horizontal
                        data={categories}
                        ref={FlatListRef}
                        renderItem={({item, index}) => (
                            <Pressable
                                style={activeIndex === index ? styles.categoriesBtnActive : styles.categoriesBtn}
                                ref={(element) => itemsRef.current[index] = element}
                                key={id + "_" + item.name}
                                onPress={setCategory.bind(null, index)}
                            >
                                <MaterialIcons
                                    name={item.icon}
                                    size={24}
                                    color={activeIndex === index ? "#000" : Colors.grey}
                                />
                                <Text style={activeIndex === index ? styles.categoryTextActive : styles.categoryText}>{item.name}</Text>
                            </Pressable>
                    )} />
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        height: 130,
    },
    actionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingBottom: 16,
        gap: 10,
    },
    searchBtn: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        gap: 10,
        padding: 14,
        alignItems: 'center',
        flex: 1,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#c2c2c2',
        borderRadius: 30,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.12,
        shadowRadius: 8,
        shadowOffset: {
            width: 1,
            height: 1,
        },
    },
    categoryText: {
        fontSize: 14,
        fontFamily: 'mon-sb',
        color: Colors.grey,
    },
    categoryTextActive: {
        fontSize: 14,
        fontFamily: 'mon-sb',
        color: '#000',
    },
    categoriesBtn: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 8,
    },
    categoriesBtnActive: {
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomColor: '#000',
        borderBottomWidth: 2,
        paddingBottom: 8,
    },
});