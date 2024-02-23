import { useFonts } from 'expo-font';
import {Stack, useRouter} from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import {Pressable} from "react-native";
import {Ionicons, MaterialIcons} from "@expo/vector-icons";


export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    "mon": require("@/assets/fonts/Montserrat-Regular.ttf"),
    "mon-sb": require("@/assets/fonts/Montserrat-SemiBold.ttf"),
    "mon-b": require("@/assets/fonts/Montserrat-Bold.ttf"),
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const router = useRouter();
  return (
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
            name="(modals)/login"
            options={{
              presentation: "modal",
              title: "Login",
              headerTitleStyle: {
              fontFamily: "mon-sb",
              },
              headerLeft: () => (<Pressable onPress={() => {router.back()}} ><Ionicons name={"close-outline"} size={28} /></Pressable>),
            }}
        />
        <Stack.Screen
            name="(modals)/booking"
            options={{
              presentation: "transparentModal",
              animation: "fade",
              title: "Booking",
              headerTitleStyle: {
                fontFamily: "mon-sb",
              },
              headerLeft: () => (<Pressable onPress={() => {router.back()}} ><Ionicons name={"close-outline"} size={28} /></Pressable>),
            }}
        />
        <Stack.Screen
            name="listing/[id]"
            options={{
              title: "",
              headerLeft: () => (<Pressable onPress={() => {router.back()}} ><MaterialIcons name={"arrow-back-ios"} size={28} /></Pressable>)
            }}
        />
      </Stack>
  );
}
