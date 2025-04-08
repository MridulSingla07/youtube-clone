import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SafeScreen from "../components/SafeScreen";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    WorkSans_Light: require("@/assets/fonts/WorkSans-Light"),
    WorkSans_Regular: require("@/assets/fonts/WorkSans-Regular"),
    WorkSans_Medium: require("@/assets/fonts/WorkSans-Medium"),
    WorkSans_SemiBold: require("@/assets/fonts/WorkSans-SemiBold"),
    WorkSans_Bold: require("@/assets/fonts/WorkSans-Bold"),
    WorkSans_Light_Italic: require("@/assets/fonts/WorkSans-LightItalic"),
    WorkSans_Regular_Italic: require("@/assets/fonts/WorkSans-Italic"),
    WorkSans_Medium_Italic: require("@/assets/fonts/WorkSans-MediumItalic"),
    WorkSans_SemiBold_Italic: require("@/assets/fonts/WorkSans-SemiBoldItalic"),
    WorkSans_Bold_Italic: require("@/assets/fonts/WorkSans-BoldItalic"),
  });

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
    <SafeAreaProvider>
      <SafeScreen>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="login" />
          <Stack.Screen name="signup" />
        </Stack>
      </SafeScreen>
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}
