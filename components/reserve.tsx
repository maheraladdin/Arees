import {defaultStyles} from "@/constants/Styles";
import {Alert, Pressable, Text} from "react-native";
import {useEffect, useState} from "react";
import {usePaymentSheet} from "@stripe/stripe-react-native";
import {useUser} from "@clerk/clerk-expo";
import {Room} from "@prisma/client";
import {usePathname} from "expo-router";

type RoomWithLove = Room & {
    love: boolean
}

export function Reserve({item}: { item: RoomWithLove }) {
    const {user} = useUser();
    const [ready, setReady] = useState(false);
    const {initPaymentSheet, presentPaymentSheet, loading} = usePaymentSheet();

    useEffect(() => {
        (async () => await initializePaymentSheet())()
    }, [item, user?.emailAddresses]);

    const initializePaymentSheet = async () => {
        if(!user?.emailAddresses[0].emailAddress) return;
        const {
            paymentIntent,
            ephemeralKey,
            customerId
        } = await fetch("/api/payment-sheet", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: user?.emailAddresses[0].emailAddress,
                price: item.price,
                currency: "eur",
            })
        }).then(res => res.json());

        if (paymentIntent && ephemeralKey && customerId) {
            const {error} = await initPaymentSheet({
                customerId: customerId,
                customerEphemeralKeySecret: ephemeralKey,
                paymentIntentClientSecret: paymentIntent,
                merchantDisplayName: item.name as string,
                allowsDelayedPaymentMethods: true,
                returnURL: "stripe-example://stripe-redirect",
            });

            if(error) {
                Alert.alert(`Error Code: ${error.code}` , error.message);
            } else {
                setReady(true);
            }
        } else {
            Alert.alert("Error", "Could not create payment intent");
        }
    }

    const buy = async () => {
        const {error} = await presentPaymentSheet();
        if(!!error) {
            // Alert.alert(`Error Code: ${error.code}` , error.message);
        } else {
            Alert.alert("Success", "Your reservation has been confirmed");
            setReady(false);
        }
    }


    return (
        <Pressable onPress={buy} disabled={ready || loading} style={[defaultStyles.btn, { paddingRight: 20, paddingLeft: 20 }]}>
            <Text style={defaultStyles.btnText}>Reserve</Text>
        </Pressable>
    )
}