import {Room} from "@prisma/client";
import BottomSheet from "@gorhom/bottom-sheet";
import {useMemo, useRef} from "react";
import {Listing} from "@/components/explore-page/index";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import Colors from "@/constants/Colors";
import {Ionicons} from "@expo/vector-icons";

type ExploreBottomSheetProps = {
    items: Room[] | null;
}

export default function ExploreBottomSheet({items}: ExploreBottomSheetProps) {
    const bottomSheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ["10%", "100%"], []);

    const showMap = () => {
        bottomSheetRef.current?.collapse();
    }

    return (
        <BottomSheet
            snapPoints={snapPoints}
            ref={bottomSheetRef}
            index={1}
            enablePanDownToClose={false}
            handleIndicatorStyle={{backgroundColor: Colors.grey}}
            style={styles.sheetContainer}
        >
            <View style={{flex: 1}}>
                <Listing items={items} />
                <View style={styles.absoluteBtn}>
                    <TouchableOpacity onPress={showMap} style={styles.btn}>
                        <Text style={styles.btnText}>Map</Text>
                        <Ionicons name={"map"} size={20} color={"#fff"} />
                    </TouchableOpacity>
                </View>
            </View>
        </BottomSheet>
    );
}

const styles = StyleSheet.create({
    sheetContainer: {
        backgroundColor: "white",
        borderRadius: 10,
        elevation: 4,
        shadowColor: "#000",
        shadowOpacity: 0.3,
        shadowRadius: 4,
        shadowOffset: {
            width: 1,
            height: 1,
        },
    },
    absoluteBtn: {
        position: "absolute",
        bottom: 30,
        width: "100%",
        alignItems: "center",
    },
    btn: {
        backgroundColor: Colors.primary,
        padding: 16,
        height: 50,
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 30,
        gap: 8
    },
    btnText: {
        color: "#fff",
        fontFamily: "mon-sb",
    }
});
