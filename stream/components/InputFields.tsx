import React from "react";
import {
  TextInput,
  StyleSheet,
  StyleProp,
  TextStyle,
  ViewStyle,
  View,
} from "react-native";
import { FontStyles, ThemeText } from "./ThemeText";
import { COLORS_THEME_1 } from "../constants/colors";

interface InputFieldProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  label?: string;
  isPassword?: boolean;
  style?: StyleProp<TextStyle | ViewStyle>;
}

export const InputField: React.FC<InputFieldProps> = ({
  value,
  onChangeText,
  placeholder,
  isPassword = false,
  style,
  label,
}) => {
  return (
    <View>
      <ThemeText color={COLORS_THEME_1.textSecondary} fontSize={12}>
        {label}
      </ThemeText>
      <TextInput
        style={[styles.input, style]}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={isPassword}
        autoCapitalize="none"
      />
    </View>
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
    color: COLORS_THEME_1.textPrimary,
  },
});
