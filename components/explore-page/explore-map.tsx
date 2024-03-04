import { View, StyleSheet, Text } from 'react-native';
import { defaultStyles } from '@/constants/Styles';
import {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import MapView from "rs-react-native-map-clustering";
import {useRouter} from 'expo-router';
import {useItems} from "@/hooks/useItems";

const INITIAL_REGION = {
    latitude: 52.5,
    longitude: 19.2,
    latitudeDelta: 8.5,
    longitudeDelta: 8.5,
};

type clusterProps = {
    id: string;
    geometry: {
        coordinates: [longitude: number, latitude: number];
    };
    onPress: () => void;
    properties: {
        point_count: number;
    };
}

const renderCluster = (cluster: clusterProps) => {

    const {
        id,
        geometry: {coordinates: [longitude, latitude]},
        onPress,
        properties: {point_count: points}
    } = cluster;

    return (
        <Marker
            key={`cluster-${id}`}
            coordinate={{
                longitude,
                latitude
            }}
            onPress={onPress}>
            <View style={styles.marker}>
                <Text
                    style={{
                        color: '#000',
                        textAlign: 'center',
                        fontFamily: 'mon-sb',
                    }}>
                    {points}
                </Text>
            </View>
        </Marker>
    );
};

const ExploreMap = () => {
    const router = useRouter();
    const items = useItems(state => state.items);

    const onMarkerPress = (id: string) => {
        router.back();
        router.push(`/listing/${id}`);
    }

    return (
        <View style={defaultStyles.container}>
            <MapView
                style={StyleSheet.absoluteFillObject}
                showsUserLocation
                showsMyLocationButton
                provider={PROVIDER_GOOGLE}
                initialRegion={INITIAL_REGION}
                renderCluster={renderCluster}
            >
                {/* Render all our marker as usual */}
                {items?.map((item) => (
                        <Marker
                            coordinate={{
                                latitude:  +item.latitude!,
                                longitude:  +item.longitude!,
                            }}
                            key={item.id}
                            onPress={onMarkerPress.bind(null, item.id)}
                        >
                            <View style={styles.marker}>
                                <Text style={styles.markerText}>€ {item.price}</Text>
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