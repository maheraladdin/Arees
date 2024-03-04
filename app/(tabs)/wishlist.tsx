import {View} from "react-native";
import {Listing} from "@/components/explore-page";
import {defaultStyles} from "@/constants/Styles";
import {useItems} from "@/hooks/useItems";
export default function WishlistPage() {
    const wishlist = useItems(state => state.items.filter(item => item.love));
    return (
        <View style={defaultStyles.container}>
            <Listing items={wishlist} />
        </View>
    )
}