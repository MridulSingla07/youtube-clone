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
import { ScreenContainer } from "../../components/ScreenContainer";
import { ThemeText } from "../../components/ThemeText";

export default function SettingsScreen() {
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
