import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    WorkSans_Light: require("../assets/fonts/WorkSans-Light.ttf"),
    WorkSans_Regular: require("../assets/fonts/WorkSans-Regular.ttf"),
    WorkSans_Medium: require("../assets/fonts/WorkSans-Medium.ttf"),
    WorkSans_SemiBold: require("../assets/fonts/WorkSans-SemiBold.ttf"),
    WorkSans_Bold: require("../assets/fonts/WorkSans-Bold.ttf"),
    WorkSans_Light_Italic: require("../assets/fonts/WorkSans-LightItalic.ttf"),
    WorkSans_Regular_Italic: require("../assets/fonts/WorkSans-Italic.ttf"),
    WorkSans_Medium_Italic: require("../assets/fonts/WorkSans-MediumItalic.ttf"),
    WorkSans_SemiBold_Italic: require("../assets/fonts/WorkSans-SemiBoldItalic.ttf"),
    WorkSans_Bold_Italic: require("../assets/fonts/WorkSans-BoldItalic.ttf"),
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
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="login" />
        <Stack.Screen name="signup" />
      </Stack>
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}
