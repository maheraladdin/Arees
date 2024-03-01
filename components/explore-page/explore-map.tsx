import { View, StyleSheet, Text } from 'react-native';
import { defaultStyles } from '@/constants/Styles';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import {useRouter} from 'expo-router';
import { Root } from "@/types/listingGeo";

type ExploreMapProps = {
    listings: Root;
}

const ExploreMap = ({ listings }: ExploreMapProps) => {
    const router = useRouter();

    const onMarkerPress = (id: string) => {
        router.push(`/listing/${id}`);
    }

    return (
        <View style={defaultStyles.container}>
            <MapView
                style={StyleSheet.absoluteFillObject}
                showsUserLocation
                showsMyLocationButton
                provider={PROVIDER_GOOGLE}
            >
                {/* Render all our marker as usual */}
                {listings.features.map((item) => (
                        <Marker
                            coordinate={{
                                latitude:  +item.properties.latitude,
                                longitude:  +item.properties.longitude,
                            }}
                            key={item.properties.id}
                            onPress={onMarkerPress.bind(null, item.properties.id)}
                            >
                                <View style={styles.marker}>
                                    <Text style={styles.markerText}>€ {item.properties.price}</Text>
                                </View>
                        </Marker>
                ))}
            </MapView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    marker: {
        padding: 8,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        elevation: 5,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 6,
        shadowOffset: {
            width: 1,
            height: 10,
        },
    },
    markerText: {
        fontSize: 14,
        fontFamily: 'mon-sb',
    },
    locateBtn: {
        position: 'absolute',
        top: 70,
        right: 20,
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 6,
        shadowOffset: {
            width: 1,
            height: 10,
        },
    },
});

export default ExploreMap;