import React from "react";
import {
  StyleSheet,
  StyleProp,
  TextStyle,
  ViewStyle,
  Pressable,
} from "react-native";
import { FontStyles } from "./ThemeText";

interface ButtonProps {
  buttonText: string;
  onPress: () => void;
  style?: StyleProp<TextStyle | ViewStyle>;
}

export const InputField: React.FC<ButtonProps> = ({
  buttonText,
  onPress,
  style,
}) => {
  return (
    <Pressable style={[styles.button, style]} onPress={onPress}>
      {buttonText}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {},
});
