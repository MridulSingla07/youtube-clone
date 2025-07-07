import React from "react";
import {
  StyleSheet,
  StyleProp,
  TextStyle,
  ViewStyle,
  Pressable,
} from "react-native";
import { FontStyles, ThemeText } from "./ThemeText";
import { COLORS_THEME_1 } from "../constants/colors";

interface ButtonProps {
  buttonText: string;
  onPress: () => void;
  btnstyle?: StyleProp<ViewStyle>;
  textstyle?: StyleProp<TextStyle>;
}

export const CustomButton: React.FC<ButtonProps> = ({
  buttonText,
  onPress,
  btnstyle,
  textstyle,
}) => {
  return (
    <Pressable style={[styles.button, btnstyle]} onPress={onPress}>
      <ThemeText style={[styles.text, textstyle]}>{buttonText}</ThemeText>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS_THEME_1.buttonPrimary,
    paddingHorizontal: 12,
    paddingVertical: 7,
    alignSelf: "flex-start",
    borderRadius: 4,
    marginTop: 20,
    marginLeft: 20,
  },
  text: {
    color: "white",
    fontFamily: FontStyles.WorkSans_Medium,
    fontSize: 18,
  },
});
