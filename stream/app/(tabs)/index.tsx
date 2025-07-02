import React, { useState } from "react";
import { StyleSheet } from "react-native";

import { ScreenContainer } from "../../components/ScreenContainer";
import { InputField } from "../../components/InputFields";
import { ThemeText } from "../../components/ThemeText";

export default function HomeScreen() {
  const [name, setName] = useState("");
  return (
    <ScreenContainer>
      <ThemeText>hello</ThemeText>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({});
