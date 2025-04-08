import { StyleSheet, View } from "react-native";
import { COLORS_THEME_1 } from "../constants/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SafeScreen({ children }: any) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS_THEME_1.background,
  },
});
//  { paddingTop: insets.top }
