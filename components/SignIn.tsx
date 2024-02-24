import {useState} from "react";
import {useRouter} from "expo-router";
import { useSignIn } from "@clerk/clerk-expo";
import {Pressable, Text, TextInput, View, KeyboardAvoidingView, Platform} from "react-native";

import {defaultStyles} from "@/constants/Styles";

export function SignIn() {
    const router = useRouter();
    const { signIn, setActive, isLoaded } = useSignIn();

    const [emailAddress, setEmailAddress] = useState("");
    const [password, setPassword] = useState("");

    const onSignInPress = async () => {
        if (!isLoaded) {
            return;
        }

        try {
            const completeSignIn = await signIn.create({
                identifier: emailAddress,
                password,
            });
            // This is an important step,
            // This indicates the user is signed in
            await setActive({ session: completeSignIn.createdSessionId });
            router.back();
        } catch (err: any) {
            console.log(err);
        }
    };
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{
                gap: 20,
            }}
        >
            <View>
                <TextInput
                    autoCapitalize="none"
                    value={emailAddress}
                    placeholder="Email..."
                    onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
                    style={defaultStyles.inputField}
                    placeholderTextColor={"#EEE"}
                />
            </View>

            <View>
                <TextInput
                    value={password}
                    placeholder="Password..."
                    secureTextEntry={true}
                    onChangeText={(password) => setPassword(password)}
                    style={defaultStyles.inputField}
                    placeholderTextColor={"#EEE"}
                />
            </View>

            <Pressable style={defaultStyles.btn} onPress={onSignInPress}>
                <Text style={defaultStyles.btnText} >Sign in</Text>
            </Pressable>
        </KeyboardAvoidingView>
    );
}