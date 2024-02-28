import { useEffect } from 'react';
import { useFonts } from 'expo-font';
import {Pressable} from "react-native";
import {Stack, useRouter} from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import {Ionicons} from "@expo/vector-icons";
import {ClerkProvider, useAuth} from "@clerk/clerk-expo";
import * as SecureStore from "expo-secure-store";

const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
const tokenCache = {
    async getToken(key: string) {
        try {
            return SecureStore.getItemAsync(key);
        } catch (err) {
            return null;
        }
    },
    async saveToken(key: string, value: string) {
        try {
            return SecureStore.setItemAsync(key, value);
        } catch (err) {
            return;
        }
    },
};

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

  return (
      <ClerkProvider
          tokenCache={tokenCache}
          publishableKey={CLERK_PUBLISHABLE_KEY!}
      >
        <RootLayoutNav />
      </ClerkProvider>
  );
}

function RootLayoutNav() {
  const router = useRouter();
  const {isLoaded, isSignedIn} = useAuth();

    useEffect(() => {
        if (isLoaded && !isSignedIn) {
            router.push("/auth");
        }
    }, [isLoaded]);

  return (

          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
                name="(modals)/auth"
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
                    headerTitle: "",
                    headerTransparent: true,
                }}
            />
          </Stack>
  );
}
