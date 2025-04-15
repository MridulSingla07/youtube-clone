import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ThemeText } from "../../components/ThemeText";

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Settings</Text>
      <TouchableOpacity onPress={() => {}}>
        <ThemeText>LOGOUT</ThemeText>
      </TouchableOpacity>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
