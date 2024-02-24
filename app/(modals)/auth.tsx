import {useOAuth} from "@clerk/clerk-expo";
import {Ionicons} from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";
import {View, Text, StyleSheet, Pressable, ScrollView} from "react-native";

import Colors from "@/constants/Colors";
import {defaultStyles} from "@/constants/Styles";
import {useWarmUpBrowser} from "@/hooks/useWarmUpBrowser";
import {useRouter} from "expo-router";
import {useCallback, useState} from "react";
import {SignIn} from "@/components/SignIn";
import {SignUp} from "@/components/SignUp";

enum OAuthStrategies {
    Google = "oauth_google",
    Facebook = "oauth_facebook",
    Apple = "oauth_apple",
}

WebBrowser.maybeCompleteAuthSession();

export default function AuthModal() {
    useWarmUpBrowser();

    const router = useRouter();
    const [isSignUp, setIsSignUp] = useState<boolean>(false);
    const {startOAuthFlow: googleAuth} = useOAuth({strategy: OAuthStrategies.Google});
    const {startOAuthFlow: facebookAuth} = useOAuth({strategy: OAuthStrategies.Facebook});
    const {startOAuthFlow: appleAuth} = useOAuth({strategy: OAuthStrategies.Apple});

    const onSelectAuth = useCallback(async (strategy: OAuthStrategies) => {
        const selectedAuth = {
            [OAuthStrategies.Google]: googleAuth,
            [OAuthStrategies.Facebook]: facebookAuth,
            [OAuthStrategies.Apple]: appleAuth,
        }[strategy];

        try {
            const {createdSessionId, setActive} = await selectedAuth();
            if(createdSessionId) {
                await setActive!({session: createdSessionId});
                router.back();
            }
        } catch (error) {
            console.error("[OAUTH_ERROR]: ",error);
        }
    }, [googleAuth, facebookAuth, appleAuth, router]);

    return (
        <ScrollView style={styles.container}>
            {!isSignUp ? <SignIn /> : <SignUp />}
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 20,
                    gap: 5,
                }}
            >
                <Text>Don't have Account?</Text>
                <Pressable onPress={() => setIsSignUp(prevState => !prevState)}>
                    <Text style={{
                        textDecorationLine: "underline",
                        color: Colors.primary,
                    }}>
                        {!isSignUp ? "Sign Up" : "Sign in"}
                    </Text>
                </Pressable>
            </View>
            <View style={styles.separatorView}>
                <View style={{
                    borderBlockColor: "#000",
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    flex: 1,
                }} />
                <Text style={styles.separator}>or</Text>
                <View style={{
                    borderBlockColor: "#000",
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    flex: 1,
                }} />
            </View>
            <View style={{
                gap: 20
            }}>
                <Pressable style={styles.btnOutline} >
                    <Ionicons name={"call-outline"} size={24} color={Colors.grey} style={defaultStyles.btnIcon} />
                    <Text style={styles.btnOutlineText}>
                        Continue with phone
                    </Text>
                </Pressable>
                <Pressable style={styles.btnOutline} onPress={() => onSelectAuth(OAuthStrategies.Apple)}>
                    <Ionicons name={"logo-apple"} size={24} color={Colors.grey} style={defaultStyles.btnIcon} />
                    <Text style={styles.btnOutlineText}>
                        Continue with Apple
                    </Text>
                </Pressable>
                <Pressable style={styles.btnOutline} onPress={() => onSelectAuth(OAuthStrategies.Google)}>
                    <Ionicons name={"logo-google"} size={24} color={Colors.grey} style={defaultStyles.btnIcon} />
                    <Text style={styles.btnOutlineText}>
                        Continue with Google
                    </Text>
                </Pressable>
                <Pressable style={styles.btnOutline} onPress={() => onSelectAuth(OAuthStrategies.Facebook)}>
                    <Ionicons name={"logo-facebook"} size={24} color={Colors.grey} style={defaultStyles.btnIcon} />
                    <Text style={styles.btnOutlineText}>
                        Continue with facebook
                    </Text>
                </Pressable>
                <View style={{
                    height: 50,
                    backgroundColor: "transparent",
                }} />
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 26,
    },
    separatorView: {
        flexDirection: "row",
        gap: 10,
        alignItems: "center",
        marginVertical: 30,
    },
    separator: {
        fontFamily: "mon-sb",
        color: Colors.grey,
    },
    btnOutline: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: Colors.grey,
        height: 50,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        paddingHorizontal: 10,
    },
    btnOutlineText: {
        color: '#000',
        fontSize: 12,
        fontFamily: 'mon-sb',
        textTransform: 'capitalize',
    },
});

