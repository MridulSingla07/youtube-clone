import React from "react";
import { Text, TextStyle, TextProps, StyleProp } from "react-native";

export enum FontStyles {
  WorkSans_Light = "WorkSans_Light",
  WorkSans_Regular = "WorkSans_Regular",
  WorkSans_Medium = "WorkSans_Medium",
  WorkSans_SemiBold = "WorkSans_SemiBold",
  WorkSans_Bold = "WorkSans_Bold",
  WorkSans_Light_Italic = "WorkSans_Light_Italic",
  WorkSans_Regular_Italic = "WorkSans_Regular_Italic",
  WorkSans_Medium_Italic = "WorkSans_Medium_Italic",
  WorkSans_SemiBold_Italic = "WorkSans_SemiBold_Italic",
  WorkSans_Bold_Italic = "WorkSans_Bold_Italic",
}
interface ThemeTextProps extends TextProps {
  fontSize?: number;
  fontFamily?: FontStyles;
  style?: StyleProp<TextStyle>;
  children: React.ReactNode;
  color?: string;
}

export const ThemeText = ({
  fontSize = 14,
  fontFamily = FontStyles.WorkSans_Regular,
  style,
  color = "#000",
  children,
  ...rest
}: ThemeTextProps) => {
  const textStyle: TextStyle = {
    fontSize,
    color,
    fontFamily,
  };

  return (
    <Text style={[textStyle, style]} {...rest}>
      {children}
    </Text>
  );
};
