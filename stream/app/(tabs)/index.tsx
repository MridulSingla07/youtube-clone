import React, { useState } from "react";
import { StyleSheet, View } from "react-native";

import { ScreenContainer } from "../../components/ScreenContainer";
import { InputField } from "../../components/InputFields";
import { ThemeText } from "../../components/ThemeText";
import { CustomButton } from "../../components/CustomButton";
import { router } from "expo-router";

export default function HomeScreen() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [hide, setHide] = useState(true);
  return (
    <ScreenContainer>
      <View style={styles.inputs}>
        <InputField label="Name *" value={name} onChangeText={setName} />
        <View style={styles.password}>
          <InputField
            label="Password *"
            value={password}
            onChangeText={setPassword}
            isPassword={hide}
          />
          <CustomButton buttonText="show/hide" onPress={() => setHide(!hide)} />
        </View>
      </View>
      <CustomButton buttonText="Login" onPress={() => router.push("/login")} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  inputs: {
    marginHorizontal: 30,
    // backgroundColor: "red",
    gap: 10,
  },
  password: {
    flexDirection: "row",
  },
});
