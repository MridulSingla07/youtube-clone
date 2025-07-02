import { StatusBar } from "expo-status-bar";
import React, { ReactNode } from "react";
import {
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  SafeAreaView,
  StyleProp,
  ViewStyle,
} from "react-native";

interface ScreenContainerProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const ScreenContainer: React.FC<ScreenContainerProps> = ({
  children,
  style,
}) => {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <StatusBar style="auto" />
        <SafeAreaView style={[{ flex: 1 }, style]}>{children}</SafeAreaView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};
