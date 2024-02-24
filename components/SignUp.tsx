import {useState} from "react";
import {useRouter} from "expo-router";
import {Platform, Pressable, Text, TextInput, KeyboardAvoidingView, View} from "react-native";

import { useSignUp } from "@clerk/clerk-expo";
import {defaultStyles} from "@/constants/Styles";

export function SignUp() {
    const router = useRouter();
    const { isLoaded, signUp, setActive } = useSignUp();

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [emailAddress, setEmailAddress] = useState("");
    const [password, setPassword] = useState("");
    const [pendingVerification, setPendingVerification] = useState(false);
    const [code, setCode] = useState("");

    // start the sign-up process.
    const onSignUpPress = async () => {
        if (!isLoaded) {
            return;
        }

        try {
            await signUp.create({
                firstName,
                lastName,
                emailAddress,
                password,
            });

            // send the email.
            await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

            // change the UI to our pending section.
            setPendingVerification(true);
        } catch (err: any) {
            console.error(JSON.stringify(err, null, 2));
        }
    };

    // This verifies the user using email code that is delivered.
    const onPressVerify = async () => {
        if (!isLoaded) {
            return;
        }

        try {
            const completeSignUp = await signUp.attemptEmailAddressVerification({
                code,
            });

            await setActive({ session: completeSignUp.createdSessionId });
            router.back();
        } catch (err: any) {
            console.error(JSON.stringify(err, null, 2));
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            {!pendingVerification && (
                <View
                    style={{
                        gap: 20,
                    }}
                >
                    <View>
                        <TextInput
                            autoCapitalize="none"
                            value={firstName}
                            placeholder="First Name..."
                            onChangeText={(firstName) => setFirstName(firstName)}
                            style={defaultStyles.inputField}
                            placeholderTextColor={"#EEE"}
                        />
                    </View>
                    <View>
                        <TextInput
                            autoCapitalize="none"
                            value={lastName}
                            placeholder="Last Name..."
                            onChangeText={(lastName) => setLastName(lastName)}
                            style={defaultStyles.inputField}
                            placeholderTextColor={"#EEE"}
                        />
                    </View>
                    <View>
                        <TextInput
                            autoCapitalize="none"
                            value={emailAddress}
                            placeholder="Email..."
                            onChangeText={(email) => setEmailAddress(email)}
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

                    <Pressable style={defaultStyles.btn} onPress={onSignUpPress}>
                        <Text style={defaultStyles.btnText} >Sign up</Text>
                    </Pressable>
                </View>
            )}
            {pendingVerification && (
                <View style={{
                        gap: 20,
                    }}
                >
                    <View>
                        <TextInput
                            value={code}
                            placeholder="Code..."
                            onChangeText={(code) => setCode(code)}
                            style={defaultStyles.inputField}
                            placeholderTextColor={"#EEE"}
                        />
                    </View>
                    <Pressable style={defaultStyles.btn} onPress={onPressVerify}>
                        <Text style={defaultStyles.btnText} >Verify Email</Text>
                    </Pressable>
                </View>
            )}
        </KeyboardAvoidingView>
    );
}