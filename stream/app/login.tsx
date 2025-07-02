import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { ThemeText } from "../components/ThemeText";
import { ScreenContainer } from "../components/ScreenContainer";

export default function LoginScreen() {
  return (
    <ScreenContainer>
      <ThemeText>hello</ThemeText>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
