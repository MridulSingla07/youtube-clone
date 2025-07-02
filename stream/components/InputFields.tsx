import React from "react";
import {
  TextInput,
  StyleSheet,
  StyleProp,
  TextStyle,
  ViewStyle,
} from "react-native";
import { FontStyles } from "./ThemeText";

interface InputFieldProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  isPassword?: boolean;
  style?: StyleProp<TextStyle | ViewStyle>;
}

export const InputField: React.FC<InputFieldProps> = ({
  value,
  onChangeText,
  placeholder = "Enter value",
  isPassword = false,
  style,
}) => {
  return (
    <TextInput
      style={[styles.input, style]}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={isPassword}
      autoCapitalize="none"
    />
  );
};

const styles = StyleSheet.create({
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 20,
    fontFamily: FontStyles.WorkSans_Regular,
  },
});
